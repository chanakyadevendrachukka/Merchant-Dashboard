import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const VerifyOtpPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { verifyOtp } = useAuthStore();

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('signup_phone');
    if (!storedPhone) {
      toast.error('Please start signup process first');
      navigate('/signup');
    } else {
      setPhone(storedPhone);
    }
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyOtp(phone, otp);
      toast.success('OTP verified! Set your password.');
      sessionStorage.setItem('setup_token', response.setup_token);
      sessionStorage.setItem('setup_phone', phone);
      navigate('/set-password');
    } catch (error) {
      const message = error.response?.data?.error || 'OTP verification failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendTimer(60);
    toast.success('OTP resent to your phone!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/50">
            <ShieldCheckIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Verify OTP</h1>
          <p className="text-slate-400">Enter the code we sent to</p>
          <p className="text-slate-300 font-semibold mt-2">{phone}</p>
        </div>

        {/* OTP Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-slate-200 font-semibold mb-4 text-sm">6-Digit Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-center text-4xl tracking-widest font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                required
              />
              <p className="text-xs text-slate-400 mt-3">
                {otp.length}/6 characters entered
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-500 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-slate-400 text-sm text-center mb-4">Didn't receive the code?</p>
            <button
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 border border-white/20 rounded-lg text-slate-200 hover:bg-white/20 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className="w-4 h-4" />
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <p className="text-xs text-slate-300">
            <span className="font-semibold">💡 Tip:</span> Check your SMS inbox and spam folder. The OTP is valid for 10 minutes.
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

export default VerifyOtpPage;
