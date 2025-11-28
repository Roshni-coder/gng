import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdLocalShipping } from "react-icons/md";
import { FiMapPin, FiDollarSign, FiPackage } from "react-icons/fi";

function ShippingRates() {
  const [rates, setRates] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    zone: "",
    minWeight: 0,
    maxWeight: 1,
    baseRate: 0,
    perKgRate: 0,
    freeShippingThreshold: 0,
    estimatedDays: { min: 1, max: 3 }
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
      const [ratesRes, zonesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/rates`, {
          headers: { stoken }
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/zones`, {
          headers: { stoken }
        })
      ]);
      
      if (ratesRes.data.success) setRates(ratesRes.data.data || []);
      if (zonesRes.data.success) setZones(zonesRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRate) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/rates/${editingRate._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/rates`, formData, {
          headers: { stoken }
        });
      }
      fetchData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save shipping rate");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this shipping rate?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/rates/${id}`, {
        headers: { stoken }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete rate");
    }
  };

  const openEditModal = (rate) => {
    setEditingRate(rate);
    setFormData({
      zone: rate.zone || "",
      minWeight: rate.minWeight || 0,
      maxWeight: rate.maxWeight || 1,
      baseRate: rate.baseRate || 0,
      perKgRate: rate.perKgRate || 0,
      freeShippingThreshold: rate.freeShippingThreshold || 0,
      estimatedDays: rate.estimatedDays || { min: 1, max: 3 }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRate(null);
    setFormData({
      zone: "",
      minWeight: 0,
      maxWeight: 1,
      baseRate: 0,
      perKgRate: 0,
      freeShippingThreshold: 0,
      estimatedDays: { min: 1, max: 3 }
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shipping Rates</h1>
          <p className="text-sm text-gray-500">Configure shipping costs for different zones and weights</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Rate
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : rates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <MdLocalShipping className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Shipping Rates</h3>
          <p className="text-gray-500 mt-2 mb-4">Create shipping rates for your products</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Add First Rate
          </button>
        </div>
      ) : (
        <>
          {/* Rates by Zone */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rates.map((rate, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <FiMapPin className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{rate.zoneName || rate.zone}</h3>
                      <p className="text-sm text-gray-500">{rate.minWeight}-{rate.maxWeight} kg</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal(rate)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <MdEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(rate._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Base Rate</span>
                    <span className="font-semibold text-gray-800">{formatINR(rate.baseRate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Per Kg</span>
                    <span className="font-medium text-gray-800">{formatINR(rate.perKgRate)}/kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Free Above</span>
                    <span className="font-medium text-green-600">
                      {rate.freeShippingThreshold > 0 ? formatINR(rate.freeShippingThreshold) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Delivery</span>
                    <span className="text-gray-800">
                      {rate.estimatedDays?.min || 1}-{rate.estimatedDays?.max || 3} days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Calculator */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📦 Rate Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Zone</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg">
                  <option value="">Select zone</option>
                  {zones.map((z, i) => (
                    <option key={i} value={z._id}>{z.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Weight (kg)</label>
                <input type="number" className="w-full p-2 border border-gray-200 rounded-lg" placeholder="0.5" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Order Value</label>
                <input type="number" className="w-full p-2 border border-gray-200 rounded-lg" placeholder="₹999" />
              </div>
              <div className="flex items-end">
                <button className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Calculate
                </button>
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
                {editingRate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Zone</option>
                  {zones.map((z, i) => (
                    <option key={i} value={z._id}>{z.name}</option>
                  ))}
                  <option value="local">Local</option>
                  <option value="regional">Regional</option>
                  <option value="national">National</option>
                  <option value="remote">Remote Areas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minWeight}
                    onChange={(e) => setFormData({ ...formData, minWeight: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.maxWeight}
                    onChange={(e) => setFormData({ ...formData, maxWeight: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.baseRate}
                    onChange={(e) => setFormData({ ...formData, baseRate: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Kg Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.perKgRate}
                    onChange={(e) => setFormData({ ...formData, perKgRate: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Above (₹)</label>
                <input
                  type="number"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="0 for no free shipping"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Days</label>
                  <input
                    type="number"
                    value={formData.estimatedDays.min}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      estimatedDays: { ...formData.estimatedDays, min: parseInt(e.target.value) } 
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Days</label>
                  <input
                    type="number"
                    value={formData.estimatedDays.max}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      estimatedDays: { ...formData.estimatedDays, max: parseInt(e.target.value) } 
                    })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

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
                  {editingRate ? 'Update' : 'Create'} Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShippingRates;
