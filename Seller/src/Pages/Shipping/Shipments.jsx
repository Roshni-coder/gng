import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LuSearch, LuRefreshCw, LuPackage, LuTruck, LuCheck, LuClock,
  LuMapPin, LuFilter, LuChevronDown, LuExternalLink, LuPhone, LuCalendar, LuDownload
} from "react-icons/lu";
import { exportToExcel, SHIPMENT_EXPORT_COLUMNS } from "../../utils/exportUtils";

function Shipments() {
  const [data, setData] = useState({ orders: [], statusCounts: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/shipments`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      "Pending": { 
        color: "bg-gray-100 text-gray-700", 
        icon: LuClock, 
        iconColor: "text-gray-500",
        bgColor: "bg-gray-50"
      },
      "Processing": { 
        color: "bg-amber-100 text-amber-700", 
        icon: LuPackage, 
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50"
      },
      "Shipped": { 
        color: "bg-blue-100 text-blue-700", 
        icon: LuTruck, 
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50"
      },
      "Out for Delivery": { 
        color: "bg-purple-100 text-purple-700", 
        icon: LuTruck, 
        iconColor: "text-purple-500",
        bgColor: "bg-purple-50"
      },
      "Delivered": { 
        color: "bg-green-100 text-green-700", 
        icon: LuCheck, 
        iconColor: "text-green-500",
        bgColor: "bg-green-50"
      },
      "Cancelled": { 
        color: "bg-red-100 text-red-700", 
        icon: LuPackage, 
        iconColor: "text-red-500",
        bgColor: "bg-red-50"
      }
    };
    return configs[status] || configs["Pending"];
  };

  const statusTabs = [
    { id: "all", label: "All Shipments", count: data.orders?.length || 0 },
    { id: "Processing", label: "Processing", count: data.statusCounts?.processing || 0 },
    { id: "Shipped", label: "Shipped", count: data.statusCounts?.shipped || 0 },
    { id: "Out for Delivery", label: "Out for Delivery", count: data.statusCounts?.outForDelivery || 0 },
    { id: "Delivered", label: "Delivered", count: data.statusCounts?.delivered || 0 }
  ];

  const filteredOrders = data.orders?.filter(order => {
    const matchesSearch = 
      order.orderId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Shipments</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your order shipments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(filteredOrders.map(o => ({
              orderId: o.orderId,
              customer: o.customer,
              destination: o.shippingAddress?.city || '',
              carrier: o.carrier || 'Standard',
              trackingNumber: o.trackingNumber || '',
              status: o.status,
              shippedDate: o.shippedDate,
              expectedDelivery: o.expectedDelivery
            })), `shipments_${statusFilter}`, SHIPMENT_EXPORT_COLUMNS)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
          >
            <LuDownload className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => fetchShipments(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <LuRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <LuPackage className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.statusCounts?.processing || 0}</p>
          <p className="text-sm text-gray-500">Processing</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <LuTruck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.statusCounts?.shipped || 0}</p>
          <p className="text-sm text-gray-500">In Transit</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <LuTruck className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.statusCounts?.outForDelivery || 0}</p>
          <p className="text-sm text-gray-500">Out for Delivery</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <LuCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.statusCounts?.delivered || 0}</p>
          <p className="text-sm text-gray-500">Delivered</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, tracking number, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  statusFilter === tab.id ? "bg-white/20" : "bg-gray-200"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <LuPackage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Shipments Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? "Try adjusting your search or filters" 
                : "Orders ready for shipping will appear here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order, i) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Status Icon & Order Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl ${statusConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-6 h-6 ${statusConfig.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            Order #{order.orderId?.toString().slice(-8).toUpperCase()}
                          </h4>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {order.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{order.customer}</p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <LuCalendar className="w-4 h-4" />
                            {formatDate(order.placedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <LuPackage className="w-4 h-4" />
                            {order.items?.length || 1} item{order.items?.length > 1 ? "s" : ""}
                          </span>
                          {order.trackingNumber && order.trackingNumber !== "Awaiting" && (
                            <span className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {order.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info & Amount */}
                    <div className="flex items-start justify-between lg:flex-col lg:items-end gap-4 lg:gap-2">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatINR(order.total)}</p>
                        {order.estimatedDelivery && (
                          <p className="text-xs text-gray-500">
                            Est. delivery: {formatDate(order.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.address && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <LuMapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{order.address.name}</p>
                          <p>{order.address.addressLine1}</p>
                          <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                          {order.address.phone && (
                            <p className="flex items-center gap-1 mt-1 text-gray-500">
                              <LuPhone className="w-3 h-3" /> {order.address.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline (for shipped orders) */}
                  {order.timeline && order.timeline.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-3">Tracking Updates</p>
                      <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                        {order.timeline.slice(0, 3).map((event, j) => (
                          <div key={j} className="relative">
                            <div className="absolute -left-[21px] w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                            <p className="text-sm font-medium text-gray-900">{event.status}</p>
                            <p className="text-xs text-gray-500">
                              {event.location} • {formatDate(event.timestamp)} {formatTime(event.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <LuTruck className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900 text-sm mb-2">Shipping Best Practices</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Process orders within 24 hours for better customer satisfaction</li>
              <li>• Always update tracking numbers once packages are shipped</li>
              <li>• Contact customers proactively if there are delivery delays</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shipments;
