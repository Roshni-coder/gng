import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuStore, LuPenLine, LuSave, LuX, LuCamera, LuSettings, LuInfo } from "react-icons/lu";

function StoreSettings() {
  const [settings, setSettings] = useState({
    storeName: "",
    storeLogo: "",
    storeBanner: "",
    storeDescription: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/settings`, {
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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/settings`, settings, {
        headers: { stoken }
      });
      if (res.data.success) {
        setEditing(false);
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
          <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store profile and appearance</p>
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

      {/* Store Banner & Logo Preview */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div 
          className="h-48 bg-gradient-to-br from-indigo-600 to-purple-700 relative"
          style={settings.storeBanner ? { backgroundImage: `url(${settings.storeBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {editing && (
            <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-all text-sm font-medium shadow-sm">
              <LuCamera className="w-4 h-4" /> Change Banner
            </button>
          )}
        </div>
        <div className="p-6 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-28 h-28 bg-white rounded-xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {settings.storeLogo ? (
                <img src={settings.storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <LuStore className="w-10 h-10 text-gray-300" />
              )}
            </div>
            <div className="mt-6 md:mt-10">
              <h2 className="text-xl font-semibold text-gray-900">{settings.storeName || "Your Store Name"}</h2>
              <p className="text-gray-500 text-sm mt-1 max-w-md">{settings.storeDescription || "No description yet"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <LuStore className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Store Information</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="Enter store name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Description</label>
              <textarea
                name="storeDescription"
                value={settings.storeDescription}
                onChange={handleChange}
                disabled={!editing}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all"
                placeholder="Describe your store..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Logo URL</label>
              <input
                type="text"
                name="storeLogo"
                value={settings.storeLogo}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Banner URL</label>
              <input
                type="text"
                name="storeBanner"
                value={settings.storeBanner}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="https://example.com/banner.png"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <LuSettings className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Contact Information</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Email</label>
              <input
                type="email"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="store@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Phone</label>
              <input
                type="tel"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Store Address</label>
              <textarea
                name="storeAddress"
                value={settings.storeAddress}
                onChange={handleChange}
                disabled={!editing}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all"
                placeholder="Full store address..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <LuInfo className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900 text-sm mb-2">Pro Tips</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Use a high-quality logo (recommended: 200x200px)</li>
              <li>• Banner images work best at 1200x300px</li>
              <li>• A compelling store description helps attract customers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreSettings;
