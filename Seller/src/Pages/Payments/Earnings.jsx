import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAccountBalanceWallet, MdTrendingUp, MdDownload } from "react-icons/md";
import { FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";
import { exportToExcel, EARNINGS_EXPORT_COLUMNS } from "../../utils/exportUtils";

function Earnings() {
  const [data, setData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    withdrawableBalance: 0,
    monthlyEarnings: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/earnings?period=${period}`, {
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
  }, [period]);

  const maxEarning = Math.max(...(data.monthlyEarnings?.map(d => d.amount) || [1]));

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings Overview</h1>
          <p className="text-sm text-gray-500">Track your income and withdrawable balance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="6months">Last 6 Months</option>
            <option value="month">This Month</option>
          </select>
          <button 
            onClick={() => {
              const exportData = [
                { type: 'summary', description: 'Total Earnings', amount: data.totalEarnings },
                { type: 'summary', description: 'Withdrawable Balance', amount: data.withdrawableBalance },
                { type: 'summary', description: 'Pending Earnings', amount: data.pendingEarnings },
                ...data.recentTransactions
              ];
              exportToExcel(exportData, `earnings_${period}`, EARNINGS_EXPORT_COLUMNS);
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
            <MdDownload /> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <MdAccountBalanceWallet className="text-2xl" />
                <span className="text-sm font-medium">Total Earnings</span>
              </div>
              <h3 className="text-3xl font-bold">{formatINR(data.totalEarnings)}</h3>
              <div className="flex items-center gap-1 mt-3 text-sm opacity-90">
                <MdTrendingUp />
                <span>Lifetime earnings</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <FiCheckCircle className="text-xl" />
                <span className="text-sm font-medium">Withdrawable</span>
              </div>
              <h3 className="text-3xl font-bold">{formatINR(data.withdrawableBalance)}</h3>
              <a href="/seller/payments/payout-requests" className="mt-3 text-sm underline opacity-90 block">
                Request Payout →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 text-yellow-600">
                <FiClock className="text-xl" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{formatINR(data.pendingEarnings)}</h3>
              <p className="text-sm text-gray-500 mt-2">Awaiting settlement</p>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Monthly Earnings Trend</h3>
            
            {data.monthlyEarnings?.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No earnings data available
              </div>
            ) : (
              <div className="h-64 flex items-end gap-2">
                {data.monthlyEarnings?.map((month, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs text-gray-600 mb-1">{formatINR(month.amount)}</span>
                      <div 
                        className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all hover:from-green-600 hover:to-emerald-500"
                        style={{ height: `${(month.amount / maxEarning) * 200}px`, minHeight: '20px' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{month.month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Recent Earnings</h3>
            </div>

            {data.recentTransactions?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No transactions yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentTransactions?.map((tx, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className={`p-3 rounded-xl ${
                      tx.type === 'order' ? 'bg-green-100' :
                      tx.type === 'refund' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <FiDollarSign className={
                        tx.type === 'order' ? 'text-green-600' :
                        tx.type === 'refund' ? 'text-red-600' :
                        'text-blue-600'
                      } />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{tx.description}</h4>
                      <p className="text-sm text-gray-500">{tx.orderId}</p>
                    </div>

                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                        {tx.type === 'refund' ? '-' : '+'}{formatINR(tx.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">💰 How Earnings Work</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Earnings are added after order delivery is confirmed</li>
              <li>• Settlement period is typically 7 days from delivery</li>
              <li>• Platform commission is deducted before crediting</li>
              <li>• Minimum payout amount is ₹500</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Earnings;
