import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEdit, MdSave, MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { FiMapPin, FiHome, FiCheck } from "react-icons/fi";

function ReturnAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false
  });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/return-address`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setAddresses(res.data.data || []);
        if (res.data.data?.length > 0) {
          setFormData(res.data.data[0]);
        }
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/return-address`, formData, {
        headers: { stoken }
      });
      fetchAddresses();
      setEditing(false);
    } catch (err) {
      alert("Failed to save address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/return-address/${id}/default`, {}, {
        headers: { stoken }
      });
      fetchAddresses();
    } catch (err) {
      alert("Failed to set default");
    }
  };

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Return Address</h1>
          <p className="text-sm text-gray-500">Manage your return and pickup addresses</p>
        </div>
        {!editing && addresses.length > 0 && (
          <button 
            onClick={() => setEditing(true)}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
            <MdEdit className="text-xl" /> Edit Address
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : editing || addresses.length === 0 ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-6">
            {addresses.length === 0 ? 'Add Return Address' : 'Edit Return Address'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Warehouse Manager"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl"
                  placeholder="returns@yourstore.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <div className="relative">
                <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl"
                  placeholder="Building, Floor, Street"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
                placeholder="Area, Locality (Optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
                required
              >
                <option value="">Select State</option>
                {states.map((state, i) => (
                  <option key={i} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
                pattern="[0-9]{6}"
                placeholder="400001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
                placeholder="Near Railway Station"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 mt-6 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600"
            />
            <div>
              <span className="font-medium text-gray-800">Set as default return address</span>
              <p className="text-sm text-gray-500">This address will be used for all returns</p>
            </div>
          </label>

          <div className="flex gap-3 mt-6">
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <MdSave /> Save Address
            </button>
          </div>
        </form>
      ) : (
        /* Display Addresses */
        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <div 
              key={i} 
              className={`bg-white border rounded-xl p-6 ${
                addr.isDefault ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${addr.isDefault ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <FiMapPin className={`text-xl ${addr.isDefault ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {addr.name}
                      {addr.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{addr.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFormData(addr); setEditing(true); }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <MdEdit className="text-xl" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-800">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-gray-600">{addr.addressLine2}</p>}
                <p className="text-gray-600">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-gray-500 text-sm mt-1">Landmark: {addr.landmark}</p>
                )}
                {addr.email && (
                  <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                    <MdEmail className="text-gray-400" /> {addr.email}
                  </p>
                )}
              </div>

              {!addr.isDefault && (
                <button 
                  onClick={() => handleSetDefault(addr._id)}
                  className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <FiCheck /> Set as Default
                </button>
              )}
            </div>
          ))}

          <button 
            onClick={() => { 
              setFormData({
                name: "",
                phone: "",
                email: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
                isDefault: false
              }); 
              setEditing(true); 
            }}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-2"
          >
            <MdLocationOn className="text-xl" /> Add Another Address
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">📍 Return Address Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use a reliable address where returns can be received during business hours</li>
          <li>• Ensure the phone number is reachable for delivery coordination</li>
          <li>• Add clear landmarks for easy navigation</li>
          <li>• Keep the address updated if you change warehouse locations</li>
        </ul>
      </div>
    </div>
  );
}

export default ReturnAddress;
