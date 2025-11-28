import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSearch, MdFilterList, MdDownload, MdCalendarMonth } from "react-icons/md";
import { FiArrowDownCircle, FiArrowUpCircle, FiClock, FiDollarSign } from "react-icons/fi";
import { exportToExcel, SETTLEMENT_EXPORT_COLUMNS } from "../../utils/exportUtils";

function Settlements() {
  const [settlements, setSettlements] = useState([]);
  const [stats, setStats] = useState({
    totalSettled: 0,
    pendingSettlement: 0,
    nextSettlement: null,
    avgSettlementDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    fetchSettlements();
  }, [filter]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/settlements?status=${filter}`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setSettlements(res.data.data.settlements || []);
        setStats(res.data.data.stats || stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: FiClock },
      processing: { bg: "bg-blue-100 text-blue-700 border-blue-200", icon: FiClock },
      completed: { bg: "bg-green-100 text-green-700 border-green-200", icon: FiArrowUpCircle },
      failed: { bg: "bg-red-100 text-red-700 border-red-200", icon: FiArrowDownCircle }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settlement History</h1>
          <p className="text-sm text-gray-500">Track your payment settlements from orders</p>
        </div>
        <button 
          onClick={() => exportToExcel(settlements, `settlements_${filter}`, SETTLEMENT_EXPORT_COLUMNS)}
          className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
        >
          <MdDownload /> Export Report
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <FiDollarSign className="text-xl" />
                <span className="text-sm">Total Settled</span>
              </div>
              <h3 className="text-2xl font-bold">{formatINR(stats.totalSettled)}</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-yellow-600">
                <FiClock className="text-xl" />
                <span className="text-sm">Pending Settlement</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatINR(stats.pendingSettlement)}</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <MdCalendarMonth className="text-xl" />
                <span className="text-sm">Next Settlement</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {stats.nextSettlement ? new Date(stats.nextSettlement).toLocaleDateString() : 'N/A'}
              </h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-purple-600">
                <FiClock className="text-xl" />
                <span className="text-sm">Avg. Settlement Time</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.avgSettlementDays || 0} days</h3>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MdFilterList />
              <span>Filter:</span>
            </div>
            <div className="flex gap-2">
              {["all", "pending", "processing", "completed", "failed"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Settlements List */}
          {settlements.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiDollarSign className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Settlements Found</h3>
              <p className="text-gray-500 mt-2">Your settlement history will appear here</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                    {settlements.map((settlement, i) => {
                      const statusInfo = getStatusBadge(settlement.status);
                      return (
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
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg}`}>
                              <statusInfo.icon className="text-sm" />
                              {settlement.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 text-sm">
                            {new Date(settlement.settlementDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settlement Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-semibold text-blue-800 mb-2">📅 Settlement Schedule</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Settlements are processed weekly (every Monday)</li>
                <li>• Orders delivered 7+ days ago are included</li>
                <li>• Amount is credited within 2-3 business days</li>
                <li>• Minimum settlement amount: ₹100</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-800 mb-2">💰 Deductions Include</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Platform commission ({stats.commissionRate || 10}%)</li>
                <li>• Payment gateway fees</li>
                <li>• Refunds processed during period</li>
                <li>• TDS (if applicable)</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Settlements;
