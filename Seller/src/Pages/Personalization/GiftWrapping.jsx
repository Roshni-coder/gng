import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdCardGiftcard } from "react-icons/md";
import { FiGift, FiImage, FiCheck } from "react-icons/fi";

function GiftWrapping() {
  const [wrapOptions, setWrapOptions] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    defaultMessage: ""
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWrap, setEditingWrap] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    description: "",
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/gift-wrapping`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setWrapOptions(res.data.data.options || []);
        setSettings(res.data.data.settings || settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWrap) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/gift-wrapping/${editingWrap._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/gift-wrapping`, formData, {
          headers: { stoken }
        });
      }
      fetchData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this gift wrap option?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/gift-wrapping/${id}`, {
        headers: { stoken }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/gift-wrapping/settings`, settings, {
        headers: { stoken }
      });
      alert("Settings saved!");
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  const openEditModal = (wrap) => {
    setEditingWrap(wrap);
    setFormData({
      name: wrap.name || "",
      price: wrap.price || 0,
      image: wrap.image || "",
      description: wrap.description || "",
      isActive: wrap.isActive !== false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingWrap(null);
    setFormData({
      name: "",
      price: 0,
      image: "",
      description: "",
      isActive: true
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gift Wrapping</h1>
          <p className="text-sm text-gray-500">Offer gift wrapping options for your products</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Wrap Style
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">🎁 Gift Wrapping Settings</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <div>
                  <span className="font-medium text-gray-800">Enable Gift Wrapping</span>
                  <p className="text-sm text-gray-500">Allow customers to add gift wrapping to orders</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-all ${settings.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform mt-1 ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Gift Message Template</label>
                <textarea
                  value={settings.defaultMessage}
                  onChange={(e) => setSettings({ ...settings, defaultMessage: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                  rows={3}
                  placeholder="Wishing you a wonderful day!"
                ></textarea>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Wrap Options */}
          {wrapOptions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiGift className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Gift Wrap Styles</h3>
              <p className="text-gray-500 mt-2 mb-4">Add different wrapping options for customers</p>
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Add First Style
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wrapOptions.map((wrap, i) => (
                <div 
                  key={i} 
                  className={`bg-white border rounded-xl overflow-hidden transition-all ${
                    wrap.isActive ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 opacity-60'
                  }`}
                >
                  {/* Image */}
                  <div className="h-40 bg-gradient-to-br from-pink-100 to-purple-100 relative">
                    {wrap.image ? (
                      <img src={wrap.image} alt={wrap.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdCardGiftcard className="text-6xl text-pink-300" />
                      </div>
                    )}
                    
                    {!wrap.isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Inactive</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{wrap.name}</h3>
                      <span className="font-bold text-green-600">
                        {wrap.price > 0 ? formatINR(wrap.price) : 'Free'}
                      </span>
                    </div>

                    {wrap.description && (
                      <p className="text-sm text-gray-600 mb-4">{wrap.description}</p>
                    )}

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(wrap)}
                        className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        <MdEdit /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(wrap._id)}
                        className="py-2 px-3 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
            <h4 className="font-semibold text-pink-800 mb-2">🎀 Gift Wrapping Tips</h4>
            <ul className="text-sm text-pink-700 space-y-1">
              <li>• Offer multiple price tiers for different occasions</li>
              <li>• Add seasonal wrapping options for holidays</li>
              <li>• Include high-quality images of wrap styles</li>
              <li>• Consider offering free wrapping as a promotion</li>
            </ul>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingWrap ? 'Edit Wrap Style' : 'Add Wrap Style'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="Premium Gift Wrap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                  rows={2}
                  placeholder="Elegant wrapping with ribbon"
                ></textarea>
              </div>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <span className="text-gray-700">Active (available to customers)</span>
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
                  {editingWrap ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftWrapping;
