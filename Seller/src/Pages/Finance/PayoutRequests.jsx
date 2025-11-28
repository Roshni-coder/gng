import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdAccountBalance, MdAdd, MdCheck, MdClose, MdAccessTime } from "react-icons/md";
import { FiClock } from "react-icons/fi";

function PayoutRequests() {
  const [data, setData] = useState({ payouts: [], availableBalance: 0, totalWithdrawn: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [submitting, setSubmitting] = useState(false);
  const stoken = localStorage.getItem("stoken");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/payouts`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!requestAmount || parseFloat(requestAmount) <= 0) return;
    
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/payouts`,
        { amount: parseFloat(requestAmount), paymentMethod },
        { headers: { stoken } }
      );
      if (res.data.success) {
        setShowModal(false);
        setRequestAmount("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Completed": return <MdCheck className="text-green-500" />;
      case "Processing": return <FiClock className="text-blue-500" />;
      case "Pending": return <MdAccessTime className="text-yellow-500" />;
      case "Failed": case "Cancelled": return <MdClose className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Failed": case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payout Requests</h1>
          <p className="text-sm text-gray-500">Request and track your payouts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]"
        >
          <MdAdd className="text-xl" />
          <span className="font-medium">Request Payout</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <MdAccountBalance className="text-2xl" />
            <span className="text-sm font-medium uppercase tracking-wider">Available Balance</span>
          </div>
          <h2 className="text-3xl font-bold">{formatINR(data.availableBalance)}</h2>
          <p className="text-xs mt-2 opacity-80">Ready for withdrawal</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-semibold uppercase">Total Withdrawn</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{formatINR(data.totalWithdrawn)}</h2>
          <p className="text-xs text-gray-400 mt-1">Lifetime payouts</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 font-semibold uppercase">Pending Requests</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {data.payouts.filter(p => ["Pending", "Processing"].includes(p.status)).length}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Awaiting processing</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Payout History</h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : data.payouts.length === 0 ? (
          <div className="p-12 text-center">
            <MdAccountBalance className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payout requests yet</p>
            <p className="text-sm text-gray-400 mt-1">Request your first payout when you have available balance</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Request Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Processed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.payouts.map((payout, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      {formatINR(payout.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{payout.paymentMethod}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                        {getStatusIcon(payout.status)}
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {payout.processedAt ? new Date(payout.processedAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Request Payout</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <MdClose className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleRequestPayout} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Balance</label>
                <div className="text-2xl font-bold text-green-600">{formatINR(data.availableBalance)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    max={data.availableBalance}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || !requestAmount || parseFloat(requestAmount) > data.availableBalance}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayoutRequests;
