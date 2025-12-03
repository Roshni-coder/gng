import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdBeachAccess, MdSave, MdClose, MdSchedule } from "react-icons/md";
import { FiCalendar, FiAlertCircle } from "react-icons/fi";

function HolidayMode() {
  const [settings, setSettings] = useState({
    isEnabled: false,
    startDate: "",
    endDate: "",
    message: "We're currently on a break and will be back soon!",
    autoReplyEnabled: true,
    autoReplyMessage: "Thank you for your message. We're currently on holiday and will respond when we return."
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/holiday-mode`, {
          headers: { stoken }
        });
        if (res.data.success && res.data.data?.holidayMode) {
          const hm = res.data.data.holidayMode;
          setSettings({
            isEnabled: hm.isEnabled || false,
            startDate: hm.startDate ? new Date(hm.startDate).toISOString().split('T')[0] : "",
            endDate: hm.endDate ? new Date(hm.endDate).toISOString().split('T')[0] : "",
            message: hm.message || "We're currently on a break and will be back soon!",
            autoReplyEnabled: hm.autoReplyEnabled ?? true,
            autoReplyMessage: hm.autoReplyMessage || "Thank you for your message. We're currently on holiday and will respond when we return."
          });
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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/holiday-mode`, 
        { holidayMode: settings }, 
        { headers: { stoken } }
      );
      if (res.data.success) {
        alert("Holiday mode settings saved!");
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
          <h1 className="text-2xl font-bold text-gray-800">Holiday Mode</h1>
          <p className="text-sm text-gray-500">Pause your store when you're away</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <MdSave /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Holiday Mode Toggle */}
      <div className={`rounded-xl p-6 border-2 transition-all ${settings.isEnabled ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${settings.isEnabled ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <MdBeachAccess className={`text-3xl ${settings.isEnabled ? 'text-orange-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Holiday Mode is {settings.isEnabled ? "Active" : "Inactive"}
              </h3>
              <p className="text-sm text-gray-500">
                {settings.isEnabled 
                  ? "Your store is currently paused. Customers cannot place orders."
                  : "Your store is open and accepting orders."}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isEnabled"
              checked={settings.isEnabled}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>

      {settings.isEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <FiAlertCircle className="text-xl text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Your store is in holiday mode</p>
            <p className="text-sm text-yellow-700 mt-1">
              Customers will see your holiday message instead of being able to place orders.
              Existing orders will still need to be processed.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FiCalendar className="text-blue-500" /> Schedule
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={settings.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to start immediately</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={settings.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for indefinite holiday</p>
          </div>

          {settings.startDate && settings.endDate && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 text-blue-700">
                <MdSchedule />
                <span className="text-sm font-medium">
                  Holiday duration: {Math.ceil((new Date(settings.endDate) - new Date(settings.startDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MdBeachAccess className="text-orange-500" /> Holiday Message
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Notice</label>
            <textarea
              name="message"
              value={settings.message}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Message to display on your store..."
            />
            <p className="text-xs text-gray-500 mt-1">This message will be shown to customers visiting your store</p>
          </div>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              name="autoReplyEnabled"
              checked={settings.autoReplyEnabled}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-800">Enable Auto-Reply</p>
              <p className="text-sm text-gray-500">Automatically respond to customer messages</p>
            </div>
          </label>

          {settings.autoReplyEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Reply Message</label>
              <textarea
                name="autoReplyMessage"
                value={settings.autoReplyMessage}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Auto-reply message..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Preview</h3>
        </div>
        <div className="p-8 bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdBeachAccess className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">We're on Holiday!</h3>
            <p className="text-gray-600 mt-2">{settings.message}</p>
            {settings.startDate && settings.endDate && (
              <p className="text-sm text-gray-500 mt-4">
                Back on {new Date(settings.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Things to Remember</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Process existing orders before going on holiday</li>
          <li>• Set realistic return dates so customers know when to expect you</li>
          <li>• Enable auto-reply to keep customers informed</li>
          <li>• Your products will still be visible but marked as unavailable</li>
        </ul>
      </div>
    </div>
  );
}

export default HolidayMode;
