import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdHistory, MdFilterList, MdSearch, MdDownload } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function TransactionHistory() {
  const [data, setData] = useState({ transactions: [], totalAmount: 0, pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/transactions?page=${page}&status=${statusFilter}`,
          { headers: { stoken } }
        );
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, statusFilter]);

  const filteredTransactions = data.transactions.filter(txn => 
    txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": case "Completed": return "bg-green-100 text-green-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Processing": return "bg-yellow-100 text-yellow-700";
      case "Pending": return "bg-orange-100 text-orange-700";
      case "Returned": case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
          <p className="text-sm text-gray-500">View all your order transactions</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
            <MdDownload className="text-lg" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-5 text-white">
          <p className="text-sm opacity-80">Total Transaction Value</p>
          <h3 className="text-2xl font-bold mt-1">{formatINR(data.totalAmount)}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.pagination.totalItems || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">This Page</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.transactions.length}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Avg. Order Value</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {formatINR(data.transactions.length > 0 ? data.totalAmount / data.transactions.length : 0)}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">Completed</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <MdHistory className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((txn, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">#{txn.orderId.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{txn.customer}</p>
                      <p className="text-xs text-gray-400">{txn.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs max-w-[200px] truncate">
                      {txn.items?.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">{formatINR(txn.amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {data.pagination.currentPage} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
