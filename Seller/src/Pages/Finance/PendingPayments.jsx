import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdPendingActions, MdAccessTime, MdCalendarToday } from "react-icons/md";
import { FiPackage } from "react-icons/fi";

function PendingPayments() {
  const [data, setData] = useState({ pendingAmount: 0, pendingOrders: [], totalPendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/pending-payments`, {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Payments</h1>
          <p className="text-sm text-gray-500">Track your pending order payments</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MdAccessTime className="text-lg" />
          <span>Updated just now</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <MdPendingActions className="text-2xl" />
            <span className="text-sm font-medium uppercase tracking-wider">Pending Amount</span>
          </div>
          <h2 className="text-3xl font-bold">{formatINR(data.pendingAmount)}</h2>
          <p className="text-xs mt-2 opacity-80">Awaiting delivery confirmation</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <FiPackage className="text-xl" />
            <span className="text-sm font-semibold uppercase">Pending Orders</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{data.totalPendingOrders}</h2>
          <p className="text-xs text-gray-400 mt-1">Orders in processing</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <MdCalendarToday className="text-xl" />
            <span className="text-sm font-semibold uppercase">Est. Clearance</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">5-7 Days</h2>
          <p className="text-xs text-green-600 mt-1">After delivery completion</p>
        </div>
      </div>

      {/* Pending Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Pending Orders</h3>
          <span className="text-sm text-gray-500">{data.pendingOrders.length} orders</span>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading pending payments...</p>
          </div>
        ) : data.pendingOrders.length === 0 ? (
          <div className="p-12 text-center">
            <MdPendingActions className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending payments at the moment</p>
            <p className="text-sm text-gray-400 mt-1">All your orders have been cleared</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Expected Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.pendingOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-700">#{order.orderId.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{order.customer}</td>
                    <td className="px-6 py-4 text-right font-semibold text-amber-600">{formatINR(order.amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(order.expectedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">Payment Processing Info</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Payments are released 5-7 days after successful delivery</li>
          <li>• Returned orders will be deducted from pending amount</li>
          <li>• Payout requests can be made once payments are cleared</li>
        </ul>
      </div>
    </div>
  );
}

export default PendingPayments;
