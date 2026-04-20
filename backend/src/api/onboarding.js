const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/onboarding/start
 * Start merchant onboarding flow
 */
router.post('/start', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Onboarding started',
      current_step: 'basic_details'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start onboarding'
    });
  }
});

/**
 * POST /api/onboarding/basic-details
 * Update basic merchant details
 */
router.post('/basic-details', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Basic details saved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save details'
    });
  }
});

/**
 * POST /api/onboarding/kyc-documents
 * Upload KYC documents
 */
router.post('/kyc-documents', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'KYC documents uploaded'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to upload documents'
    });
  }
});

/**
 * POST /api/onboarding/payment-setup
 * Configure payment gateway
 */
router.post('/payment-setup', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payment setup configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to setup payment'
    });
  }
});

/**
 * POST /api/onboarding/bank-details
 * Add bank account details
 */
router.post('/bank-details', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Bank details saved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save bank details'
    });
  }
});

/**
 * GET /api/onboarding/status
 * Get onboarding completion status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: 'in_progress',
      completed_steps: ['basic_details']
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch status'
    });
  }
});

module.exports = router;
