import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/client';

const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await analyticsAPI.getSummary();
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading analytics...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹45,000</p>
              <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">128</p>
              <p className="text-green-600 text-sm mt-2">↑ 8 new orders</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">3.2%</p>
              <p className="text-green-600 text-sm mt-2">↑ 0.5% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹351</p>
              <p className="text-green-600 text-sm mt-2">↑ ₹12 from last month</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Sales Trend</h2>
              <div className="h-64 bg-gradient-to-t from-blue-100 to-transparent rounded flex items-end justify-around">
                {[65, 45, 78, 92, 68, 85, 75].map((height, idx) => (
                  <div key={idx} className="w-8 bg-blue-600 rounded-t" style={{ height: `${height}%` }} />
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-4">Last 7 days performance</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Top Products</h2>
              <div className="space-y-3">
                {['Product A', 'Product B', 'Product C', 'Product D'].map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <p className="text-gray-700 font-medium">{product}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: `${80 - idx * 15}%` }} />
                      </div>
                      <p className="text-gray-600 text-sm">{45 - idx * 10} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="text-right">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              📥 Export Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
