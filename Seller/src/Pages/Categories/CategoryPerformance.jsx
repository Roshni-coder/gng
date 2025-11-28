import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdTrendingUp, MdCategory, MdDownload } from "react-icons/md";
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from "react-icons/fi";
import { exportToExcel, CATEGORY_EXPORT_COLUMNS } from "../../utils/exportUtils";

function CategoryPerformance() {
  const [data, setData] = useState({ 
    categories: [], 
    bestPerforming: null, 
    worstPerforming: null 
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30days");
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
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/categories/performance?period=${period}`, {
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

  const maxRevenue = Math.max(...(data.categories?.map(c => c.revenue) || [1]));

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Category Performance</h1>
          <p className="text-sm text-gray-500">Analyze how each category is performing</p>
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
          <button 
            onClick={() => exportToExcel(data.categories, `category_performance_${period}`, CATEGORY_EXPORT_COLUMNS)}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
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
          {/* Best & Worst Performing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.bestPerforming && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <FiTrendingUp className="text-xl" />
                  <span className="text-sm font-medium">Best Performing Category</span>
                </div>
                <h3 className="text-2xl font-bold">{data.bestPerforming.name}</h3>
                <div className="mt-3 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Revenue</p>
                    <p className="font-semibold">{formatINR(data.bestPerforming.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Orders</p>
                    <p className="font-semibold">{data.bestPerforming.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Growth</p>
                    <p className="font-semibold">+{data.bestPerforming.growth}%</p>
                  </div>
                </div>
              </div>
            )}

            {data.worstPerforming && (
              <div className="bg-white border-2 border-red-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3 text-red-600">
                  <FiTrendingDown className="text-xl" />
                  <span className="text-sm font-medium">Needs Attention</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{data.worstPerforming.name}</h3>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold text-gray-800">{formatINR(data.worstPerforming.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Orders</p>
                    <p className="font-semibold text-gray-800">{data.worstPerforming.orders}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Change</p>
                    <p className="font-semibold text-red-600">{data.worstPerforming.growth}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Comparison Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiBarChart2 className="text-blue-500" /> Revenue by Category
            </h3>
            
            {data.categories?.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No category data available
              </div>
            ) : (
              <div className="space-y-4">
                {data.categories?.map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        {cat.growth > 0 && (
                          <span className="text-xs text-green-600 flex items-center gap-0.5">
                            <FiTrendingUp /> {cat.growth}%
                          </span>
                        )}
                        {cat.growth < 0 && (
                          <span className="text-xs text-red-600 flex items-center gap-0.5">
                            <FiTrendingDown /> {Math.abs(cat.growth)}%
                          </span>
                        )}
                      </div>
                      <span className="text-gray-600">{formatINR(cat.revenue)}</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full rounded-lg transition-all ${
                          i === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          i === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          i === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                        style={{ width: `${(cat.revenue / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Stats Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Detailed Performance</h3>
            </div>
            
            {data.categories?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Category</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Products</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Orders</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Revenue</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Avg. Order</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Conversion</th>
                      <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.categories?.map((cat, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MdCategory className="text-blue-500" />
                            </div>
                            <span className="font-medium text-gray-800">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right text-gray-600">{cat.productCount}</td>
                        <td className="px-5 py-4 text-right text-gray-600">{cat.orders}</td>
                        <td className="px-5 py-4 text-right font-semibold text-gray-800">{formatINR(cat.revenue)}</td>
                        <td className="px-5 py-4 text-right text-gray-600">
                          {formatINR(cat.orders > 0 ? cat.revenue / cat.orders : 0)}
                        </td>
                        <td className="px-5 py-4 text-right text-gray-600">{cat.conversionRate}%</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            cat.growth > 0 ? 'bg-green-100 text-green-700' : 
                            cat.growth < 0 ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {cat.growth > 0 ? <FiTrendingUp /> : cat.growth < 0 ? <FiTrendingDown /> : null}
                            {Math.abs(cat.growth)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Performance Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Focus on high-performing categories to maximize revenue</li>
              <li>• Consider promotions for underperforming categories</li>
              <li>• Add more products to popular categories</li>
              <li>• Analyze seasonal trends to plan inventory</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryPerformance;
