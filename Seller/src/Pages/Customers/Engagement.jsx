import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdFavorite, MdTrendingUp, MdLoyalty, MdStars, MdCardGiftcard } from "react-icons/md";
import { FiHeart, FiShoppingBag, FiUsers, FiGift, FiAward } from "react-icons/fi";

function Engagement() {
  const [activeTab, setActiveTab] = useState("wishlists");
  const [wishlistData, setWishlistData] = useState({ totalWishlistAdditions: 0, uniqueCustomers: 0, topWishlistedProducts: [] });
  const [loyaltyData, setLoyaltyData] = useState({ 
    totalMembers: 0, 
    tierBreakdown: [], 
    rewardsRedeemed: 0, 
    totalPointsIssued: 0 
  });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [wishlistRes, loyaltyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/customers/wishlist-insights`, {
            headers: { stoken }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/customers/loyalty`, {
            headers: { stoken }
          })
        ]);
        if (wishlistRes.data.success) setWishlistData(wishlistRes.data.data);
        if (loyaltyRes.data.success) {
          // Map the response data to expected format
          const loyData = loyaltyRes.data.data;
          setLoyaltyData({
            totalMembers: loyData.customers?.length || 0,
            tierBreakdown: [
              { tier: "Platinum", count: loyData.tierDistribution?.platinum || 0 },
              { tier: "Gold", count: loyData.tierDistribution?.gold || 0 },
              { tier: "Silver", count: loyData.tierDistribution?.silver || 0 },
              { tier: "Bronze", count: loyData.tierDistribution?.bronze || 0 }
            ].filter(t => t.count > 0),
            rewardsRedeemed: 0, // Will be added when feature is implemented
            totalPointsIssued: loyData.totalPointsIssued || 0
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stoken]);

  const getTierColor = (tier) => {
    switch(tier) {
      case "Platinum": return "from-gray-600 to-gray-800";
      case "Gold": return "from-yellow-500 to-amber-600";
      case "Silver": return "from-gray-400 to-gray-500";
      default: return "from-orange-400 to-orange-600";
    }
  };

  const getTierIcon = (tier) => {
    switch(tier) {
      case "Platinum": return "💎";
      case "Gold": return "🥇";
      case "Silver": return "🥈";
      default: return "🥉";
    }
  };

  const tabs = [
    { id: "wishlists", label: "Wishlists", icon: FiHeart },
    { id: "loyalty", label: "Loyalty", icon: FiAward }
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customer Engagement</h1>
        <p className="text-sm text-gray-500">Track wishlists and loyalty program insights</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <tab.icon className="text-lg" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Wishlists Tab */}
          {activeTab === "wishlists" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-2 opacity-90">
                    <MdFavorite className="text-2xl" />
                    <span className="text-sm font-medium uppercase tracking-wider">Total Wishlists</span>
                  </div>
                  <h2 className="text-3xl font-bold">{wishlistData.totalWishlistAdditions}</h2>
                  <p className="text-xs mt-2 opacity-80">Products added to wishlists</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2 text-purple-500">
                    <FiUsers className="text-xl" />
                    <span className="text-sm font-semibold text-gray-500 uppercase">Unique Customers</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">{wishlistData.uniqueCustomers}</h2>
                  <p className="text-xs text-gray-400 mt-1">Interested in your products</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2 text-green-500">
                    <FiShoppingBag className="text-xl" />
                    <span className="text-sm font-semibold text-gray-500 uppercase">Conversion Potential</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">{wishlistData.topWishlistedProducts.length}</h2>
                  <p className="text-xs text-gray-400 mt-1">Products with demand</p>
                </div>
              </div>

              {/* Top Wishlisted Products */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MdTrendingUp className="text-pink-500" />
                    Most Wishlisted Products
                  </h3>
                </div>

                {wishlistData.topWishlistedProducts.length === 0 ? (
                  <div className="p-12 text-center">
                    <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No wishlist data yet</p>
                    <p className="text-sm text-gray-400 mt-1">Products will appear here when customers add them to wishlists</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {wishlistData.topWishlistedProducts.map((item, i) => (
                      <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition">
                        <div className="relative">
                          <span className="absolute -top-2 -left-2 w-6 h-6 bg-pink-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          {item.product?.images?.[0]?.url ? (
                            <img 
                              src={item.product.images[0].url} 
                              alt={item.product.title}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                              <FiHeart className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.product?.title || "Unknown Product"}</h4>
                          <p className="text-sm text-gray-500">{formatINR(item.product?.price || 0)}</p>
                          {item.product?.stock !== undefined && (
                            <p className={`text-xs mt-1 ${item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 text-pink-500">
                            <FiHeart className="fill-current" />
                            <span className="font-bold text-lg">{item.count}</span>
                          </div>
                          <p className="text-xs text-gray-400">wishlists</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
                <h4 className="font-semibold text-pink-800 mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-pink-700 space-y-1">
                  <li>• Products with high wishlist counts have strong purchase intent</li>
                  <li>• Consider offering discounts on popular wishlisted items</li>
                  <li>• Restock out-of-stock wishlisted products to capture demand</li>
                  <li>• Send promotional emails to customers who wishlisted your products</li>
                </ul>
              </div>
            </div>
          )}

          {/* Loyalty Tab */}
          {activeTab === "loyalty" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <FiUsers className="text-xl" />
                    <span className="text-sm font-medium">Total Members</span>
                  </div>
                  <h3 className="text-2xl font-bold">{loyaltyData.totalMembers}</h3>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <MdStars className="text-xl" />
                    <span className="text-sm font-medium">Points Issued</span>
                  </div>
                  <h3 className="text-2xl font-bold">{loyaltyData.totalPointsIssued?.toLocaleString() || 0}</h3>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <FiGift className="text-xl" />
                    <span className="text-sm font-medium">Rewards Redeemed</span>
                  </div>
                  <h3 className="text-2xl font-bold">{loyaltyData.rewardsRedeemed}</h3>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <MdTrendingUp className="text-xl" />
                    <span className="text-sm font-medium">Conversion Rate</span>
                  </div>
                  <h3 className="text-2xl font-bold">
                    {loyaltyData.totalMembers > 0 
                      ? ((loyaltyData.rewardsRedeemed / loyaltyData.totalMembers) * 100).toFixed(1) 
                      : 0}%
                  </h3>
                </div>
              </div>

              {/* Tier Breakdown */}
              {loyaltyData.tierBreakdown.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {loyaltyData.tierBreakdown.map((tier, i) => (
                    <div key={i} className={`bg-gradient-to-br ${getTierColor(tier.tier)} rounded-xl p-5 text-white shadow-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{getTierIcon(tier.tier)}</span>
                        <FiAward className="text-2xl opacity-50" />
                      </div>
                      <h3 className="text-lg font-semibold">{tier.tier}</h3>
                      <p className="text-3xl font-bold mt-1">{tier.count}</p>
                      <p className="text-sm opacity-75 mt-1">Members</p>
                      <div className="mt-3 h-2 bg-white/20 rounded-full">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ width: `${loyaltyData.totalMembers > 0 ? (tier.count / loyaltyData.totalMembers) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Program Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MdCardGiftcard className="text-purple-500" />
                    How Points Work
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">🛒</span>
                      <div>
                        <p className="font-medium text-gray-800">Earn Points</p>
                        <p>Customers earn 1 point per ₹10 spent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">⬆️</span>
                      <div>
                        <p className="font-medium text-gray-800">Level Up</p>
                        <p>More orders = higher tier = better rewards</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">🎁</span>
                      <div>
                        <p className="font-medium text-gray-800">Redeem Rewards</p>
                        <p>100 points = ₹10 discount on next order</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiAward className="text-yellow-500" />
                    Tier Benefits
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <span className="font-medium text-orange-700">🥉 Bronze</span>
                      <span className="text-gray-600">Base rewards (1x points)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">🥈 Silver</span>
                      <span className="text-gray-600">1.25x points + Free shipping</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="font-medium text-yellow-700">🥇 Gold</span>
                      <span className="text-gray-600">1.5x points + Priority support</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="font-medium text-purple-700">💎 Platinum</span>
                      <span className="text-gray-600">2x points + Exclusive deals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {loyaltyData.totalMembers === 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
                  <MdLoyalty className="text-6xl text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-800">Start Building Customer Loyalty</h3>
                  <p className="text-purple-600 mt-2 max-w-lg mx-auto">
                    Customers who purchase from you will automatically be enrolled in the loyalty program. 
                    Watch your customer base grow and track their engagement here.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Engagement;
