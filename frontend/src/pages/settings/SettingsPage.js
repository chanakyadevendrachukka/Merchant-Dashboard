import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    business_name: 'My Business',
    email: 'business@example.com',
    phone: '+919876543210',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await settingsAPI.getProfile();
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await settingsAPI.updateProfile(profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {[
          { id: 'profile', name: '👤 Profile', icon: 'Profile' },
          { id: 'security', name: '🔒 Security', icon: 'Security' },
          { id: 'integrations', name: '🔗 Integrations', icon: 'Integrations' },
          { id: 'policies', name: '📋 Policies', icon: 'Policies' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profile.business_name || ''}
                    onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Third-Party Integrations</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Razorpay', 'Twilio', 'Cloudflare', 'Google Analytics'].map((service) => (
                <div key={service} className="border border-gray-300 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800">{service}</h3>
                  <button className="mt-2 text-blue-600 hover:underline text-sm font-medium">
                    Configure →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Business Policies</h2>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Shipping Policy</label>
              <textarea
                rows="4"
                placeholder="Enter your shipping policy..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Return Policy</label>
              <textarea
                rows="4"
                placeholder="Enter your return policy..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Save Policies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
