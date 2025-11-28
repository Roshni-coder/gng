import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLocalShipping, MdCheck, MdClose, MdEdit } from "react-icons/md";
import { FiTruck, FiPackage, FiClock } from "react-icons/fi";

function DeliveryPartners() {
  const [data, setData] = useState({ partners: [], recommended: [] });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/delivery-partners`, {
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

  const handleTogglePartner = async (partnerId, enable) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/delivery-partners`,
        { partnerId, enabled: enable },
        { headers: { stoken } }
      );
      if (res.data.success) {
        setData(prev => ({
          ...prev,
          partners: prev.partners.map(p => 
            p._id === partnerId ? { ...p, enabled: enable } : p
          )
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update partner");
    }
  };

  const partnerLogos = {
    "Delhivery": "🚚",
    "BlueDart": "📦",
    "DTDC": "📬",
    "Ecom Express": "🛵",
    "Shiprocket": "🚀",
    "XpressBees": "🐝"
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Partners</h1>
          <p className="text-sm text-gray-500">Manage your shipping courier integrations</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Active Partners */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiTruck className="text-green-500" /> Active Partners
              </h3>
            </div>

            {data.partners?.filter(p => p.enabled).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiTruck className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No active delivery partners</p>
                <p className="text-sm">Enable partners below to start shipping</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.partners?.filter(p => p.enabled).map((partner, i) => (
                  <div key={i} className="p-5 flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                      {partnerLogos[partner.name] || "📦"}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">{partner.name}</h4>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiClock /> {partner.deliveryTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiPackage /> {partner.serviceableAreas}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800">From ₹{partner.baseRate}</p>
                      <p className="text-xs text-gray-500">per shipment</p>
                    </div>

                    <button
                      onClick={() => handleTogglePartner(partner._id, false)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Disable
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Partners */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiPackage className="text-blue-500" /> Available Partners
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {(data.partners?.filter(p => !p.enabled).length > 0 ? data.partners.filter(p => !p.enabled) : [
                { name: "Delhivery", deliveryTime: "2-5 days", serviceableAreas: "Pan India", baseRate: 40 },
                { name: "BlueDart", deliveryTime: "1-3 days", serviceableAreas: "Metro Cities", baseRate: 60 },
                { name: "DTDC", deliveryTime: "3-6 days", serviceableAreas: "Pan India", baseRate: 35 },
                { name: "Shiprocket", deliveryTime: "2-5 days", serviceableAreas: "Pan India", baseRate: 45 }
              ]).map((partner, i) => (
                <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                    {partnerLogos[partner.name] || "📦"}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{partner.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiClock /> {partner.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiPackage /> {partner.serviceableAreas}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">From ₹{partner.baseRate}</p>
                    <p className="text-xs text-gray-500">per shipment</p>
                  </div>

                  <button
                    onClick={() => handleTogglePartner(partner._id, true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Enable
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Partner Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-600">Partner</th>
                    <th className="text-center py-3 font-medium text-gray-600">Speed</th>
                    <th className="text-center py-3 font-medium text-gray-600">Coverage</th>
                    <th className="text-center py-3 font-medium text-gray-600">Tracking</th>
                    <th className="text-center py-3 font-medium text-gray-600">COD</th>
                    <th className="text-center py-3 font-medium text-gray-600">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">Delhivery</td>
                    <td className="py-3 text-center">⭐⭐⭐⭐</td>
                    <td className="py-3 text-center">Pan India</td>
                    <td className="py-3 text-center"><MdCheck className="text-green-500 mx-auto" /></td>
                    <td className="py-3 text-center"><MdCheck className="text-green-500 mx-auto" /></td>
                    <td className="py-3 text-center text-gray-500">All shipments</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">BlueDart</td>
                    <td className="py-3 text-center">⭐⭐⭐⭐⭐</td>
                    <td className="py-3 text-center">Metros</td>
                    <td className="py-3 text-center"><MdCheck className="text-green-500 mx-auto" /></td>
                    <td className="py-3 text-center"><MdCheck className="text-green-500 mx-auto" /></td>
                    <td className="py-3 text-center text-gray-500">Express delivery</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">DTDC</td>
                    <td className="py-3 text-center">⭐⭐⭐</td>
                    <td className="py-3 text-center">Pan India</td>
                    <td className="py-3 text-center"><MdCheck className="text-green-500 mx-auto" /></td>
                    <td className="py-3 text-center"><MdCheck className="text-green-500 mx-auto" /></td>
                    <td className="py-3 text-center text-gray-500">Budget shipping</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Partner Selection Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enable multiple partners for better coverage and competitive rates</li>
              <li>• Use express partners for time-sensitive gift deliveries</li>
              <li>• Check serviceable areas before enabling a partner</li>
              <li>• Consider COD availability for your target customers</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default DeliveryPartners;
