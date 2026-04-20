import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const VerifyOtpPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyOtp(phone, otp);
      toast.success('OTP verified! Set your password.');
      // Store setup token
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🔐</h1>
          <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-gray-600 mt-2">Enter the code sent to {phone}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">6-Digit OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button className="text-blue-600 font-semibold hover:underline">
              Resend OTP
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>In Development:</strong> Check the backend logs for OTP code
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
