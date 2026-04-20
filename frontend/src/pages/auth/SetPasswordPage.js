import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const SetPasswordPage = () => {
  const [phone, setPhone] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      // Clear session
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🔑</h1>
          <h2 className="text-2xl font-bold text-gray-800">Set Your Password</h2>
          <p className="text-gray-600 mt-2">Create a secure password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Account will be created and you'll be redirected to onboarding
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
