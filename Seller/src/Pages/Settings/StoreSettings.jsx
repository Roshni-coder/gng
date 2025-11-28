import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, TextField, Switch, FormControlLabel } from "@mui/material";

function StoreSettings() {
  const [storeData, setStoreData] = useState({
    name: "",
    nickName: "",
    email: "",
    phone: "",
    about: "",
    holidayMode: false
  });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/profile`, { headers: { stoken } });
      if (data.success) {
        setStoreData({ 
          ...data.seller, 
          holidayMode: data.seller.holidayMode || false 
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller/updateprofile`, storeData, { headers: { stoken } });
      if (data.success) {
        toast.success("Store settings updated!");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Store Settings</h1>

      <div className="grid gap-6">
        {/* General Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Owner Name" name="name" value={storeData.name || ""} onChange={handleChange} fullWidth size="small" />
            <TextField label="Email" name="email" value={storeData.email || ""} onChange={handleChange} fullWidth size="small" disabled />
            <TextField label="Phone Number" name="phone" value={storeData.phone || ""} onChange={handleChange} fullWidth size="small" />
            <TextField label="Brand / Store Name" name="nickName" value={storeData.nickName || ""} onChange={handleChange} fullWidth size="small" />
          </div>
        </div>

        {/* Store Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Store Details</h2>
          <TextField
            label="About Store"
            name="about"
            value={storeData.about || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Tell customers about your brand..."
          />
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Holiday Mode</h2>
            <p className="text-sm text-gray-500">Temporarily hide your products from the marketplace.</p>
          </div>
          <FormControlLabel
            control={<Switch checked={storeData.holidayMode} onChange={handleChange} name="holidayMode" />}
            label={storeData.holidayMode ? "Active" : "Inactive"}
          />
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <Button variant="contained" color="primary" onClick={handleSave} className="!bg-blue-600 !px-8 !py-2">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StoreSettings;