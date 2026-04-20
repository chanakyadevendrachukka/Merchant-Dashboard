import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  Search,
  Zap,
  User
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 88 }}
        className="relative bg-[#0A0A0A] border-r border-white/5 flex flex-col z-50 overflow-hidden"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-black font-black text-xl">W</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-bold text-sm tracking-tight">WhatsApp Dash</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pro Account</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Search Bar (Framer Style) */}
        <div className="px-4 py-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder={sidebarOpen ? "Search everything..." : ""} 
              className={`w-full bg-white/5 border border-white/5 rounded-xl py-2.5 outline-none focus:ring-1 focus:ring-white/10 transition-all ${sidebarOpen ? 'pl-10 pr-4' : 'pl-4 pr-0 cursor-pointer pointer-events-none opacity-0'}`} 
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                  active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} className={`relative z-10 ${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative z-10 text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 mt-auto bg-[#0A0A0A]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-zinc-500 hover:text-red-400 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span className="text-sm font-medium">System Logout</span>}
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-white transition-all"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={20} />
            </motion.div>
            {sidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider">Collapse View</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
        {/* Subtle Background Grain */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* Global Toolbar */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-full cursor-pointer hover:bg-zinc-800 transition-all"
            >
              <Zap size={14} className="text-primary-400" />
              <span className="text-[11px] font-bold uppercase tracking-tighter">Pro Mode</span>
            </motion.div>

            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#050505]"></span>
              </button>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-white/10 flex items-center justify-center ml-2 cursor-pointer hover:opacity-80 transition-opacity">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">Account</p>
                  <p className="text-xs text-slate-500">
                    {user?.phone || 'User'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {user?.phone ? user.phone.substring(0, 1).toUpperCase() : 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
