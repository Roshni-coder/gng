import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuTruck, LuPenLine, LuSave, LuX, LuPackage, LuMapPin, LuInfo } from "react-icons/lu";

function ShippingSettings() {
  const [settings, setSettings] = useState({
    freeShippingThreshold: 0,
    defaultShippingCost: 0,
    expressShippingCost: 0,
    processingTime: "1-2",
    shippingZones: [],
    packagingIncluded: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/settings`, {
          headers: { stoken }
        });
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/settings`, settings, {
        headers: { stoken }
      });
      if (res.data.success) {
        setEditing(false);
        alert("Shipping settings saved!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings(prev => ({ ...prev, [e.target.name]: value }));
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Shipping Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your shipping options and rates</p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <LuX className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
              >
                <LuSave className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
            >
              <LuPenLine className="w-4 h-4" /> Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <LuTruck className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Free Shipping</span>
            </div>
            <h3 className="text-2xl font-bold">{formatINR(settings.freeShippingThreshold)}</h3>
            <p className="text-xs text-white/60 mt-1">Minimum order value</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <LuPackage className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatINR(settings.defaultShippingCost)}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <LuTruck className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Express</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatINR(settings.expressShippingCost)}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <LuMapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Processing</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{settings.processingTime} days</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <LuTruck className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Shipping Rates</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="e.g., 500"
              />
              <p className="text-xs text-gray-400 mt-1">Set to 0 to disable free shipping</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Standard Shipping Cost (₹)</label>
              <input
                type="number"
                name="defaultShippingCost"
                value={settings.defaultShippingCost}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="e.g., 50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Express Shipping Cost (₹)</label>
              <input
                type="number"
                name="expressShippingCost"
                value={settings.expressShippingCost}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="e.g., 100"
              />
            </div>
          </div>
        </div>

        {/* Processing & Handling */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <LuPackage className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Processing & Handling</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Processing Time</label>
              <select
                name="processingTime"
                value={settings.processingTime}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              >
                <option value="same-day">Same Day</option>
                <option value="1">1 Day</option>
                <option value="1-2">1-2 Days</option>
                <option value="2-3">2-3 Days</option>
              <option value="3-5">3-5 Days</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Time to pack and hand over to courier</p>
            </div>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="packagingIncluded"
                checked={settings.packagingIncluded}
                onChange={handleChange}
                disabled={!editing}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-gray-900 text-sm">Gift Packaging Available</p>
                <p className="text-xs text-gray-500">Offer gift wrapping option to customers</p>
              </div>
            </label>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-700">
                <strong>Tip:</strong> Faster processing times lead to better customer reviews!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <LuMapPin className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Shipping Zones</h3>
          </div>
          {editing && (
            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-all">
              + Add Zone
            </button>
          )}
        </div>

        {settings.shippingZones?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <LuMapPin className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium">No shipping zones configured</p>
            <p className="text-sm text-gray-500 mt-1">Default shipping rates will apply to all locations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settings.shippingZones?.map((zone, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{zone.name}</p>
                  <p className="text-sm text-gray-500">{zone.states?.join(", ")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatINR(zone.rate)}</p>
                    <p className="text-xs text-gray-500">{zone.deliveryDays} days delivery</p>
                  </div>
                  {editing && (
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <LuX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <LuInfo className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900 text-sm mb-2">Shipping Best Practices</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Offer free shipping above a threshold to increase average order value</li>
              <li>• Clearly communicate processing and delivery times</li>
              <li>• Consider offering express shipping for last-minute gift orders</li>
              <li>• Factor in packaging costs when setting shipping rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingSettings;
