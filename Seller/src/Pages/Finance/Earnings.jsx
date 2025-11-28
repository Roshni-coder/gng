import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { LuWallet, LuClock, LuArrowUpRight, LuHistory, LuPackage } from "react-icons/lu";

function Earnings() {
  const [data, setData] = useState({ totalEarnings: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/finance/earnings`, {
          headers: { stoken }
        });
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Earnings & Payouts</h1>
        <p className="text-sm text-gray-500 mt-1">Track your revenue and transaction history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <LuWallet className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Total Earnings</span>
            </div>
            <h2 className="text-3xl font-bold">{formatINR(data.totalEarnings)}</h2>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <LuClock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Clearance</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{formatINR(0)}</h2>
          <p className="text-xs text-gray-400 mt-1">Available for payout soon</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <LuArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payout</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Processing</h2>
          <p className="text-xs text-emerald-600 mt-1">Expected: 2 Days</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <LuHistory className="text-gray-500 w-5 h-5" />
          <h3 className="font-semibold text-gray-700">Transaction History</h3>
        </div>
        
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span>Loading transactions...</span>
            </div>
          </div>
        ) : data.transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <LuPackage className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No completed transactions yet</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.transactions.map((txn, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 text-sm">#{txn.orderId?.slice(-8)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{txn.customer}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-emerald-600">+{formatINR(txn.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        txn.status === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Earnings;