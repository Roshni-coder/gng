import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdPercent, MdInfo, MdTrendingUp } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";

function CommissionDetails() {
  const [data, setData] = useState({ commissionRate: 10, totalSales: 0, totalCommission: 0, netEarnings: 0, commissionBreakdown: [] });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/commission`, {
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
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Commission Details</h1>
        <p className="text-sm text-gray-500">Understand how platform fees work</p>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <MdPercent className="text-2xl" />
            <span className="text-sm font-medium uppercase tracking-wider">Commission Rate</span>
          </div>
          <h2 className="text-4xl font-bold">{data.commissionRate}%</h2>
          <p className="text-xs mt-2 opacity-80">Platform fee per order</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-blue-500">
            <FiDollarSign className="text-xl" />
            <span className="text-sm font-semibold text-gray-500 uppercase">Total Sales</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{formatINR(data.totalSales)}</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <MdPercent className="text-xl" />
            <span className="text-sm font-semibold text-gray-500 uppercase">Total Commission</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600">-{formatINR(data.totalCommission)}</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2 text-green-500">
            <MdTrendingUp className="text-xl" />
            <span className="text-sm font-semibold text-gray-500 uppercase">Net Earnings</span>
          </div>
          <h2 className="text-2xl font-bold text-green-600">{formatINR(data.netEarnings)}</h2>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
        <MdInfo className="text-blue-500 text-2xl flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">How Commission Works</h4>
          <p className="text-sm text-blue-700">
            A {data.commissionRate}% platform fee is deducted from each completed order. This covers payment processing, 
            customer support, and platform maintenance. Your net earnings (after commission) are available for payout.
          </p>
        </div>
      </div>

      {/* Commission Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Recent Order Commissions</h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : data.commissionBreakdown.length === 0 ? (
          <div className="p-12 text-center">
            <MdPercent className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No completed orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4 text-right">Order Value</th>
                  <th className="px-6 py-4 text-center">Rate</th>
                  <th className="px-6 py-4 text-right">Commission</th>
                  <th className="px-6 py-4 text-right">Net Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.commissionBreakdown.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">#{item.orderId.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800">{formatINR(item.orderValue)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                        {item.commissionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">-{formatINR(item.commissionAmount)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">{formatINR(item.netEarnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {data.commissionBreakdown.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Summary</h4>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500">Gross Sales</p>
              <p className="text-xl font-bold text-gray-800">{formatINR(data.totalSales)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Platform Fee ({data.commissionRate}%)</p>
              <p className="text-xl font-bold text-red-600">-{formatINR(data.totalCommission)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Earnings</p>
              <p className="text-xl font-bold text-green-600">{formatINR(data.netEarnings)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommissionDetails;
