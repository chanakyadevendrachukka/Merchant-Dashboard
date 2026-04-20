import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/client';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await ordersAPI.list({ status: filter !== 'all' ? filter : null });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = {
    'pending': { bg: 'bg-amber-50', badge: 'badge-warning', label: 'Pending' },
    'confirmed': { bg: 'bg-blue-50', badge: 'badge-info', label: 'Confirmed' },
    'shipped': { bg: 'bg-purple-50', badge: 'badge bg-purple-100 text-purple-700', label: 'Shipped' },
    'delivered': { bg: 'bg-emerald-50', badge: 'badge-success', label: 'Delivered' },
    'cancelled': { bg: 'bg-red-50', badge: 'badge-danger', label: 'Cancelled' },
  };

  const filteredOrders = orders.filter(order =>
    order.id?.toString().includes(searchTerm) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + (o.amount || 0), 0),
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Orders</h1>
        <p className="text-slate-600">Manage and track all your orders from here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-2">All time</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
          <p className="text-xs text-slate-500 mt-2">Awaiting action</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Completed</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.completed}</p>
          <p className="text-xs text-slate-500 mt-2">Delivered</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Revenue</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">₹{(stats.revenue / 100).toFixed(0)}</p>
          <p className="text-xs text-slate-500 mt-2">Total amount</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-12"
          />
        </div>

        {/* Filter Button */}
        <button className="btn-secondary flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filter === status
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-primary-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No orders found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <tr key={order.id} className={config.bg}>
                      <td>
                        <span className="font-semibold text-slate-900">#{String(order.id).padStart(6, '0')}</span>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium text-slate-900">{order.customer_name || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{order.customer_phone || ''}</p>
                        </div>
                      </td>
                      <td className="text-slate-600 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="font-semibold text-slate-900">₹{(order.amount / 100).toFixed(0)}</td>
                      <td>
                        <span className={`badge ${config.badge}`}>
                          {config.label}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon bg-slate-100 hover:bg-slate-200">
                          <EllipsisHorizontalIcon className="w-5 h-5 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
