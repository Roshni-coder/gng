import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTrendingUp, MdShoppingCart, MdVisibility, MdStar, MdAttachMoney } from "react-icons/md";
import { FiPackage, FiTrendingUp, FiTrendingDown, FiUsers } from "react-icons/fi";

function StorePerformance() {
  const [data, setData] = useState({
    totalViews: 0,
    totalOrders: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    topProducts: [],
    recentTrends: {
      views: { value: 0, change: 0 },
      orders: { value: 0, change: 0 },
      revenue: { value: 0, change: 0 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30days");
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
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/performance?period=${period}`, {
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
  }, [period]);

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <FiTrendingUp className="text-green-500" />;
    if (change < 0) return <FiTrendingDown className="text-red-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Performance</h1>
          <p className="text-sm text-gray-500">Track your store's key metrics</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Revenue</span>
            <MdAttachMoney className="text-2xl opacity-75" />
          </div>
          <h3 className="text-2xl font-bold">{formatINR(data.totalRevenue)}</h3>
          <div className="flex items-center gap-1 mt-2 text-sm">
            {getChangeIcon(data.recentTrends?.revenue?.change)}
            <span>{Math.abs(data.recentTrends?.revenue?.change || 0)}% vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Orders</span>
            <MdShoppingCart className="text-2xl opacity-75" />
          </div>
          <h3 className="text-2xl font-bold">{data.totalOrders}</h3>
          <div className="flex items-center gap-1 mt-2 text-sm">
            {getChangeIcon(data.recentTrends?.orders?.change)}
            <span>{Math.abs(data.recentTrends?.orders?.change || 0)}% vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Store Views</span>
            <MdVisibility className="text-2xl opacity-75" />
          </div>
          <h3 className="text-2xl font-bold">{data.totalViews?.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-sm">
            {getChangeIcon(data.recentTrends?.views?.change)}
            <span>{Math.abs(data.recentTrends?.views?.change || 0)}% vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Avg Rating</span>
            <MdStar className="text-2xl opacity-75" />
          </div>
          <h3 className="text-2xl font-bold">{data.averageRating?.toFixed(1)} / 5</h3>
          <p className="text-sm mt-2 opacity-90">{data.totalReviews} reviews</p>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <MdTrendingUp className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.conversionRate?.toFixed(2)}%</h3>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(data.conversionRate * 10, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Visitors who made a purchase</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiPackage className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatINR(data.averageOrderValue)}</h3>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Average amount spent per order</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiUsers className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unique Customers</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.uniqueCustomers || 0}</h3>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Customers who purchased from you</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Top Performing Products</h3>
        </div>

        {data.topProducts?.length === 0 ? (
          <div className="p-12 text-center">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No product data available yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.topProducts?.map((product, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {i + 1}
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{product.sales} sales</p>
                  <p className="text-sm text-green-600">{formatINR(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-3">📈 Tips to Improve Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span>•</span>
            <p>Add high-quality images to increase conversion rates</p>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <p>Respond to reviews to build customer trust</p>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <p>Use promotions to boost sales during slow periods</p>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <p>Keep your inventory updated to avoid stockouts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorePerformance;
