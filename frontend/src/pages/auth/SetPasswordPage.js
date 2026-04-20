import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { LockClosedIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SetPasswordPage = () => {
  const [phone, setPhone] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setPassword: setPasswordAuth } = useAuthStore();

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('setup_phone');
    const storedToken = sessionStorage.getItem('setup_token');

    if (!storedPhone || !storedToken) {
      toast.error('Session expired. Please try again.');
      navigate('/signup');
    } else {
      setPhone(storedPhone);
      setSetupToken(storedToken);
    }
  }, [navigate]);

  const validatePassword = () => {
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await setPasswordAuth(phone, password, setupToken);
      toast.success('Account created successfully!');
      sessionStorage.removeItem('signup_phone');
      sessionStorage.removeItem('setup_token');
      sessionStorage.removeItem('setup_phone');
      navigate('/onboarding');
    } catch (error) {
      const message = error.response?.data?.error || 'Password setup failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/50">
            <LockClosedIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Secure Your Account</h1>
          <p className="text-slate-400">Create a strong password to protect your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-slate-200 font-semibold mb-3 text-sm">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <LockClosedIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">Strength:</span>
                    <span className={`text-xs font-bold ${strengthScore >= 3 ? 'text-emerald-400' : strengthScore >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
                      {strengthScore >= 3 ? 'Strong' : strengthScore >= 2 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.hasNumbers ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Numbers</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Special</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-slate-200 font-semibold mb-3 text-sm">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <LockClosedIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-slate-500 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <p className="text-xs text-slate-300">
            <span className="font-semibold">🔒 Security Tip:</span> Use a combination of uppercase, lowercase, numbers, and special characters for stronger security.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© 2024 WhatsApp Bot Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
