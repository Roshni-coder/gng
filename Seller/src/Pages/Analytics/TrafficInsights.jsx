import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdVisibility, MdDevices, MdLocationOn, MdDownload } from "react-icons/md";
import { FiUsers, FiMonitor, FiSmartphone, FiGlobe } from "react-icons/fi";

function TrafficInsights() {
  const [data, setData] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
    trafficSources: [],
    deviceBreakdown: [],
    topPages: [],
    locationData: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30days");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/analytics/traffic?period=${period}`, {
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDeviceIcon = (device) => {
    switch(device?.toLowerCase()) {
      case 'mobile': return <FiSmartphone className="text-blue-500" />;
      case 'desktop': return <FiMonitor className="text-purple-500" />;
      default: return <MdDevices className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Traffic Insights</h1>
          <p className="text-sm text-gray-500">Understand your store visitors</p>
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
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <MdVisibility className="text-xl" />
                <span className="text-sm font-medium">Total Visits</span>
              </div>
              <h3 className="text-2xl font-bold">{data.totalVisits?.toLocaleString()}</h3>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <FiUsers className="text-xl" />
                <span className="text-sm font-medium">Unique Visitors</span>
              </div>
              <h3 className="text-2xl font-bold">{data.uniqueVisitors?.toLocaleString()}</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-1">Avg. Session Duration</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatDuration(data.averageSessionDuration)}</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-1">Bounce Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.bounceRate}%</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiGlobe className="text-blue-500" /> Traffic Sources
              </h3>
              
              {data.trafficSources?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No traffic data available</p>
              ) : (
                <div className="space-y-4">
                  {data.trafficSources?.map((source, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{source.source}</span>
                        <span className="text-gray-600">{source.visits?.toLocaleString()} ({source.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            source.source === 'Direct' ? 'bg-blue-500' :
                            source.source === 'Search' ? 'bg-green-500' :
                            source.source === 'Social' ? 'bg-purple-500' :
                            source.source === 'Referral' ? 'bg-orange-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MdDevices className="text-purple-500" /> Devices
              </h3>
              
              {data.deviceBreakdown?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No device data available</p>
              ) : (
                <div className="space-y-4">
                  {data.deviceBreakdown?.map((device, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getDeviceIcon(device.device)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{device.device}</p>
                        <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{device.visits?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{device.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Top Viewed Pages</h3>
            </div>
            
            {data.topPages?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No page data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Page</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Views</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Unique Views</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Avg. Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.topPages?.map((page, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-gray-800">{page.page}</td>
                        <td className="px-5 py-3 text-right text-gray-600">{page.views?.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-gray-600">{page.uniqueViews?.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-gray-600">{formatDuration(page.avgTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Location Data */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MdLocationOn className="text-red-500" /> Top Locations
            </h3>
            
            {data.locationData?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No location data available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {data.locationData?.map((location, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-800">{location.city}</p>
                    <p className="text-sm text-gray-500">{location.visits} visits</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Traffic Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Optimize your product pages for mobile users</li>
              <li>• Reduce bounce rate by improving page load speed</li>
              <li>• Focus marketing efforts on your top traffic sources</li>
              <li>• Add compelling CTAs to keep visitors engaged longer</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default TrafficInsights;
