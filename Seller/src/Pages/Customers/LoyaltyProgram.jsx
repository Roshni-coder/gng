import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLoyalty, MdStars, MdCardGiftcard, MdTrendingUp } from "react-icons/md";
import { FiGift, FiAward, FiUsers } from "react-icons/fi";

function LoyaltyProgram() {
  const [data, setData] = useState({ 
    totalMembers: 0, 
    tierBreakdown: [], 
    rewardsRedeemed: 0, 
    totalPointsIssued: 0 
  });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/customers/loyalty-program`, {
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

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Loyalty Program</h1>
          <p className="text-sm text-gray-500">Manage customer rewards and loyalty tiers</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FiUsers className="text-xl" />
            <span className="text-sm font-medium">Total Members</span>
          </div>
          <h3 className="text-2xl font-bold">{data.totalMembers}</h3>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <MdStars className="text-xl" />
            <span className="text-sm font-medium">Points Issued</span>
          </div>
          <h3 className="text-2xl font-bold">{data.totalPointsIssued?.toLocaleString() || 0}</h3>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FiGift className="text-xl" />
            <span className="text-sm font-medium">Rewards Redeemed</span>
          </div>
          <h3 className="text-2xl font-bold">{data.rewardsRedeemed}</h3>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <MdTrendingUp className="text-xl" />
            <span className="text-sm font-medium">Conversion Rate</span>
          </div>
          <h3 className="text-2xl font-bold">
            {data.totalMembers > 0 
              ? ((data.rewardsRedeemed / data.totalMembers) * 100).toFixed(1) 
              : 0}%
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Tier Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.tierBreakdown.map((tier, i) => (
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
                    style={{ width: `${data.totalMembers > 0 ? (tier.count / data.totalMembers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

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

          {/* Empty State or Coming Soon */}
          {data.totalMembers === 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
              <MdLoyalty className="text-6xl text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-800">Start Building Customer Loyalty</h3>
              <p className="text-purple-600 mt-2 max-w-lg mx-auto">
                Customers who purchase from you will automatically be enrolled in the loyalty program. 
                Watch your customer base grow and track their engagement here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LoyaltyProgram;
