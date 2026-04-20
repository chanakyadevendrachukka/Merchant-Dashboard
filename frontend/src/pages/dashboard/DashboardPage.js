import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { analyticsAPI } from '../../api/client';

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

  const StatCard = ({ label, value, icon: Icon, trend, trendType = 'up' }) => {
    return (
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-[#111] border border-white/5 rounded-[24px] p-6 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-all"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Icon size={22} className="text-zinc-400 group-hover:text-white transition-colors" />
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            trendType === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}%
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-500 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {typeof value === 'number' && value > 999999
                ? `₹${(value / 100000).toFixed(1)}L`
                : (label.includes('Revenue') ? `₹${value.toLocaleString()}` : value)}
            </h3>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white tracking-tight mb-2"
          >
            Store Overview
          </motion.h1>
          <p className="text-zinc-500 text-lg">Real-time performance metrics for your business.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800" />
            ))}
          </div>
          <p className="text-xs text-zinc-400 font-medium">3 active managers</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-zinc-900/50 rounded-[24px] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Orders"
            value={stats.total_orders}
            icon={ShoppingCart}
            trend={12.5}
            trendType="up"
          />
          <StatCard
            label="Total Revenue"
            value={stats.total_revenue}
            icon={DollarSign}
            trend={8.2}
            trendType="up"
          />
          <StatCard
            label="Products Listed"
            value={stats.total_products}
            icon={Package}
            trend={5.1}
            trendType="up"
          />
          <StatCard
            label="Active Customers"
            value={stats.active_customers}
            icon={Users}
            trend={2.4}
            trendType="down"
          />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder / Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 shadow-2xl overflow-hidden relative group">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                  <p className="text-sm text-zinc-500">Live stream of store events</p>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <MoreHorizontal size={20} className="text-zinc-500" />
                </button>
             </div>
             
             <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <ShoppingCart size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Order #ORD-12{i}9</p>
                        <p className="text-xs text-zinc-500">2 minutes ago • Bangalore, India</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">₹1,249.00</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Confirmed</span>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Support/Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 tracking-tight">Need Help?</h3>
              <p className="text-white/70 text-sm mb-8 leading-relaxed">
                Connect with our expert support team for any custom automation needs.
              </p>
              <button className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 active:scale-95 transition-all">
                Contact Support
                <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Store Health</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span>Server Status</span>
                  <span className="text-emerald-500">99.9%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.9%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span>API Latency</span>
                  <span className="text-primary-400">12ms</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '12%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-primary-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
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
