import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../../api/client';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payments & Settlements</h1>
        <p className="text-slate-600">Track all your payments and settlements here</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Total Payments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">₹0</p>
          <p className="text-xs text-slate-500 mt-2">All transactions</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Pending Settlement</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">₹0</p>
          <p className="text-xs text-slate-500 mt-2">Processing</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">This Month</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">₹0</p>
          <p className="text-xs text-slate-500 mt-2">All time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'text-primary-600 border-primary-600'
              : 'text-slate-600 border-transparent hover:text-slate-800'
          }`}
        >
          <CreditCardIcon className="w-5 h-5" />
          Payments
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'settlements'
              ? 'text-primary-600 border-primary-600'
              : 'text-slate-600 border-transparent hover:text-slate-800'
          }`}
        >
          <BanknotesIcon className="w-5 h-5" />
          Settlements
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-600 font-medium text-lg">No {activeTab} yet</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-slate-900">#{String(idx + 1).padStart(6, '0')}</td>
                  <td className="font-semibold text-slate-900">₹0</td>
                  <td className="text-slate-600 text-sm">2024-01-15</td>
                  <td>
                    <span className="badge badge-success">Completed</span>
                  </td>
                  <td>
                    <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">View</button>
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

export default PaymentsPage;
