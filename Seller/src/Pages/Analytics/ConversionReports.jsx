import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTrendingUp, MdShoppingCart, MdRemoveShoppingCart, MdDownload } from "react-icons/md";
import { FiTarget, FiShoppingBag, FiPercent } from "react-icons/fi";

function ConversionReports() {
  const [data, setData] = useState({
    overallConversionRate: 0,
    addToCartRate: 0,
    checkoutRate: 0,
    purchaseRate: 0,
    cartAbandonment: 0,
    funnelData: [],
    conversionByCategory: [],
    conversionByDevice: [],
    trends: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30days");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/analytics/conversion?period=${period}`, {
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
  }, [period]);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conversion Reports</h1>
          <p className="text-sm text-gray-500">Analyze your sales funnel performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2">
            <MdDownload /> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <FiTarget className="text-xl" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              <h3 className="text-3xl font-bold">{data.overallConversionRate}%</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MdShoppingCart />
                <span className="text-sm">Add to Cart</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{data.addToCartRate}%</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <FiShoppingBag />
                <span className="text-sm">Checkout</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{data.checkoutRate}%</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MdRemoveShoppingCart />
                <span className="text-sm">Cart Abandonment</span>
              </div>
              <h3 className="text-2xl font-bold text-red-500">{data.cartAbandonment}%</h3>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Sales Funnel</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Store Visits', value: data.funnelData?.[0]?.value || 1000, color: 'bg-blue-500' },
                { label: 'Product Views', value: data.funnelData?.[1]?.value || 600, color: 'bg-cyan-500' },
                { label: 'Add to Cart', value: data.funnelData?.[2]?.value || 300, color: 'bg-green-500' },
                { label: 'Checkout Started', value: data.funnelData?.[3]?.value || 150, color: 'bg-yellow-500' },
                { label: 'Purchase Complete', value: data.funnelData?.[4]?.value || 100, color: 'bg-emerald-500' }
              ].map((step, i, arr) => {
                const maxValue = arr[0].value;
                const percentage = (step.value / maxValue) * 100;
                const dropOff = i > 0 ? Math.round((1 - step.value / arr[i-1].value) * 100) : 0;
                
                return (
                  <div key={i} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700">{step.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{step.value.toLocaleString()}</span>
                        {i > 0 && (
                          <span className="text-xs text-red-500">-{dropOff}%</span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full ${step.color} rounded-lg transition-all flex items-center justify-end pr-3`}
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs text-white font-medium">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conversion by Category */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Conversion by Category</h3>
              
              {data.conversionByCategory?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No category data available</p>
              ) : (
                <div className="space-y-3">
                  {data.conversionByCategory?.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${cat.rate * 10}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${cat.rate > 3 ? 'text-green-600' : 'text-orange-600'}`}>
                          {cat.rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conversion by Device */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Conversion by Device</h3>
              
              {data.conversionByDevice?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No device data available</p>
              ) : (
                <div className="space-y-3">
                  {data.conversionByDevice?.map((device, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{device.device}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${device.rate * 10}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${device.rate > 3 ? 'text-green-600' : 'text-orange-600'}`}>
                          {device.rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h4 className="font-semibold text-green-800 mb-2">🎯 Improve Conversion</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div className="flex items-start gap-2">
                <span>•</span>
                <p>Add high-quality product images to reduce bounce rate</p>
              </div>
              <div className="flex items-start gap-2">
                <span>•</span>
                <p>Simplify checkout process to reduce abandonment</p>
              </div>
              <div className="flex items-start gap-2">
                <span>•</span>
                <p>Offer free shipping to encourage larger orders</p>
              </div>
              <div className="flex items-start gap-2">
                <span>•</span>
                <p>Display customer reviews to build trust</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ConversionReports;
