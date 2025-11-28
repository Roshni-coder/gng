import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdToggleOn, MdToggleOff } from "react-icons/md";
import { FiGift, FiEdit3, FiImage, FiSettings } from "react-icons/fi";

function PersonalizationOptions() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "text",
    price: 0,
    isActive: true,
    description: "",
    maxLength: 50,
    options: []
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
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/options`, {
        headers: { stoken }
      });
      if (res.data.success) setOptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOption) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/options/${editingOption._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/options`, formData, {
          headers: { stoken }
        });
      }
      fetchOptions();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save option");
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/options/${id}/toggle`, 
        { isActive: !isActive },
        { headers: { stoken } }
      );
      fetchOptions();
    } catch (err) {
      alert("Failed to toggle option");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this personalization option?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/options/${id}`, {
        headers: { stoken }
      });
      fetchOptions();
    } catch (err) {
      alert("Failed to delete option");
    }
  };

  const openEditModal = (option) => {
    setEditingOption(option);
    setFormData({
      name: option.name || "",
      type: option.type || "text",
      price: option.price || 0,
      isActive: option.isActive !== false,
      description: option.description || "",
      maxLength: option.maxLength || 50,
      options: option.options || []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingOption(null);
    setFormData({
      name: "",
      type: "text",
      price: 0,
      isActive: true,
      description: "",
      maxLength: 50,
      options: []
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      text: FiEdit3,
      image: FiImage,
      select: FiSettings,
      gift: FiGift
    };
    return icons[type] || FiEdit3;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Personalization Options</h1>
          <p className="text-sm text-gray-500">Create custom personalization options for your products</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Option
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : options.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FiGift className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Personalization Options</h3>
          <p className="text-gray-500 mt-2 mb-4">Create options like custom text, images, or gift wrapping</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Create First Option
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map((option, i) => {
            const Icon = getTypeIcon(option.type);
            return (
              <div 
                key={i} 
                className={`bg-white border rounded-xl p-5 transition-all ${
                  option.isActive ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${option.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`text-xl ${option.isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{option.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        option.type === 'text' ? 'bg-purple-100 text-purple-600' :
                        option.type === 'image' ? 'bg-green-100 text-green-600' :
                        option.type === 'select' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {option.type}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleToggle(option._id, option.isActive)}
                    className="text-2xl"
                  >
                    {option.isActive ? (
                      <MdToggleOn className="text-blue-600" />
                    ) : (
                      <MdToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                {option.description && (
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                )}

                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div>
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="font-semibold text-gray-800">
                      {option.price > 0 ? formatINR(option.price) : 'Free'}
                    </p>
                  </div>
                  
                  {option.type === 'text' && (
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Max Length</span>
                      <p className="font-medium text-gray-800">{option.maxLength} chars</p>
                    </div>
                  )}

                  {option.type === 'select' && option.options?.length > 0 && (
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Options</span>
                      <p className="font-medium text-gray-800">{option.options.length}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => openEditModal(option)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    <MdEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(option._id)}
                    className="py-2 px-3 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingOption ? 'Edit Option' : 'Add Personalization Option'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Option Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Custom Text, Photo Upload"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                >
                  <option value="text">Text Input</option>
                  <option value="image">Image Upload</option>
                  <option value="select">Selection</option>
                  <option value="gift">Gift Option</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                  rows={2}
                  placeholder="Brief description shown to customers"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    min="0"
                  />
                </div>

                {formData.type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Characters</label>
                    <input
                      type="number"
                      value={formData.maxLength}
                      onChange={(e) => setFormData({ ...formData, maxLength: parseInt(e.target.value) || 50 })}
                      className="w-full p-3 border border-gray-200 rounded-xl"
                      min="1"
                      max="500"
                    />
                  </div>
                )}
              </div>

              {formData.type === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.options?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      options: e.target.value.split(',').map(o => o.trim()).filter(o => o) 
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    placeholder="Red, Blue, Green"
                  />
                </div>
              )}

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <span className="text-gray-700">Active (available for customers)</span>
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
                  {editingOption ? 'Update' : 'Create'} Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalizationOptions;
