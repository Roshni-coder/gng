import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuTicket, LuPercent, LuPlus, LuTrash2, LuPencil, LuCopy, LuCheck, LuX, LuSearch, LuFilter } from "react-icons/lu";
import { MdOutlineDiscount, MdCheckCircle, MdSchedule, MdError } from "react-icons/md";
import { FiTag, FiCalendar, FiPackage } from "react-icons/fi";

function Promotions() {
  const [activeTab, setActiveTab] = useState("coupons");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const stoken = localStorage.getItem("stoken");

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponStats, setCouponStats] = useState({ total: 0, active: 0, expired: 0, totalRedemptions: 0 });
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: "",
    usageLimit: "",
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: ""
  });

  // Discounts State
  const [products, setProducts] = useState([]);
  const [discountStats, setDiscountStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkDiscount, setBulkDiscount] = useState(10);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const tabs = [
    { id: "coupons", label: "Coupon Codes", icon: LuTicket },
    { id: "discounts", label: "Store Discounts", icon: LuPercent }
  ];

  useEffect(() => {
    if (activeTab === "coupons") {
      fetchCoupons();
    } else {
      fetchDiscounts();
    }
  }, [activeTab]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setCoupons(res.data.data.coupons || []);
        setCouponStats(res.data.data.stats || {});
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/discounts`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setProducts(res.data.data.products || []);
        setDiscountStats(res.data.data.stats || {});
      }
    } catch (err) {
      console.error("Error fetching discounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!couponForm.code || !couponForm.validUntil) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      const endpoint = editingCoupon
        ? `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons`
        : `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons`;

      const method = editingCoupon ? 'put' : 'post';
      const payload = editingCoupon 
        ? { ...couponForm, couponId: editingCoupon._id }
        : couponForm;

      await axios[method](endpoint, payload, { headers: { stoken } });

      setShowCouponModal(false);
      setEditingCoupon(null);
      resetCouponForm();
      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon:", err);
      alert(err.response?.data?.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons/${couponId}`,
        { headers: { stoken } }
      );
      fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  const handleToggleCoupon = async (couponId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons/toggle`,
        { couponId },
        { headers: { stoken } }
      );
      fetchCoupons();
    } catch (err) {
      console.error("Error toggling coupon:", err);
    }
  };

  const handleUpdateProductDiscount = async (productId, discount) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/discounts`,
        { productId, discount },
        { headers: { stoken } }
      );
      fetchDiscounts();
    } catch (err) {
      console.error("Error updating discount:", err);
    }
  };

  const handleBulkDiscount = async (action) => {
    if (selectedProducts.length === 0) {
      alert("Please select products first");
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/discounts/bulk`,
        { 
          productIds: selectedProducts, 
          discount: bulkDiscount, 
          action 
        },
        { headers: { stoken } }
      );
      setSelectedProducts([]);
      setShowBulkModal(false);
      fetchDiscounts();
    } catch (err) {
      console.error("Error applying bulk discount:", err);
    } finally {
      setSaving(false);
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 0,
      maxDiscount: "",
      usageLimit: "",
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: ""
    });
  };

  const openEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscount: coupon.maxDiscount || "",
      usageLimit: coupon.usageLimit || "",
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0]
    });
    setShowCouponModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    const validFrom = new Date(coupon.validFrom);

    if (!coupon.isActive) return { label: "Inactive", color: "text-gray-500 bg-gray-100" };
    if (validUntil < now) return { label: "Expired", color: "text-red-600 bg-red-100" };
    if (validFrom > now) return { label: "Scheduled", color: "text-blue-600 bg-blue-100" };
    return { label: "Active", color: "text-green-600 bg-green-100" };
  };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage coupons and product discounts</p>
        </div>
        {activeTab === "coupons" && (
          <button
            onClick={() => { resetCouponForm(); setEditingCoupon(null); setShowCouponModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <LuPlus className="w-4 h-4" /> Create Coupon
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ============ COUPONS TAB ============ */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Total Coupons</p>
                  <h3 className="text-2xl font-bold text-gray-900">{couponStats.total || 0}</h3>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-green-600 text-sm">Active</p>
                  <h3 className="text-2xl font-bold text-green-700">{couponStats.active || 0}</h3>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-red-600 text-sm">Expired</p>
                  <h3 className="text-2xl font-bold text-red-700">{couponStats.expired || 0}</h3>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-purple-600 text-sm">Total Redemptions</p>
                  <h3 className="text-2xl font-bold text-purple-700">{couponStats.totalRedemptions || 0}</h3>
                </div>
              </div>

              {/* Coupons List */}
              {coupons.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <LuTicket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-600 font-medium">No coupons yet</h3>
                  <p className="text-gray-400 text-sm mt-1">Create your first coupon to attract customers</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => {
                    const status = getCouponStatus(coupon);
                    return (
                      <div key={coupon._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <LuTicket className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 font-mono text-lg">{coupon.code}</h3>
                                <button
                                  onClick={() => copyToClipboard(coupon.code)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Copy code"
                                >
                                  <LuCopy className="w-4 h-4 text-gray-400" />
                                </button>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                              <p className="text-gray-500 text-sm mt-1">{coupon.description || "No description"}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MdOutlineDiscount />
                                  {coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                                </span>
                                {coupon.minOrderValue > 0 && (
                                  <span>Min: {formatCurrency(coupon.minOrderValue)}</span>
                                )}
                                <span className="flex items-center gap-1">
                                  <FiCalendar />
                                  Until {new Date(coupon.validUntil).toLocaleDateString()}
                                </span>
                                <span>Used: {coupon.usedCount || 0}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCoupon(coupon._id)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                coupon.isActive
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              {coupon.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => openEditCoupon(coupon)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <LuPencil className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <LuTrash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============ DISCOUNTS TAB ============ */}
          {activeTab === "discounts" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-900">{discountStats.totalProducts || 0}</h3>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-green-600 text-sm">On Sale</p>
                  <h3 className="text-2xl font-bold text-green-700">{discountStats.discountedCount || 0}</h3>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-600 text-sm">Full Price</p>
                  <h3 className="text-2xl font-bold text-blue-700">{discountStats.fullPriceCount || 0}</h3>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-purple-600 text-sm">Avg Discount</p>
                  <h3 className="text-2xl font-bold text-purple-700">{discountStats.avgDiscount || 0}%</h3>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{selectedProducts.length} selected</span>
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Apply Bulk Discount
                    </button>
                    <button
                      onClick={() => handleBulkDiscount('remove')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Remove Discounts
                    </button>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className={`bg-white border rounded-xl overflow-hidden hover:shadow-sm transition-all ${
                      selectedProducts.includes(product._id) ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200"
                    }`}
                  >
                    <div className="flex p-4 gap-4">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product._id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                            }
                          }}
                          className="absolute top-0 left-0 w-4 h-4 accent-indigo-600"
                        />
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden ml-5">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
                          {product.oldPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
                          )}
                          {product.discount > 0 && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="70"
                          value={product.discount || 0}
                          onChange={(e) => handleUpdateProductDiscount(product._id, parseInt(e.target.value))}
                          className="flex-1 accent-indigo-600"
                        />
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {product.discount || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                </h2>
                <button
                  onClick={() => { setShowCouponModal(false); setEditingCoupon(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="e.g., 20% off on all products"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                    placeholder="No limit"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={couponForm.validFrom}
                    onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                  <input
                    type="date"
                    value={couponForm.validUntil}
                    onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={couponForm.usageLimit}
                  onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                  placeholder="Unlimited"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowCouponModal(false); setEditingCoupon(null); }}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : (editingCoupon ? "Update Coupon" : "Create Coupon")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Discount Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Apply Bulk Discount</h2>
              <p className="text-sm text-gray-500 mt-1">
                Apply discount to {selectedProducts.length} selected products
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={bulkDiscount}
                  onChange={(e) => setBulkDiscount(parseInt(e.target.value))}
                  className="flex-1 accent-indigo-600"
                />
                <span className="text-2xl font-bold text-indigo-600 w-16 text-right">{bulkDiscount}%</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkDiscount('apply')}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Applying..." : "Apply Discount"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;
