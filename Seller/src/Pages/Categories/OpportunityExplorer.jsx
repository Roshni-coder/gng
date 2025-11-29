import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MdLightbulb, MdAdd, MdSearch } from "react-icons/md";
import { FiTrendingUp, FiStar, FiTarget, FiGrid, FiZap } from "react-icons/fi";
import { MyContext } from "../../App.jsx";

function OpportunityExplorer() {
  const { setIsOpenAddProductPanel } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState("browse");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState({
    suggestions: [],
    trendingCategories: [],
    untappedCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all categories for browse tab
      const categoriesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getcategories`);
      setCategories(categoriesRes.data || []);

      // Fetch suggestions data
      const suggestionsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/categories/suggestions`, {
        headers: { stoken }
      });
      if (suggestionsRes.data.success) {
        setSuggestions(suggestionsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.categoryname?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRequestCategory = () => {
    setIsOpenAddProductPanel({ open: true, model: "Add New Category" });
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0 || !images[0].url) return null;
    const url = images[0].url;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_BACKEND_URL}/${url.replace(/\\/g, "/")}`;
  };

  const tabs = [
    { id: "browse", label: "Browse Categories", icon: FiGrid },
    { id: "suggestions", label: "AI Suggestions", icon: FiZap },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Opportunity Explorer</h1>
          <p className="text-sm text-gray-500">Discover new categories to expand your business</p>
        </div>
        <button
          onClick={handleRequestCategory}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 flex items-center gap-2"
        >
          <MdAdd className="text-lg" /> Request New Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium transition-all ${activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <tab.icon className="text-lg" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Browse Tab */}
          {activeTab === "browse" && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Categories Grid */}
              {filteredCategories.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <FiGrid className="text-5xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No Categories Found</h3>
                  <p className="text-gray-500 mt-2">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCategories.map((cat) => {
                    const imgUrl = getImageUrl(cat.images);

                    return (
                      <div
                        key={cat._id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={cat.categoryname}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            ) : null}
                            {/* Fallback */}
                            <span
                              className="text-2xl font-bold text-blue-500"
                              style={{ display: imgUrl ? 'none' : 'block' }}
                            >
                              {cat.categoryname?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{cat.categoryname}</h4>
                            <p className="text-sm text-gray-500">Available to sell</p>
                          </div>
                        </div>

                        <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 font-medium transition-colors">
                          <MdAdd /> Start Selling
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === "suggestions" && (
            <div className="space-y-6">
              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <MdLightbulb className="text-2xl" />
                  <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  Based on your sales history and market trends, here are categories that could boost your sales.
                </p>

                {suggestions.suggestions?.length === 0 ? (
                  <p className="text-white/75">Keep selling to get personalized recommendations!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestions.suggestions?.slice(0, 3).map((suggestion, i) => (
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

                {suggestions.trendingCategories?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No trending data available</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {suggestions.trendingCategories?.map((cat, i) => (
                      <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-yellow-100 text-yellow-600' :
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

              {/* Low Competition Categories */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex items-center gap-2">
                  <FiTarget className="text-purple-500 text-xl" />
                  <h3 className="font-semibold text-gray-800">Low Competition Opportunities</h3>
                </div>

                {suggestions.untappedCategories?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No suggestions available</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    {suggestions.untappedCategories?.map((cat, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.competition === 'Low' ? 'bg-green-100 text-green-700' :
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
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OpportunityExplorer;