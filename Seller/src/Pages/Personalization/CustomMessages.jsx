import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEdit, MdSave, MdMessage } from "react-icons/md";
import { FiEdit3, FiHeart, FiStar, FiGift } from "react-icons/fi";

function CustomMessages() {
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    maxLength: 200,
    allowEmoji: true
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: "", text: "", occasion: "" });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/custom-messages`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setTemplates(res.data.data.templates || []);
        setSettings(res.data.data.settings || settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/custom-messages/settings`, settings, {
        headers: { stoken }
      });
      alert("Settings saved!");
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.text) return;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/custom-messages/templates`, newTemplate, {
        headers: { stoken }
      });
      fetchData();
      setNewTemplate({ name: "", text: "", occasion: "" });
    } catch (err) {
      alert("Failed to add template");
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm("Delete this template?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/custom-messages/templates/${id}`, {
        headers: { stoken }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const occasions = ["Birthday", "Anniversary", "Thank You", "Congratulations", "Holiday", "General"];

  const getOccasionIcon = (occasion) => {
    const icons = {
      "Birthday": "🎂",
      "Anniversary": "❤️",
      "Thank You": "🙏",
      "Congratulations": "🎉",
      "Holiday": "🎄",
      "General": "💝"
    };
    return icons[occasion] || "💝";
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Custom Messages</h1>
        <p className="text-sm text-gray-500">Allow customers to add personalized messages to their orders</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">✉️ Message Settings</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <div>
                  <span className="font-medium text-gray-800">Enable Custom Messages</span>
                  <p className="text-sm text-gray-500">Allow customers to add personal messages</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Characters</label>
                  <input
                    type="number"
                    value={settings.maxLength}
                    onChange={(e) => setSettings({ ...settings, maxLength: parseInt(e.target.value) || 200 })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                    min="50"
                    max="500"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer h-[50px]">
                    <input
                      type="checkbox"
                      checked={settings.allowEmoji}
                      onChange={(e) => setSettings({ ...settings, allowEmoji: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700">Allow Emojis 😊</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
              >
                <MdSave /> Save Settings
              </button>
            </div>
          </div>

          {/* Message Templates */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📝 Message Templates</h3>
            <p className="text-sm text-gray-500 mb-4">Pre-made templates customers can use or customize</p>

            {/* Add Template */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Add New Template</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Template name"
                  className="p-3 border border-gray-200 rounded-xl"
                />
                <select
                  value={newTemplate.occasion}
                  onChange={(e) => setNewTemplate({ ...newTemplate, occasion: e.target.value })}
                  className="p-3 border border-gray-200 rounded-xl"
                >
                  <option value="">Select Occasion</option>
                  {occasions.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddTemplate}
                  disabled={!newTemplate.name || !newTemplate.text}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Template
                </button>
              </div>
              <textarea
                value={newTemplate.text}
                onChange={(e) => setNewTemplate({ ...newTemplate, text: e.target.value })}
                placeholder="Template message text..."
                className="w-full mt-3 p-3 border border-gray-200 rounded-xl resize-none"
                rows={2}
              ></textarea>
            </div>

            {/* Existing Templates */}
            {templates.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MdMessage className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No templates yet. Add some above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getOccasionIcon(template.occasion)}</span>
                        <div>
                          <h4 className="font-medium text-gray-800">{template.name}</h4>
                          <span className="text-xs text-gray-500">{template.occasion}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTemplate(template._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3 mt-2">
                      "{template.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">👁️ Customer Preview</h3>
            <div className="bg-white rounded-xl p-4 max-w-md mx-auto shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a Personal Message
              </label>
              <textarea
                placeholder="Write your message here..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none text-sm"
                rows={3}
                maxLength={settings.maxLength}
              ></textarea>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>0 / {settings.maxLength} characters</span>
                {settings.allowEmoji && <span>Emojis allowed ✨</span>}
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Quick templates:</p>
                <div className="flex flex-wrap gap-2">
                  {templates.slice(0, 3).map((t, i) => (
                    <button key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200">
                      {getOccasionIcon(t.occasion)} {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomMessages;
