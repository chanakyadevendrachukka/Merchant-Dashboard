const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Joi = require('joi');
const twilio = require('twilio');

const { supabaseAdmin, supabaseClient } = require('../database/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Validation schemas
const signupSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  business_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required()
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required()
});

const loginSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  password: Joi.string().min(6).required()
});

const setPasswordSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required()
});

// Generate JWT token
const generateToken = (user, expiresIn = process.env.JWT_EXPIRY || '1h') => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      app_metadata: {
        tenant_id: user.tenant_id,
        role: user.role || 'admin'
      }
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

// Store OTP temporarily (in production, use Redis or cache)
const otpStore = {};
const storeOtp = (phone, otp) => {
  otpStore[phone] = {
    code: otp,
    createdAt: Date.now(),
    attempts: 0
  };
  // Expire OTP after 10 minutes
  setTimeout(() => delete otpStore[phone], 10 * 60 * 1000);
};

const verifyOtpCode = (phone, otp) => {
  if (!otpStore[phone]) {
    return { valid: false, error: 'OTP expired' };
  }
  
  const storedOtp = otpStore[phone];
  if (storedOtp.attempts >= 3) {
    delete otpStore[phone];
    return { valid: false, error: 'Too many attempts. Please request a new OTP.' };
  }
  
  if (storedOtp.code !== otp) {
    storedOtp.attempts++;
    return { valid: false, error: 'Invalid OTP' };
  }
  
  delete otpStore[phone];
  return { valid: true };
};

/**
 * POST /api/auth/signup-with-otp
 * Initiate signup - send OTP to phone
 */
router.post('/signup-with-otp', async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { phone, business_name, email } = value;

    // Check if merchant already exists
    const { data: existingMerchant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingMerchant) {
      return res.status(409).json({
        success: false,
        error: 'Phone number already registered'
      });
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In development, skip sending OTP (log it instead)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      storeOtp(phone, otp);
    } else {
      // Send via Twilio in production
      await twilioClient.messages.create({
        body: `Your WhatsApp Bot verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      storeOtp(phone, otp);
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone',
      phone
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and create tenant
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { error, value } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { phone, otp } = value;

    // Verify OTP
    const otpVerification = verifyOtpCode(phone, otp);
    if (!otpVerification.valid) {
      return res.status(400).json({
        success: false,
        error: otpVerification.error
      });
    }

    // Check if tenant exists (to decide between create or update)
    const { data: existingMerchant } = await supabaseAdmin
      .from('tenants')
      .select('id, tenant_id, webhook_secret')
      .eq('phone', phone)
      .single();

    let tenantId, tenantData;

    if (existingMerchant) {
      tenantId = existingMerchant.tenant_id;
      tenantData = existingMerchant;
    } else {
      // Create new tenant
      tenantId = `tenant_${uuidv4().substring(0, 8)}`;
      const webhookSecret = uuidv4();

      const { data: newTenant, error: createError } = await supabaseAdmin
        .from('tenants')
        .insert({
          tenant_id: tenantId,
          phone,
          status: 'pending_onboarding',
          webhook_secret: webhookSecret,
          commission_rate: 5,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      tenantData = newTenant;
    }

    // Generate temporary token (valid for password setup)
    const tempToken = jwt.sign(
      {
        phone,
        tenant_id: tenantId,
        type: 'temp_setup'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      setup_token: tempToken,
      tenant_id: tenantId
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP'
    });
  }
});

/**
 * POST /api/auth/set-password
 * Set password after OTP verification
 */
router.post('/set-password', async (req, res) => {
  try {
    const { setup_token } = req.headers;
    if (!setup_token) {
      return res.status(401).json({
        success: false,
        error: 'Setup token required'
      });
    }

    // Verify setup token
    let decoded;
    try {
      decoded = jwt.verify(setup_token.replace('Bearer ', ''), process.env.JWT_SECRET);
      if (decoded.type !== 'temp_setup') {
        throw new Error('Invalid token type');
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired setup token'
      });
    }

    const { error, value } = setPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { phone, password } = value;
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create admin user for tenant
    const { data: adminUser, error: userError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        tenant_id: decoded.tenant_id,
        phone,
        password_hash: passwordHash,
        role: 'owner',
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'Admin user already exists'
        });
      }
      throw userError;
    }

    // Generate JWT token
    const accessToken = generateToken(adminUser);
    const refreshToken = generateRefreshToken(adminUser);

    res.status(200).json({
      success: true,
      message: 'Password set successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: adminUser.id,
        phone: adminUser.phone,
        tenant_id: decoded.tenant_id,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set password'
    });
  }
});

/**
 * POST /api/auth/login
 * Login with phone and password
 */
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { phone, password } = value;

    // Find admin user
    const { data: adminUser, error: userError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (userError || !adminUser) {
      return res.status(401).json({
        success: false,
        error: 'Invalid phone or password'
      });
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, adminUser.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid phone or password'
      });
    }

    // Check if user is active
    if (!adminUser.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is inactive'
      });
    }

    // Generate tokens
    const accessToken = generateToken(adminUser);
    const refreshToken = generateRefreshToken(adminUser);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: adminUser.id,
        phone: adminUser.phone,
        tenant_id: adminUser.tenant_id,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Get user from database to ensure they still exist and are active
      const { data: adminUser } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('id', decoded.sub)
        .single();

      if (!adminUser || !adminUser.is_active) {
        return res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        });
      }

      // Generate new access token
      const accessToken = generateToken(adminUser);

      res.status(200).json({
        success: true,
        access_token: accessToken
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data: user } = await supabaseAdmin
      .from('admin_users')
      .select('id, phone, tenant_id, role, is_active, created_at')
      .eq('id', req.user.sub)
      .single();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token invalidation)
 */
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
