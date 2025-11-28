import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSearch, MdLocalShipping, MdRefresh } from "react-icons/md";
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";

function TrackingOrders() {
  const [data, setData] = useState({ orders: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/tracking`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Out for Delivery": return "bg-blue-100 text-blue-700";
      case "In Transit": return "bg-yellow-100 text-yellow-700";
      case "Picked Up": return "bg-purple-100 text-purple-700";
      case "Processing": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Delivered": return <FiCheckCircle className="text-green-500" />;
      case "Out for Delivery": return <FiTruck className="text-blue-500" />;
      case "In Transit": return <MdLocalShipping className="text-yellow-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const filteredOrders = data.orders?.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" || order.status === filter;
    
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Track Orders</h1>
          <p className="text-sm text-gray-500">Monitor your shipments in real-time</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
        >
          <MdRefresh /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div 
          onClick={() => setFilter("all")}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition ${filter === "all" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}
        >
          <p className="text-sm text-gray-500">Total</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.orders?.length || 0}</h3>
        </div>
        <div 
          onClick={() => setFilter("Processing")}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition ${filter === "Processing" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}
        >
          <p className="text-sm text-gray-500">Processing</p>
          <h3 className="text-2xl font-bold text-gray-600">{data.orders?.filter(o => o.status === "Processing").length || 0}</h3>
        </div>
        <div 
          onClick={() => setFilter("In Transit")}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition ${filter === "In Transit" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}
        >
          <p className="text-sm text-gray-500">In Transit</p>
          <h3 className="text-2xl font-bold text-yellow-600">{data.orders?.filter(o => o.status === "In Transit").length || 0}</h3>
        </div>
        <div 
          onClick={() => setFilter("Out for Delivery")}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition ${filter === "Out for Delivery" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}
        >
          <p className="text-sm text-gray-500">Out for Delivery</p>
          <h3 className="text-2xl font-bold text-blue-600">{data.orders?.filter(o => o.status === "Out for Delivery").length || 0}</h3>
        </div>
        <div 
          onClick={() => setFilter("Delivered")}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition ${filter === "Delivered" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}
        >
          <p className="text-sm text-gray-500">Delivered</p>
          <h3 className="text-2xl font-bold text-green-600">{data.orders?.filter(o => o.status === "Delivered").length || 0}</h3>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search by order ID, tracking number, or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Orders List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Orders Found</h3>
            <p className="text-gray-500 mt-2">
              {searchQuery ? "Try a different search term" : "Orders with tracking will appear here"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order, i) => (
              <div key={i} className="p-5 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">{order.orderId}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{order.customerName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.shippingAddress}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatINR(order.amount)}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.courier}</p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Tracking Number:</span>
                      <span className="font-mono font-medium text-gray-800">{order.trackingNumber}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-500">Estimated Delivery:</span>
                        <span className="text-gray-800">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                {order.timeline?.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                    {order.timeline.slice(0, 3).map((event, j) => (
                      <div key={j} className="relative">
                        <div className="absolute -left-[21px] w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                        <p className="text-sm text-gray-800">{event.status}</p>
                        <p className="text-xs text-gray-500">{event.location} • {new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackingOrders;
