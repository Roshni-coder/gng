import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLightbulb, MdTrendingUp, MdAdd } from "react-icons/md";
import { FiTrendingUp, FiStar, FiTarget } from "react-icons/fi";

function CategorySuggestions() {
  const [data, setData] = useState({ 
    suggestions: [], 
    trendingCategories: [], 
    untappedCategories: [] 
  });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/categories/suggestions`, {
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

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Category Suggestions</h1>
          <p className="text-sm text-gray-500">Discover new categories to grow your business</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <MdLightbulb className="text-2xl" />
              <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Based on your sales history and market trends, here are categories that could boost your sales.
            </p>
            
            {data.suggestions?.length === 0 ? (
              <p className="text-white/75">Keep selling to get personalized recommendations!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.suggestions?.slice(0, 3).map((suggestion, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiStar className="text-yellow-300" />
                      <span className="font-semibold">{suggestion.category}</span>
                    </div>
                    <p className="text-xs opacity-80 mb-3">{suggestion.reason}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-75">Potential: {suggestion.potential}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-lg text-xs">
                        {suggestion.competition} competition
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Categories */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <FiTrendingUp className="text-green-500 text-xl" />
              <h3 className="font-semibold text-gray-800">Trending Categories</h3>
            </div>
            
            {data.trendingCategories?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No trending data available</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.trendingCategories?.map((cat, i) => (
                  <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      i === 0 ? 'bg-yellow-100 text-yellow-600' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      i === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <span className="text-lg font-bold">#{i + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {cat.totalSellers} sellers • {cat.totalProducts} products
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="flex items-center gap-1 text-green-600 font-semibold">
                        <FiTrendingUp />
                        +{cat.growthRate}%
                      </p>
                      <p className="text-xs text-gray-500">growth this month</p>
                    </div>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
                      <MdAdd /> Start Selling
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Untapped Opportunities */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <FiTarget className="text-purple-500 text-xl" />
              <h3 className="font-semibold text-gray-800">Low Competition Categories</h3>
            </div>
            
            {data.untappedCategories?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No suggestions available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {data.untappedCategories?.map((cat, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cat.competition === 'Low' ? 'bg-green-100 text-green-700' :
                        cat.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {cat.competition} Competition
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Demand</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <div 
                              key={j} 
                              className={`w-4 h-2 rounded ${j < cat.demandLevel ? 'bg-green-500' : 'bg-gray-200'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg. Price</span>
                        <span className="text-gray-800 font-medium">₹{cat.avgPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Sellers</span>
                        <span className="text-gray-800 font-medium">{cat.activeSellers}</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1">
                      <MdAdd /> Explore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h4 className="font-semibold text-green-800 mb-3">🚀 Fastest Growing</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <FiTrendingUp /> Gift Hampers (+45% this month)
                </li>
                <li className="flex items-center gap-2">
                  <FiTrendingUp /> Personalized Gifts (+38% this month)
                </li>
                <li className="flex items-center gap-2">
                  <FiTrendingUp /> Corporate Gifts (+32% this month)
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-semibold text-blue-800 mb-3">💡 Seasonal Opportunities</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Valentine's Day gifts trending in next 30 days</li>
                <li>• Wedding season starting soon - focus on wedding gifts</li>
                <li>• Summer vacation gifts gaining popularity</li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h4 className="font-semibold text-yellow-800 mb-2">⚡ Quick Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Start with low competition categories to establish yourself</li>
              <li>• Focus on trending categories for quick wins</li>
              <li>• Diversify across multiple categories to reduce risk</li>
              <li>• Check demand trends before adding new product lines</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default CategorySuggestions;
