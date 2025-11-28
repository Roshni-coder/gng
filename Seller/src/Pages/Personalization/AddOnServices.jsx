import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdLocalOffer } from "react-icons/md";
import { FiPlus, FiPackage, FiDollarSign } from "react-icons/fi";

function AddOnServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    type: "product",
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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/add-ons`, {
        headers: { stoken }
      });
      if (res.data.success) setServices(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/add-ons/${editingService._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/add-ons`, formData, {
          headers: { stoken }
        });
      }
      fetchServices();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this add-on service?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/add-ons/${id}`, {
        headers: { stoken }
      });
      fetchServices();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/add-ons/${id}/toggle`, 
        { isActive: !isActive },
        { headers: { stoken } }
      );
      fetchServices();
    } catch (err) {
      alert("Failed to toggle");
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price || 0,
      type: service.type || "product",
      isActive: service.isActive !== false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      type: "product",
      isActive: true
    });
  };

  const serviceTypes = [
    { value: "product", label: "Product Add-on", icon: FiPackage, color: "bg-blue-100 text-blue-600" },
    { value: "service", label: "Service", icon: FiPlus, color: "bg-green-100 text-green-600" },
    { value: "warranty", label: "Warranty", icon: MdLocalOffer, color: "bg-purple-100 text-purple-600" },
    { value: "installation", label: "Installation", icon: FiPlus, color: "bg-orange-100 text-orange-600" }
  ];

  const getTypeInfo = (type) => {
    return serviceTypes.find(t => t.value === type) || serviceTypes[0];
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add-On Services</h1>
          <p className="text-sm text-gray-500">Offer additional products and services with orders</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FiPlus className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Add-On Services</h3>
          <p className="text-gray-500 mt-2 mb-4">Create add-ons like extended warranty, installation, or extra items</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Add First Service
          </button>
        </div>
      ) : (
        <>
          {/* Service Types Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceTypes.map(type => {
              const count = services.filter(s => s.type === type.value).length;
              return (
                <div key={type.value} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className={`inline-flex p-3 rounded-xl ${type.color} mb-2`}>
                    <type.icon className="text-xl" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{count}</h4>
                  <p className="text-sm text-gray-500">{type.label}s</p>
                </div>
              );
            })}
          </div>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, i) => {
              const typeInfo = getTypeInfo(service.type);
              return (
                <div 
                  key={i} 
                  className={`bg-white border rounded-xl p-5 transition-all ${
                    service.isActive ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${typeInfo.color}`}>
                        <typeInfo.icon className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{service.name}</h3>
                        <span className="text-xs text-gray-500">{typeInfo.label}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(service._id, service.isActive)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        service.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        service.isActive ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>

                  {service.description && (
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  )}

                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-green-600">
                      <FiDollarSign />
                      <span className="font-bold text-lg">
                        {service.price > 0 ? formatINR(service.price) : 'Free'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <MdEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h4 className="font-semibold text-green-800 mb-2">💡 Add-On Ideas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <ul className="space-y-1">
                <li>• Extended warranty options</li>
                <li>• Priority/express handling</li>
                <li>• Installation services</li>
              </ul>
              <ul className="space-y-1">
                <li>• Complementary products</li>
                <li>• Premium packaging upgrade</li>
                <li>• Personalization services</li>
              </ul>
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
                {editingService ? 'Edit Add-On' : 'Add Add-On Service'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="Extended Warranty"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-3 border rounded-xl flex items-center gap-2 transition-all ${
                        formData.type === type.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <type.icon className={formData.type === type.value ? 'text-blue-600' : 'text-gray-400'} />
                      <span className={`text-sm ${formData.type === type.value ? 'text-blue-700' : 'text-gray-600'}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                  rows={2}
                  placeholder="Brief description..."
                ></textarea>
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
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddOnServices;
