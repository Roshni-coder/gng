import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdMessage, MdSend, MdSearch } from "react-icons/md";
import { FiMessageCircle, FiMail, FiPhone } from "react-icons/fi";

function CustomerMessages() {
  const [data, setData] = useState({ conversations: [], totalCustomers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/customers/messages`, {
          headers: { stoken }
        });
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredConversations = data.conversations.filter(conv => 
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Processing": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Messages</h1>
          <p className="text-sm text-gray-500">Communicate with your customers</p>
        </div>
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FiMessageCircle className="text-xl" />
            <span className="text-sm font-medium">Total Customers</span>
          </div>
          <h3 className="text-2xl font-bold">{data.totalCustomers}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Active Conversations</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.conversations.length}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Pending Responses</p>
          <h3 className="text-2xl font-bold text-orange-600 mt-1">0</h3>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Recent Customers</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-12 text-center">
            <MdMessage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customer conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Customer messages will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conv, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {conv.customerName.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">{conv.customerName}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conv.orderStatus)}`}>
                      {conv.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiMail className="text-xs" />
                      {conv.customerEmail}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Last order: {new Date(conv.lastOrderDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${conv.customerEmail}`}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    title="Send Email"
                  >
                    <FiMail />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">📬 Direct Messaging Coming Soon</h4>
        <p className="text-sm text-blue-700">
          We're working on a built-in messaging system so you can communicate directly with customers 
          without leaving the platform. For now, you can reach out via email.
        </p>
      </div>
    </div>
  );
}

export default CustomerMessages;
