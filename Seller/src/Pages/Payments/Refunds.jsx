import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdRefresh, MdSearch, MdFilterList, MdInfo } from "react-icons/md";
import { FiRefreshCcw, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [stats, setStats] = useState({
    totalRefunds: 0,
    pendingRefunds: 0,
    processedRefunds: 0,
    refundAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    fetchRefunds();
  }, [statusFilter]);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/refunds?status=${statusFilter}`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setRefunds(res.data.data.refunds || []);
        setStats(res.data.data.stats || stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async (refundId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/refunds/${refundId}/approve`, {}, {
        headers: { stoken }
      });
      fetchRefunds();
    } catch (err) {
      alert("Failed to approve refund");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-blue-100 text-blue-700 border-blue-200",
      processed: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    };
    return badges[status] || badges.pending;
  };

  const filteredRefunds = refunds.filter(r => 
    r.orderId?.toLowerCase().includes(search.toLowerCase()) ||
    r.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Refund Management</h1>
          <p className="text-sm text-gray-500">Track and manage customer refund requests</p>
        </div>
        <button 
          onClick={fetchRefunds}
          className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
        >
          <MdRefresh className="text-xl" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FiRefreshCcw className="text-lg" />
                <span className="text-sm">Total Refunds</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalRefunds}</h3>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <FiClock className="text-lg" />
                <span className="text-sm">Pending</span>
              </div>
              <h3 className="text-2xl font-bold text-yellow-700">{stats.pendingRefunds}</h3>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <FiCheckCircle className="text-lg" />
                <span className="text-sm">Processed</span>
              </div>
              <h3 className="text-2xl font-bold text-green-700">{stats.processedRefunds}</h3>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FiRefreshCcw className="text-lg" />
                <span className="text-sm">Total Amount</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-700">{formatINR(stats.refundAmount)}</h3>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processed">Processed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Refunds List */}
          {filteredRefunds.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiRefreshCcw className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Refund Requests</h3>
              <p className="text-gray-500 mt-2">All refund requests will appear here</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Reason</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRefunds.map((refund, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-medium text-blue-600">#{refund.orderId}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {refund.productImage && (
                              <img 
                                src={refund.productImage} 
                                alt="" 
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-gray-800">{refund.productName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{refund.customerName}</td>
                        <td className="p-4 font-semibold text-gray-800">{formatINR(refund.amount)}</td>
                        <td className="p-4">
                          <span className="text-gray-600 text-sm">{refund.reason}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(refund.status)}`}>
                            {refund.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          {new Date(refund.requestDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {refund.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRefund(refund._id)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                              >
                                Approve
                              </button>
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                                Reject
                              </button>
                            </div>
                          )}
                          {refund.status !== 'pending' && (
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <MdInfo />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <h4 className="font-semibold text-orange-800 mb-2">⚠️ Refund Policy</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Refund requests must be responded to within 48 hours</li>
              <li>• Approved refunds are deducted from your earnings</li>
              <li>• Maintain a low refund rate for better seller rating</li>
              <li>• Contact support for disputed refund claims</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Refunds;
