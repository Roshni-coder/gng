import React, { useContext, useState, useEffect, useRef } from "react";
import { FiPlus, FiArrowRight, FiTrendingUp, FiCalendar, FiDownload, FiShoppingBag, FiPackage, FiUsers, FiDollarSign, FiActivity, FiFilter, FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiEye, FiBarChart2, FiPieChart, FiTrendingDown } from "react-icons/fi";
import { LuFileSpreadsheet, LuFileText } from "react-icons/lu";
import DashBordBox from "../../Components/DashbordBoxes/DashbordBox.jsx";
import { MyContext } from "../../App.jsx";
import { useSellerOrders } from "../../hooks/useSellerOrders.js";
import { useSellerProducts } from "../../hooks/useSellerProducts.js";
import { formatINR } from "../../utils/orderMetrics.js";
import { useNavigate } from "react-router-dom";
import { exportToCSV, exportToExcel, RECENT_ORDERS_COLUMNS, DASHBOARD_STATS_COLUMNS } from "../../utils/exportUtils.js";
import { FiCheckCircle, FiTruck, FiSettings, FiClock, FiXCircle, FiRefreshCcw } from "react-icons/fi";

function DashBoard() {
  const { setIsOpenAddProductPanel } = useContext(MyContext);
  const navigate = useNavigate();
  const { orders, loading, error, stats } = useSellerOrders();
  const { products, loading: productsLoading } = useSellerProducts();
  const recentOrders = orders.slice(0, 5);
  const recentProducts = products.slice(0, 5);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const exportMenuRef = useRef(null);

  // Filter orders based on search
  const filteredOrders = orders.filter(order => 
    order._id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    order.shippingAddress?.name?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.brand?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Calculate product stats
  const productStats = {
    total: products.length,
    active: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
  };

  // Calculate order stats by status
  const orderStatusStats = {
    pending: orders.filter(o => o.status === 'Pending' || o.status === 'New').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length,
    cancelled: orders.filter(o => o.status === 'Cancelled' || o.status === 'Returned').length,
  };

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

  const handleExportDashboard = (format) => {
    // Prepare stats data for export
    const statsData = [
      { period: "Today", orders: stats?.today?.count || 0, revenue: stats?.today?.total || 0 },
      { period: "This Month", orders: stats?.month?.count || 0, revenue: stats?.month?.total || 0 },
      { period: "This Year", orders: stats?.year?.count || 0, revenue: stats?.year?.total || 0 },
      { period: "All Time", orders: stats?.overall?.count || 0, revenue: stats?.overall?.total || 0 },
    ];

    if (format === 'csv') {
      exportToCSV(statsData, 'dashboard_stats', DASHBOARD_STATS_COLUMNS);
    } else {
      exportToExcel(statsData, 'dashboard_stats', DASHBOARD_STATS_COLUMNS);
    }
    setShowExportMenu(false);
  };

  const handleExportRecentOrders = (format) => {
    if (format === 'csv') {
      exportToCSV(recentOrders, 'recent_orders', RECENT_ORDERS_COLUMNS);
    } else {
      exportToExcel(recentOrders, 'recent_orders', RECENT_ORDERS_COLUMNS);
    }
    setShowExportMenu(false);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'Shipped': 'bg-blue-100 text-blue-800 border-blue-200',
      'Processing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pending': 'bg-gray-100 text-gray-800 border-gray-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200',
      'Returned': 'bg-red-100 text-red-800 border-red-200',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Delivered': <FiCheckCircle className="text-green-600" />,
      'Shipped': <FiTruck className="text-blue-600" />,
      'Processing': <FiSettings className="text-yellow-600" />,
      'Pending': <FiClock className="text-gray-500" />,
      'Cancelled': <FiXCircle className="text-red-600" />,
      'Returned': <FiRefreshCcw className="text-orange-600" />,
    };
    return statusIcons[status] || <FiClock />;
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dashboard Stats</div>
                    <button onClick={() => handleExportDashboard('csv')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <LuFileText className="w-4 h-4 text-gray-400" /> Export as CSV
                    </button>
                    <button onClick={() => handleExportDashboard('excel')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <LuFileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export as Excel
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Orders</div>
                    <button onClick={() => handleExportRecentOrders('csv')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <LuFileText className="w-4 h-4 text-gray-400" /> Export as CSV
                    </button>
                    <button onClick={() => handleExportRecentOrders('excel')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <LuFileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export as Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatINR(stats?.overall?.total || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <FiShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats?.overall?.count || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <FiPackage className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{productStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                  <dd className="text-lg font-medium text-gray-900">{new Set(orders.map(o => o.user)).size || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
                </div>
                <div className="p-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Today's Revenue</p>
                      <p className="text-xl font-bold text-gray-900">{formatINR(stats?.today?.total || 0)}</p>
                      <p className="text-xs text-gray-400">{stats?.today?.count || 0} orders</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">This Month</p>
                      <p className="text-xl font-bold text-gray-900">{formatINR(stats?.month?.total || 0)}</p>
                      <p className="text-xs text-gray-400">{stats?.month?.count || 0} orders</p>
                    </div>
                  </div>
                  
                  {/* Order History Button */}
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <FiShoppingBag className="w-5 h-5" />
                    Order History
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setIsOpenAddProductPanel({ open: true, model: "Add Product" })}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Add New Product
                  </button>
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    View All Orders
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Manage Products
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                <button onClick={() => navigate('/orders')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  View All <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id?.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingAddress?.name || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.placedAt ? new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatINR(order.totalAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            {/* Product Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <p className="text-sm text-gray-500">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.active}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.outOfStock}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500">Low Stock (≤5)</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.lowStock}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.total}</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">All Products</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setIsOpenAddProductPanel({ open: true, model: "Add Product" })}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <FiPlus /> Add Product
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productsLoading ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading products...</td></tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found</td></tr>
                    ) : (
                      filteredProducts.slice(0, 10).map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-lg object-cover" src={product.images?.[0]?.url || '/placeholder.png'} alt="" />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.title}</div>
                                <div className="text-sm text-gray-500">{product.brand || '—'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatINR(product.price)}</div>
                            {product.oldprice && <div className="text-xs text-gray-400 line-through">{formatINR(product.oldprice)}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {product.stock === 0 ? 'Out of Stock' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3"><FiEye /></button>
                            <button className="text-gray-600 hover:text-gray-900 mr-3"><FiEdit /></button>
                            <button className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {Math.min(10, filteredProducts.length)} of {filteredProducts.length} products</p>
                <button onClick={() => navigate('/products')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All Products →</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {/* Order Status Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500 cursor-pointer hover:shadow-md" onClick={() => navigate('/orders/new')}>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{orderStatusStats.pending}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-md" onClick={() => navigate('/orders/processing')}>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{orderStatusStats.processing}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 cursor-pointer hover:shadow-md" onClick={() => navigate('/orders/shipped')}>
                <p className="text-sm text-gray-500">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{orderStatusStats.shipped}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md" onClick={() => navigate('/orders/completed')}>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{orderStatusStats.delivered}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md" onClick={() => navigate('/orders/returns')}>
                <p className="text-sm text-gray-500">Cancelled/Returned</p>
                <p className="text-2xl font-bold text-gray-900">{orderStatusStats.cancelled}</p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">All Orders</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <FiFilter className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading orders...</td></tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No orders found</td></tr>
                    ) : (
                      filteredOrders.slice(0, 10).map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id?.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingAddress?.name || "—"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.placedAt ? new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "—"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items?.length || 0} items</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatINR(order.totalAmount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                              {getStatusIcon(order.status)} {order.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-indigo-600 hover:text-indigo-900"><FiEye /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing {Math.min(10, filteredOrders.length)} of {filteredOrders.length} orders</p>
                <button onClick={() => navigate('/orders')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All Orders →</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
                  <FiTrendingUp className="text-green-500 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatINR(stats?.overall?.total || 0)}</p>
                <p className="text-sm text-gray-500 mt-1">Total revenue all time</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">This Month</span>
                    <span className="font-medium text-gray-900">{formatINR(stats?.month?.total || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Today</span>
                    <span className="font-medium text-gray-900">{formatINR(stats?.today?.total || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Order Analytics</h3>
                  <FiBarChart2 className="text-indigo-500 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.overall?.count || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Total orders received</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg. Order Value</span>
                    <span className="font-medium text-gray-900">{formatINR(stats?.overall?.count ? (stats?.overall?.total / stats?.overall?.count) : 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Completion Rate</span>
                    <span className="font-medium text-green-600">{orders.length ? Math.round((orderStatusStats.delivered / orders.length) * 100) : 0}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Product Performance</h3>
                  <FiPieChart className="text-yellow-500 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{productStats.total}</p>
                <p className="text-sm text-gray-500 mt-1">Products in catalog</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">In Stock</span>
                    <span className="font-medium text-green-600">{productStats.active}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Need Restock</span>
                    <span className="font-medium text-red-600">{productStats.outOfStock + productStats.lowStock}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Pending', count: orderStatusStats.pending, color: 'bg-yellow-500' },
                    { label: 'Processing', count: orderStatusStats.processing, color: 'bg-blue-500' },
                    { label: 'Shipped', count: orderStatusStats.shipped, color: 'bg-purple-500' },
                    { label: 'Delivered', count: orderStatusStats.delivered, color: 'bg-green-500' },
                    { label: 'Cancelled/Returned', count: orderStatusStats.cancelled, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${orders.length ? (item.count / orders.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg"><FiTrendingUp className="text-green-600" /></div>
                      <div>
                        <p className="font-medium text-gray-900">Best Performing</p>
                        <p className="text-sm text-gray-500">This month's revenue is {formatINR(stats?.month?.total || 0)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg"><FiPackage className="text-yellow-600" /></div>
                      <div>
                        <p className="font-medium text-gray-900">Inventory Alert</p>
                        <p className="text-sm text-gray-500">{productStats.outOfStock + productStats.lowStock} products need attention</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg"><FiShoppingBag className="text-blue-600" /></div>
                      <div>
                        <p className="font-medium text-gray-900">Pending Orders</p>
                        <p className="text-sm text-gray-500">{orderStatusStats.pending + orderStatusStats.processing} orders need processing</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/analytics/revenue')} className="w-full mt-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 font-medium">
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DashBoard;