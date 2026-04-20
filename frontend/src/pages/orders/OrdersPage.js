import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/client';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

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

  const statusColors = {
    'pending': 'yellow',
    'confirmed': 'blue',
    'shipped': 'purple',
    'delivered': 'green',
    'cancelled': 'red',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Orders</h1>

      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">ORD{idx + 1001}</td>
                  <td className="px-6 py-3 text-gray-600">Customer {idx + 1}</td>
                  <td className="px-6 py-3 font-medium text-gray-800">₹1,500</td>
                  <td className="px-6 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Paid</span></td>
                  <td className="px-6 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Shipped</span></td>
                  <td className="px-6 py-3 text-gray-600">Today</td>
                  <td className="px-6 py-3">
                    <button className="text-blue-600 hover:underline text-sm font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
