import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAccountBalanceWallet, MdTrendingUp, MdDownload, MdPayments, MdAccountBalance } from "react-icons/md";
import { FiDollarSign, FiClock, FiCheckCircle, FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";
import { exportToExcel, SETTLEMENT_EXPORT_COLUMNS } from "../../utils/exportUtils";

function Overview() {
  const [data, setData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    withdrawableBalance: 0,
    totalPayouts: 0,
    monthlyEarnings: [],
    recentTransactions: []
  });
  const [settlements, setSettlements] = useState([]);
  const [settlementStats, setSettlementStats] = useState({
    totalSettled: 0,
    pendingSettlement: 0,
    nextSettlement: null
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
        const [earningsRes, settlementsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/earnings?period=${period}`, {
            headers: { stoken }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/settlements?status=all`, {
            headers: { stoken }
          })
        ]);
        
        if (earningsRes.data.success) {
          setData(earningsRes.data.data);
        }
        if (settlementsRes.data.success) {
          setSettlements(settlementsRes.data.data.settlements || []);
          setSettlementStats(settlementsRes.data.data.stats || {});
        }
      } catch (err) {
        console.error("Error fetching finance data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, stoken]);

  const handleExport = () => {
    const exportData = [
      ...settlements.map(s => ({ ...s })),
      // Add summary row
      {
        settlementId: 'SUMMARY',
        periodStart: '',
        periodEnd: '',
        orderCount: settlements.reduce((sum, s) => sum + (s.orderCount || 0), 0),
        grossAmount: settlements.reduce((sum, s) => sum + (s.grossAmount || 0), 0),
        deductions: settlements.reduce((sum, s) => sum + (s.deductions || 0), 0),
        netAmount: settlements.reduce((sum, s) => sum + (s.netAmount || 0), 0),
        status: '',
        settlementDate: ''
      }
    ];
    exportToExcel(exportData, `earnings_overview_${period}`, SETTLEMENT_EXPORT_COLUMNS);
  };

  const maxEarning = Math.max(...(data.monthlyEarnings?.map(d => d.amount) || [1]));

  const getSettlementStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      failed: "bg-red-100 text-red-700 border-red-200"
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings Overview</h1>
          <p className="text-sm text-gray-500">Track your income, balance, and settlements</p>
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
            onClick={handleExport}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <a href="/payments/payouts" className="mt-3 text-sm opacity-90 block">
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

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 text-purple-600">
                <MdAccountBalance className="text-xl" />
                <span className="text-sm font-medium">Total Payouts</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{formatINR(data.totalPayouts)}</h3>
              <p className="text-sm text-gray-500 mt-2">Withdrawn to bank</p>
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

          {/* Settlements Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Settlement History</h3>
                <p className="text-sm text-gray-500 mt-1">Track your payment settlements from orders</p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Total Settled</p>
                  <p className="font-bold text-green-600">{formatINR(settlementStats.totalSettled)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Pending</p>
                  <p className="font-bold text-yellow-600">{formatINR(settlementStats.pendingSettlement)}</p>
                </div>
              </div>
            </div>

            {settlements.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FiDollarSign className="text-5xl text-gray-300 mx-auto mb-4" />
                <p>No settlements yet. Your settlement history will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Settlement ID</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Period</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Orders</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Gross Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Deductions</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Net Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.slice(0, 10).map((settlement, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-mono text-blue-600">#{settlement.settlementId}</span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {settlement.periodStart && settlement.periodEnd ? (
                            <span>
                              {new Date(settlement.periodStart).toLocaleDateString()} - {new Date(settlement.periodEnd).toLocaleDateString()}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {settlement.orderCount} orders
                          </span>
                        </td>
                        <td className="p-4 text-gray-800">{formatINR(settlement.grossAmount)}</td>
                        <td className="p-4 text-red-600">-{formatINR(settlement.deductions)}</td>
                        <td className="p-4 font-semibold text-green-600">{formatINR(settlement.netAmount)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getSettlementStatusBadge(settlement.status)}`}>
                            {settlement.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          {new Date(settlement.settlementDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-semibold text-blue-800 mb-2">💰 How Earnings Work</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Earnings are added after order delivery is confirmed</li>
                <li>• Settlement period is typically 7 days from delivery</li>
                <li>• Platform commission is deducted before crediting</li>
                <li>• Minimum payout amount is ₹500</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-800 mb-2">📅 Settlement Schedule</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Settlements are processed weekly (every Monday)</li>
                <li>• Orders delivered 7+ days ago are included</li>
                <li>• Amount is credited within 2-3 business days</li>
                <li>• Minimum settlement amount: ₹100</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Overview;
