import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/client';
import { ArrowTrendingUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

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

  const MetricCard = ({ label, value, trend, icon: Icon }) => (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600">{trend} from last month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Reports</h1>
        <p className="text-slate-600">View your business performance metrics</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard label="Total Revenue" value="₹45,000" trend="↑ 12%" icon={ArrowTrendingUpIcon} />
            <MetricCard label="Total Orders" value="128" trend="↑ 8" icon={ArrowTrendingUpIcon} />
            <MetricCard label="Conversion Rate" value="3.2%" trend="↑ 0.5%" icon={ArrowTrendingUpIcon} />
            <MetricCard label="Avg Order Value" value="₹351" trend="↑ ₹12" icon={ArrowTrendingUpIcon} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Trend</h3>
              <div className="h-64 flex items-end justify-around mb-4 px-2">
                {[65, 45, 78, 92, 68, 85, 75].map((height, idx) => (
                  <div key={idx} className="flex-1 max-w-[40px] mr-2 group">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md hover:from-primary-700 hover:to-primary-500 transition-all duration-200 cursor-pointer"
                      style={{ height: `${Math.max(height, 20)}%` }}
                      title={`Day ${idx + 1}: ₹${height}K`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">Last 7 days performance</p>
            </div>

            {/* Top Products */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performing Products</h3>
              <div className="space-y-4">
                {['Premium Headphones', 'Wireless Mouse', 'USB-C Cable', 'Phone Stand'].map((product, idx) => {
                  const percentage = 80 - idx * 15;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-900">{product}</p>
                        <p className="text-sm font-semibold text-slate-600">{45 - idx * 10} orders</p>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="btn-primary flex items-center gap-2">
              <DocumentArrowDownIcon className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
