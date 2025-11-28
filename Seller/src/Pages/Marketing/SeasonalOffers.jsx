import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdCelebration, MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { FiCalendar, FiGift, FiPercent } from "react-icons/fi";

function SeasonalOffers() {
  const [data, setData] = useState({ offers: [], upcomingSeasons: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    season: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    applicableCategories: [],
    bannerImage: ""
  });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/seasonal-offers`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeasonIcon = (season) => {
    const icons = {
      "Valentine's Day": "❤️",
      "Holi": "🎨",
      "Diwali": "🪔",
      "Christmas": "🎄",
      "New Year": "🎉",
      "Raksha Bandhan": "🧵",
      "Mother's Day": "💐",
      "Father's Day": "👔",
      "Birthday": "🎂",
      "Anniversary": "💍"
    };
    return icons[season] || "🎁";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Upcoming": return "bg-blue-100 text-blue-700";
      case "Expired": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const seasons = [
    "Valentine's Day",
    "Holi",
    "Mother's Day",
    "Father's Day",
    "Raksha Bandhan",
    "Independence Day",
    "Diwali",
    "Christmas",
    "New Year",
    "Birthday",
    "Anniversary",
    "Wedding Season"
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seasonal Offers</h1>
          <p className="text-sm text-gray-500">Create special promotions for holidays and occasions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd /> Create Offer
        </button>
      </div>

      {/* Upcoming Seasons */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiCalendar /> Upcoming Occasions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.upcomingSeasons?.length > 0 ? (
            data.upcomingSeasons.map((season, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <span className="text-2xl">{getSeasonIcon(season.name)}</span>
                <p className="font-medium mt-1">{season.name}</p>
                <p className="text-xs opacity-75">{season.daysUntil} days away</p>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <span className="text-2xl">❤️</span>
                <p className="font-medium mt-1">Valentine's Day</p>
                <p className="text-xs opacity-75">Plan ahead</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <span className="text-2xl">🪔</span>
                <p className="font-medium mt-1">Diwali</p>
                <p className="text-xs opacity-75">Peak season</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <span className="text-2xl">🎄</span>
                <p className="font-medium mt-1">Christmas</p>
                <p className="text-xs opacity-75">Gift season</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <span className="text-2xl">🎉</span>
                <p className="font-medium mt-1">New Year</p>
                <p className="text-xs opacity-75">Fresh start</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Current Offers */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Your Seasonal Offers</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : data.offers?.length === 0 ? (
          <div className="p-12 text-center">
            <MdCelebration className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Seasonal Offers Yet</h3>
            <p className="text-gray-500 mt-2">Create offers for upcoming holidays and occasions</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Offer
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.offers.map((offer, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                  {getSeasonIcon(offer.season)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">{offer.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{offer.season}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiPercent /> {offer.discountPercentage}% off
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar /> 
                      {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <MdEdit />
                  </button>
                  <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
          <h4 className="font-semibold text-pink-800 mb-2">🎁 Gift-Giving Seasons</h4>
          <ul className="text-sm text-pink-700 space-y-1">
            <li>• Valentine's Day - Feb 14</li>
            <li>• Mother's Day - Second Sunday of May</li>
            <li>• Father's Day - Third Sunday of June</li>
            <li>• Raksha Bandhan - Aug (varies)</li>
          </ul>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h4 className="font-semibold text-yellow-800 mb-2">✨ Festival Season</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Diwali - Oct/Nov (peak gifting)</li>
            <li>• Christmas - Dec 25</li>
            <li>• New Year - Jan 1</li>
            <li>• Holi - March (varies)</li>
          </ul>
        </div>
      </div>

      {/* Create Offer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Create Seasonal Offer</h3>
            </div>
            
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., Diwali Special Sale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season / Occasion</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select an occasion</option>
                  {seasons.map((s, i) => (
                    <option key={i} value={s}>{getSeasonIcon(s)} {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., 20"
                  min="1"
                  max="100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeasonalOffers;
