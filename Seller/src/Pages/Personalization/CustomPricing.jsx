import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdSave } from "react-icons/md";
import { FiDollarSign, FiPercent, FiTag } from "react-icons/fi";

function CustomPricing() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "fixed",
    value: 0,
    conditions: {
      minQuantity: 1,
      maxQuantity: 0,
      categories: [],
      products: []
    },
    isActive: true
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
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/pricing-rules`, {
        headers: { stoken }
      });
      if (res.data.success) setRules(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRule) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/pricing-rules/${editingRule._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/pricing-rules`, formData, {
          headers: { stoken }
        });
      }
      fetchRules();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pricing rule?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/pricing-rules/${id}`, {
        headers: { stoken }
      });
      fetchRules();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/pricing-rules/${id}/toggle`, 
        { isActive: !isActive },
        { headers: { stoken } }
      );
      fetchRules();
    } catch (err) {
      alert("Failed to toggle");
    }
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || "",
      type: rule.type || "fixed",
      value: rule.value || 0,
      conditions: rule.conditions || {
        minQuantity: 1,
        maxQuantity: 0,
        categories: [],
        products: []
      },
      isActive: rule.isActive !== false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRule(null);
    setFormData({
      name: "",
      type: "fixed",
      value: 0,
      conditions: {
        minQuantity: 1,
        maxQuantity: 0,
        categories: [],
        products: []
      },
      isActive: true
    });
  };

  const priceTypes = [
    { value: "fixed", label: "Fixed Price", icon: FiDollarSign, desc: "Add a fixed amount" },
    { value: "percentage", label: "Percentage", icon: FiPercent, desc: "Add percentage of base" },
    { value: "tiered", label: "Tiered Pricing", icon: FiTag, desc: "Price based on quantity" }
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Custom Pricing Rules</h1>
          <p className="text-sm text-gray-500">Set special pricing for personalization options</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Rule
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Pricing Types Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priceTypes.map(type => (
              <div key={type.value} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <type.icon className="text-xl text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{type.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{type.desc}</p>
              </div>
            ))}
          </div>

          {/* Rules List */}
          {rules.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiDollarSign className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Pricing Rules</h3>
              <p className="text-gray-500 mt-2 mb-4">Create custom pricing rules for personalization</p>
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Add First Rule
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Rule Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Value</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Conditions</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium text-gray-800">{rule.name}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          rule.type === 'fixed' ? 'bg-green-100 text-green-700' :
                          rule.type === 'percentage' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {rule.type === 'fixed' && <FiDollarSign />}
                          {rule.type === 'percentage' && <FiPercent />}
                          {rule.type === 'tiered' && <FiTag />}
                          {rule.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-800">
                          {rule.type === 'percentage' ? `${rule.value}%` : formatINR(rule.value)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          {rule.conditions?.minQuantity > 1 && (
                            <span>Min qty: {rule.conditions.minQuantity}</span>
                          )}
                          {rule.conditions?.maxQuantity > 0 && (
                            <span className="ml-2">Max qty: {rule.conditions.maxQuantity}</span>
                          )}
                          {!rule.conditions?.minQuantity && !rule.conditions?.maxQuantity && (
                            <span className="text-gray-400">No conditions</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggle(rule._id, rule.isActive)}
                          className={`w-12 h-6 rounded-full transition-all ${
                            rule.isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            rule.isActive ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(rule)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <MdEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(rule._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Examples */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4">💡 Pricing Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-2">Fixed Add-on</h5>
                <p className="text-gray-600">Add ₹50 for custom engraving on any product</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-2">Percentage Markup</h5>
                <p className="text-gray-600">Add 10% for premium personalization</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-2">Quantity Discount</h5>
                <p className="text-gray-600">50% off personalization for 5+ items</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingRule ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="e.g., Premium Engraving"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {priceTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-3 border rounded-xl text-center transition-all ${
                        formData.type === type.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <type.icon className={`text-xl mx-auto mb-1 ${
                        formData.type === type.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs ${
                        formData.type === type.value ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  min="0"
                  step={formData.type === 'percentage' ? '0.1' : '1'}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity</label>
                  <input
                    type="number"
                    value={formData.conditions.minQuantity}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      conditions: { ...formData.conditions, minQuantity: parseInt(e.target.value) || 1 } 
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Quantity (0 = no limit)</label>
                  <input
                    type="number"
                    value={formData.conditions.maxQuantity}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      conditions: { ...formData.conditions, maxQuantity: parseInt(e.target.value) || 0 } 
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    min="0"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <span className="text-gray-700">Active</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  {editingRule ? 'Update' : 'Create'} Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomPricing;
