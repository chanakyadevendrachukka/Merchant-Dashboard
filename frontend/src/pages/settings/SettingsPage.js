import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { UserIcon, ShieldCheckIcon, LinkIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

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

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
    { id: 'policies', name: 'Policies', icon: DocumentCheckIcon },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${
                active
                  ? 'text-primary-600 border-primary-600'
                  : 'text-slate-600 border-transparent hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Business Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profile.business_name || ''}
                    onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    readOnly
                    className="form-input bg-slate-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-2">Phone number cannot be changed</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary mt-8"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Security Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                />
                <p className="text-xs text-slate-500 mt-2">Min 8 characters, includes uppercase, lowercase, numbers & symbols</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>
              <button className="btn-primary">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Integrations</h2>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Razorpay Payment Gateway</h3>
                    <p className="text-sm text-slate-600 mt-1">Connect your Razorpay account for payments</p>
                  </div>
                  <button className="btn-secondary text-sm">Connect</button>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Twilio SMS Integration</h3>
                    <p className="text-sm text-slate-600 mt-1">Enable SMS notifications for your customers</p>
                  </div>
                  <button className="btn-secondary text-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Policies & Agreements</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">
                  <span className="font-semibold">Terms of Service:</span> By using this platform, you agree to our terms and conditions
                </p>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-2 inline-block">
                  Read Terms →
                </a>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">
                  <span className="font-semibold">Privacy Policy:</span> Your data is protected according to our privacy policy
                </p>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-2 inline-block">
                  Read Policy →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
