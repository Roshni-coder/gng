import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdMail, MdSchedule, MdCheck } from "react-icons/md";
import { FiSend, FiClock, FiPackage, FiRefreshCw } from "react-icons/fi";

function ReviewRequests() {
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({
    autoRequest: false,
    delayDays: 3,
    reminderEnabled: false,
    reminderDays: 7
  });
  const [stats, setStats] = useState({
    requestsSent: 0,
    reviewsReceived: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/requests`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setOrders(res.data.data.orders || []);
        setSettings(res.data.data.settings || settings);
        setStats(res.data.data.stats || stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (orderId) => {
    setSending(orderId);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/requests/${orderId}/send`, {}, {
        headers: { stoken }
      });
      fetchData();
    } catch (err) {
      alert("Failed to send request");
    } finally {
      setSending(null);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/requests/settings`, settings, {
        headers: { stoken }
      });
      alert("Settings saved!");
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Review Requests</h1>
        <p className="text-sm text-gray-500">Request reviews from customers after delivery</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <FiSend className="text-xl" />
                <span className="text-sm">Requests Sent</span>
              </div>
              <h3 className="text-2xl font-bold">{stats.requestsSent}</h3>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <MdStar className="text-xl" />
                <span className="text-sm">Reviews Received</span>
              </div>
              <h3 className="text-2xl font-bold">{stats.reviewsReceived}</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-purple-600">
                <FiRefreshCw className="text-xl" />
                <span className="text-sm">Conversion Rate</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.conversionRate}%</h3>
            </div>
          </div>

          {/* Auto-Request Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">⚡ Automation Settings</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <div>
                  <span className="font-medium text-gray-800">Auto-send Review Requests</span>
                  <p className="text-sm text-gray-500">Automatically request reviews after delivery</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.autoRequest}
                    onChange={(e) => setSettings({ ...settings, autoRequest: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-all ${settings.autoRequest ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform mt-1 ${settings.autoRequest ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>
              </label>

              {settings.autoRequest && (
                <div className="pl-4 border-l-2 border-blue-200 ml-4">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-gray-700">Send request</label>
                    <input
                      type="number"
                      value={settings.delayDays}
                      onChange={(e) => setSettings({ ...settings, delayDays: parseInt(e.target.value) })}
                      className="w-20 p-2 border border-gray-200 rounded-lg text-center"
                      min="1"
                      max="30"
                    />
                    <span className="text-gray-700">days after delivery</span>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reminderEnabled}
                      onChange={(e) => setSettings({ ...settings, reminderEnabled: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700">Send reminder after</span>
                    <input
                      type="number"
                      value={settings.reminderDays}
                      onChange={(e) => setSettings({ ...settings, reminderDays: parseInt(e.target.value) })}
                      className="w-20 p-2 border border-gray-200 rounded-lg text-center"
                      min="3"
                      max="30"
                      disabled={!settings.reminderEnabled}
                    />
                    <span className="text-gray-700">days if no review</span>
                  </label>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">📦 Orders Ready for Review Request</h3>
              <p className="text-sm text-gray-500">Delivered orders that haven't been requested for review</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiPackage className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>No orders pending review request</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    {/* Product Image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {order.productImage ? (
                        <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiPackage />
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{order.productName}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>#{order.orderId}</span>
                        <span>•</span>
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                        <FiClock className="text-xs" />
                        Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status/Action */}
                    {order.reviewRequested ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MdCheck className="text-green-500" />
                        <span>Requested</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(order._id)}
                        disabled={sending === order._id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {sending === order._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <MdMail /> Request Review
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips for More Reviews</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Request reviews 3-5 days after delivery for best results</li>
              <li>• Keep requests polite and brief</li>
              <li>• Don't over-request - one reminder is enough</li>
              <li>• Thank customers who leave reviews</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewRequests;
