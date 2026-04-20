import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../../api/client';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CubeIcon,
  UserGroupIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    total_products: 0,
    active_customers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getSummary();
      setStats(response.data.summary);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ label, value, icon: Icon, trend, color = 'primary' }) => {
    const colorClasses = {
      primary: 'from-primary-500 to-primary-600',
      emerald: 'from-emerald-500 to-emerald-600',
      amber: 'from-amber-500 to-amber-600',
      purple: 'from-purple-500 to-purple-600',
    };

    return (
      <div className="group">
        <div className="card card-hover backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
              <p className="text-3xl font-bold text-slate-900 mb-3">
                {typeof value === 'number' && value > 999999
                  ? `₹${(value / 100000).toFixed(1)}L`
                  : value}
              </p>
              {trend && (
                <div className="flex items-center gap-1">
                  {trend > 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Math.abs(trend)}% from last month
                  </span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back! 👋</h1>
        <p className="text-slate-600">Here's your business overview at a glance</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Orders"
              value={stats.total_orders}
              icon={ShoppingCartIcon}
              trend={12.5}
              color="primary"
            />
            <StatCard
              label="Total Revenue"
              value={stats.total_revenue}
              icon={CurrencyDollarIcon}
              trend={8.2}
              color="emerald"
            />
            <StatCard
              label="Products Listed"
              value={stats.total_products}
              icon={CubeIcon}
              trend={5.1}
              color="amber"
            />
            <StatCard
              label="Active Customers"
              value={stats.active_customers}
              icon={UserGroupIcon}
              trend={15.3}
              color="purple"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
                    <p className="text-sm text-slate-600 mt-1">Latest transactions from your store</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 transition-colors">
                    View all
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <ShoppingCartIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Order #ORD{String(i).padStart(3, '0')}001</p>
                          <p className="text-sm text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-900">₹5,299</span>
                        <span className="badge badge-success">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Statistics */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-primary-600" />
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  <button className="btn-primary w-full justify-center">
                    + Add Product
                  </button>
                  <button className="btn-secondary w-full justify-center">
                    📤 Bulk Import
                  </button>
                  <button className="btn-ghost w-full justify-center">
                    📊 Analytics
                  </button>
                </div>
              </div>

              {/* Performance Card */}
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900 mb-2">This Month</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700">Orders Growth</span>
                        <span className="text-xs font-bold text-primary-600">+23%</span>
                      </div>
                      <div className="w-full h-1.5 bg-primary-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700">Revenue</span>
                        <span className="text-xs font-bold text-primary-600">+18%</span>
                      </div>
                      <div className="w-full h-1.5 bg-primary-200 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
