import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdColorLens, MdEdit, MdSave, MdClose, MdPreview } from "react-icons/md";
import { FiLayout, FiType, FiDroplet } from "react-icons/fi";

function StoreCustomization() {
  const [settings, setSettings] = useState({
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    accentColor: "#10B981",
    fontFamily: "Inter",
    layout: "grid",
    headerStyle: "modern",
    showBanner: true,
    showFeaturedProducts: true,
    productsPerRow: 4
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/customization`, {
          headers: { stoken }
        });
        if (res.data.success && res.data.data?.storeTheme) {
          setSettings(prev => ({ ...prev, ...res.data.data.storeTheme }));
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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/customization`, 
        { storeTheme: settings }, 
        { headers: { stoken } }
      );
      if (res.data.success) {
        setEditing(false);
        alert("Customization saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save customization");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings(prev => ({ ...prev, [e.target.name]: value }));
  };

  const colorPresets = [
    { name: "Ocean Blue", primary: "#3B82F6", secondary: "#8B5CF6", accent: "#10B981" },
    { name: "Sunset", primary: "#F97316", secondary: "#EC4899", accent: "#FBBF24" },
    { name: "Forest", primary: "#059669", secondary: "#065F46", accent: "#84CC16" },
    { name: "Royal", primary: "#7C3AED", secondary: "#4F46E5", accent: "#F43F5E" },
    { name: "Midnight", primary: "#1F2937", secondary: "#374151", accent: "#06B6D4" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Customization</h1>
          <p className="text-sm text-gray-500">Personalize your store's look and feel</p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <MdClose /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <MdSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
            >
              <MdEdit /> Customize
            </button>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MdPreview className="text-blue-500" /> Live Preview
          </h3>
        </div>
        <div 
          className="h-48 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)` }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
            <h3 className="text-xl font-bold" style={{ color: settings.primaryColor }}>Your Store Name</h3>
            <p className="text-gray-500 text-sm mt-1">Your store tagline goes here</p>
            <button 
              className="mt-4 px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: settings.accentColor }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FiDroplet className="text-blue-500" /> Color Scheme
          </h3>

          {/* Color Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (editing) {
                      setSettings(prev => ({
                        ...prev,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        accentColor: preset.accent
                      }));
                    }
                  }}
                  disabled={!editing}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                  <span className="text-xs">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange({ target: { name: 'primaryColor', value: e.target.value }})}
                  disabled={!editing}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => handleChange({ target: { name: 'secondaryColor', value: e.target.value }})}
                  disabled={!editing}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="accentColor"
                  value={settings.accentColor}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => handleChange({ target: { name: 'accentColor', value: e.target.value }})}
                  disabled={!editing}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Layout */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FiType className="text-purple-500" /> Typography & Layout
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
            <select
              name="fontFamily"
              value={settings.fontFamily}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            >
              <option value="Inter">Inter (Modern)</option>
              <option value="Roboto">Roboto (Clean)</option>
              <option value="Poppins">Poppins (Friendly)</option>
              <option value="Playfair Display">Playfair Display (Elegant)</option>
              <option value="Montserrat">Montserrat (Professional)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Layout</label>
            <select
              name="layout"
              value={settings.layout}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
              <option value="masonry">Masonry Grid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Products Per Row</label>
            <select
              name="productsPerRow"
              value={settings.productsPerRow}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
            >
              <option value={2}>2 Products</option>
              <option value={3}>3 Products</option>
              <option value={4}>4 Products</option>
              <option value={5}>5 Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
          <FiLayout className="text-green-500" /> Display Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              name="showBanner"
              checked={settings.showBanner}
              onChange={handleChange}
              disabled={!editing}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-800">Show Banner</p>
              <p className="text-sm text-gray-500">Display store banner on homepage</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              name="showFeaturedProducts"
              checked={settings.showFeaturedProducts}
              onChange={handleChange}
              disabled={!editing}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-800">Featured Products</p>
              <p className="text-sm text-gray-500">Show featured products section</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              name="headerStyle"
              checked={settings.headerStyle === 'modern'}
              onChange={(e) => handleChange({ target: { name: 'headerStyle', value: e.target.checked ? 'modern' : 'classic' }})}
              disabled={!editing}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-800">Modern Header</p>
              <p className="text-sm text-gray-500">Use modern header style</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default StoreCustomization;
