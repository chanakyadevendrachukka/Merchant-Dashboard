import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../../api/client';

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'payments') {
        const response = await paymentsAPI.list();
        setData(response.data.data || []);
      } else {
        const response = await paymentsAPI.getSettlements();
        setData(response.data.settlements || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Payments & Settlements</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          }`}
        >
          💳 Payments
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'settlements'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          }`}
        >
          🏦 Settlements
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No {activeTab} yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">PAY001</td>
                <td className="px-6 py-3 font-medium text-gray-800">₹5,000</td>
                <td className="px-6 py-3 text-gray-600">2024-01-15</td>
                <td className="px-6 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span></td>
                <td className="px-6 py-3">
                  <button className="text-blue-600 hover:underline text-sm font-medium">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
