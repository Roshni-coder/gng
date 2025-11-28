import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdOutlineInventory2 } from "react-icons/md";
import { FiBox, FiPackage, FiCheck } from "react-icons/fi";

function PackageDimensions() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    maxWeight: 0,
    isDefault: false
  });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/packages`, {
        headers: { stoken }
      });
      if (res.data.success) setPackages(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/packages/${editingPackage._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/packages`, formData, {
          headers: { stoken }
        });
      }
      fetchPackages();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save package");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this package size?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/packages/${id}`, {
        headers: { stoken }
      });
      fetchPackages();
    } catch (err) {
      alert("Failed to delete package");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/packages/${id}/default`, {}, {
        headers: { stoken }
      });
      fetchPackages();
    } catch (err) {
      alert("Failed to set default");
    }
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || "",
      length: pkg.length || 0,
      width: pkg.width || 0,
      height: pkg.height || 0,
      maxWeight: pkg.maxWeight || 0,
      isDefault: pkg.isDefault || false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: "",
      length: 0,
      width: 0,
      height: 0,
      maxWeight: 0,
      isDefault: false
    });
  };

  const calculateVolume = (l, w, h) => {
    return (l * w * h / 1000000).toFixed(4); // Convert to cubic meters
  };

  const calculateVolumetricWeight = (l, w, h) => {
    return ((l * w * h) / 5000).toFixed(2); // Standard volumetric divisor
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Package Dimensions</h1>
          <p className="text-sm text-gray-500">Configure standard box sizes for your products</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Package
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FiBox className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Packages Configured</h3>
          <p className="text-gray-500 mt-2 mb-4">Add your standard package sizes</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Add First Package
          </button>
        </div>
      ) : (
        <>
          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg, i) => (
              <div 
                key={i} 
                className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all ${
                  pkg.isDefault ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${pkg.isDefault ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <FiBox className={`text-xl ${pkg.isDefault ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {pkg.name}
                        {pkg.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {pkg.length} × {pkg.width} × {pkg.height} cm
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal(pkg)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <MdEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>

                {/* Dimensions Visual */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block">L</span>
                      <span className="font-bold text-gray-800">{pkg.length}</span>
                      <span className="text-xs text-gray-500"> cm</span>
                    </div>
                    <span className="text-gray-400">×</span>
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block">W</span>
                      <span className="font-bold text-gray-800">{pkg.width}</span>
                      <span className="text-xs text-gray-500"> cm</span>
                    </div>
                    <span className="text-gray-400">×</span>
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block">H</span>
                      <span className="font-bold text-gray-800">{pkg.height}</span>
                      <span className="text-xs text-gray-500"> cm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Weight</span>
                    <span className="font-medium text-gray-800">{pkg.maxWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume</span>
                    <span className="font-medium text-gray-800">{calculateVolume(pkg.length, pkg.width, pkg.height)} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vol. Weight</span>
                    <span className="font-medium text-gray-800">{calculateVolumetricWeight(pkg.length, pkg.width, pkg.height)} kg</span>
                  </div>
                </div>

                {!pkg.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(pkg._id)}
                    className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <FiCheck /> Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-semibold text-blue-800 mb-2">📦 Why Package Sizes Matter</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Accurate shipping cost calculation</li>
                <li>• Better volumetric weight estimation</li>
                <li>• Faster order processing</li>
                <li>• Reduced packaging waste</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-800 mb-2">💡 Volumetric Weight Formula</h4>
              <p className="text-sm text-gray-600 mb-2">
                Volumetric Weight = (L × W × H) ÷ 5000
              </p>
              <p className="text-xs text-gray-500">
                Courier companies charge based on the higher of actual weight or volumetric weight.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingPackage ? 'Edit Package' : 'Add Package'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Small Box, Medium Carton"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.maxWeight}
                  onChange={(e) => setFormData({ ...formData, maxWeight: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <span className="text-gray-700">Set as default package</span>
              </label>

              {/* Preview */}
              {formData.length > 0 && formData.width > 0 && formData.height > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Volume:</strong> {calculateVolume(formData.length, formData.width, formData.height)} m³
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Volumetric Weight:</strong> {calculateVolumetricWeight(formData.length, formData.width, formData.height)} kg
                  </p>
                </div>
              )}

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
                  {editingPackage ? 'Update' : 'Create'} Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageDimensions;
