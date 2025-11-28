import React, { useMemo, useState, useEffect, useRef } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { LuPackage, LuDownload, LuFileSpreadsheet, LuFileText } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-toastify";
import { useSellerOrders } from "../../hooks/useSellerOrders.js";
import OrderSummaryCards from "../../Components/Orders/OrderSummaryCards.jsx";
import {
  filterOrdersByRange,
  filterOrdersByStatus,
  formatINR,
  ORDER_RANGE_TITLES,
  ORDER_STATUS_META,
} from "../../utils/orderMetrics.js";
import { exportToCSV, exportToExcel, ORDER_EXPORT_COLUMNS } from "../../utils/exportUtils.js";

function OrdersList({ focusedRange: initialRange, statusKey }) {
  const [openRow, setOpenRow] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedRange, setSelectedRange] = useState(initialRange || null);
  const exportMenuRef = useRef(null);
  const { orders, setOrders, loading, error, stats } = useSellerOrders();
  const stoken = localStorage.getItem("stoken");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDetails = (i) => {
    setOpenRow(openRow === i ? null : i);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/orders/${id}`,
        { status },
        { headers: { stoken } }
      );

      if (data.success) {
        toast.success("Order status updated!");
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o))
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = useMemo(() => {
    const byRange = filterOrdersByRange(orders, selectedRange);
    return filterOrdersByStatus(byRange, statusKey);
  }, [orders, selectedRange, statusKey]);

  const meta = statusKey ? ORDER_STATUS_META[statusKey] : null;

  const title = meta?.title || ORDER_RANGE_TITLES[selectedRange] || "Orders Overview";
  const subtitle =
    meta?.subtitle ||
    (selectedRange ? "Detailed breakdown for the selected time period" : "Your complete order analytics");

  const handleRangeClick = (range) => {
    // Toggle selection - if same range is clicked, deselect it (show all)
    setSelectedRange(prev => prev === range ? null : range);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 border-amber-100",
      Processing: "bg-blue-50 text-blue-700 border-blue-100",
      Shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
      Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Cancelled: "bg-red-50 text-red-700 border-red-100",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-100";
  };

  const handleExport = (format) => {
    const dataToExport = filteredOrders.length > 0 ? filteredOrders : orders;
    const filename = selectedRange ? `orders_${selectedRange}` : statusKey ? `orders_${statusKey}` : 'all_orders';
    
    if (format === 'csv') {
      exportToCSV(dataToExport, filename, ORDER_EXPORT_COLUMNS);
    } else {
      exportToExcel(dataToExport, filename, ORDER_EXPORT_COLUMNS);
    }
    setShowExportMenu(false);
    toast.success(`Orders exported successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <LuDownload className="w-4 h-4" />
            Export Orders
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button 
                onClick={() => handleExport('csv')} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LuFileText className="w-4 h-4 text-gray-400" /> 
                Export as CSV
              </button>
              <button 
                onClick={() => handleExport('excel')} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LuFileSpreadsheet className="w-4 h-4 text-emerald-500" /> 
                Export as Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <OrderSummaryCards
        stats={stats}
        formatAmount={formatINR}
        focusedRange={selectedRange}
        onSelectRange={handleRangeClick}
      />

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span>Loading orders…</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 border-b border-red-100">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <LuPackage className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">{meta?.emptyMessage || "No orders found in this category."}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="w-12 px-4 py-4"></th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pincode</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order, i) => (
                  <React.Fragment key={order._id}>
                    {/* Main Row */}
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleDetails(i)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                          {openRow === i ? (
                            <FaAngleUp className="w-4 h-4" />
                          ) : (
                            <FaAngleDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-900 text-sm">#{order._id.slice(-8)}</span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-gray-700">{order.shippingAddress?.name}</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-600 text-sm">{order.shippingAddress?.phone}</span>
                      </td>

                      <td className="px-4 py-4 max-w-[200px]">
                        <span className="text-gray-600 text-sm truncate block">{order.shippingAddress?.address}</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-600 text-sm">{order.shippingAddress?.pin}</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold text-gray-900">{formatINR(order.totalAmount)}</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-600 text-sm">{order.paymentId ? `#${order.paymentId.slice(-6)}` : "-"}</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <select
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer ${getStatusBadge(order.status)}`}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-600 text-sm">
                          {new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Product Details */}
                    {openRow === i && (
                      <tr>
                        <td colSpan="10" className="bg-gray-50/50 px-6 py-5">
                          <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-100">
                              <h4 className="text-sm font-semibold text-gray-700">Order Items</h4>
                            </div>
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                  <tr key={item._id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                                          {item.productId?.images?.[0]?.url ? (
                                            <img
                                              src={item.productId.images[0].url}
                                              className="w-full h-full object-cover"
                                              alt=""
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <LuPackage className="w-5 h-5 text-gray-300" />
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <p className="font-medium text-gray-900 text-sm">{item.productId?.title || "-"}</p>
                                          <p className="text-xs text-gray-500">ID: {(item.productId?._id || item.productId)?.slice(-8)}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 text-center text-gray-700">{formatINR(item.price)}</td>
                                    <td className="px-5 py-4 text-center">
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        {item.quantity}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-center font-semibold text-gray-900">{formatINR(item.price * item.quantity)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filteredOrders.length}</span> orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersList;
