import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLocalOffer, MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";
import { FiPercent, FiCalendar, FiTag } from "react-icons/fi";

function MyPromotions() {
  const [data, setData] = useState({ promotions: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    validFrom: "",
    validUntil: "",
    description: ""
  });
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
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/promotions`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons`, formData, {
        headers: { stoken }
      });
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minPurchase: "",
          maxUses: "",
          validFrom: "",
          validUntil: "",
          description: ""
        });
        fetchData();
        alert("Coupon created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/coupons/${id}`, {
        headers: { stoken }
      });
      if (res.data.success) {
        fetchData();
        alert("Coupon deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete coupon");
    }
  };

  const filteredPromotions = data.promotions?.filter(p => 
    p.code?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Expired": return "bg-red-100 text-red-700";
      case "Scheduled": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Promotions</h1>
          <p className="text-sm text-gray-500">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FiTag className="text-xl" />
            <span className="text-sm font-medium">Total Coupons</span>
          </div>
          <h3 className="text-2xl font-bold">{data.stats?.totalCoupons || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Active Coupons</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">{data.stats?.activeCoupons || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Uses</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.stats?.totalUses || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Revenue Generated</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatINR(data.stats?.revenueGenerated)}</h3>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Promotions List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="p-12 text-center">
            <MdLocalOffer className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Coupons Yet</h3>
            <p className="text-gray-500 mt-2">Create your first coupon to attract customers</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Coupon
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPromotions.map((promo, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <FiPercent className="text-2xl text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">{promo.code}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promo.status)}`}>
                      {promo.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {promo.discountType === "percentage" 
                      ? `${promo.discountValue}% off`
                      : `${formatINR(promo.discountValue)} off`}
                    {promo.minPurchase && ` • Min. ${formatINR(promo.minPurchase)}`}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> 
                      {new Date(promo.validFrom).toLocaleDateString()} - {new Date(promo.validUntil).toLocaleDateString()}
                    </span>
                    <span>Used: {promo.usedCount}/{promo.maxUses || '∞'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <MdEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(promo._id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Create Coupon</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., SAVE20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.discountType === "percentage" ? "Percentage Off" : "Amount Off (₹)"}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={formData.discountType === "percentage" ? "20" : "100"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Purchase (₹)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Internal note about this coupon..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPromotions;
