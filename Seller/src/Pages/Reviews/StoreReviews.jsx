import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdStorefront, MdTrendingUp, MdVerified } from "react-icons/md";
import { FiMessageCircle, FiClock, FiThumbsUp } from "react-icons/fi";

function StoreReviews() {
  const [reviews, setReviews] = useState([]);
  const [storeStats, setStoreStats] = useState({
    overallRating: 0,
    totalReviews: 0,
    responseRate: 0,
    avgResponseTime: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    recentTrend: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchStoreReviews();
  }, [filter]);

  const fetchStoreReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/store?filter=${filter}`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setReviews(res.data.data.reviews || []);
        setStoreStats(res.data.data.stats || storeStats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRatings = Object.values(storeStats.ratingBreakdown).reduce((a, b) => a + b, 0);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MdStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Store Reviews</h1>
        <p className="text-sm text-gray-500">Overall store feedback and ratings</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Store Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main Rating */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white col-span-1 md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl">
                  <MdStorefront className="text-4xl" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold">{storeStats.overallRating?.toFixed(1) || '0.0'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {renderStars(Math.round(storeStats.overallRating))}
                    </div>
                    <span className="text-sm opacity-90">({storeStats.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm opacity-80">Response Rate</p>
                  <p className="text-2xl font-bold">{storeStats.responseRate || 0}%</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Avg Response</p>
                  <p className="text-2xl font-bold">{storeStats.avgResponseTime || 0}h</p>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 col-span-1 md:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = storeStats.ratingBreakdown[star] || 0;
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-6 text-sm text-gray-600">{star}★</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-16 text-sm text-gray-600 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <MdVerified className="text-3xl text-green-500 mx-auto mb-2" />
              <h4 className="text-2xl font-bold text-gray-800">{storeStats.verifiedPurchases || 0}%</h4>
              <p className="text-sm text-gray-500">Verified Purchases</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <FiThumbsUp className="text-3xl text-blue-500 mx-auto mb-2" />
              <h4 className="text-2xl font-bold text-gray-800">{storeStats.positiveRate || 0}%</h4>
              <p className="text-sm text-gray-500">Positive Reviews</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <FiMessageCircle className="text-3xl text-purple-500 mx-auto mb-2" />
              <h4 className="text-2xl font-bold text-gray-800">{storeStats.respondedReviews || 0}</h4>
              <p className="text-sm text-gray-500">Responses Given</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <MdTrendingUp className="text-3xl text-orange-500 mx-auto mb-2" />
              <h4 className="text-2xl font-bold text-gray-800">
                {storeStats.recentTrend > 0 ? '+' : ''}{storeStats.recentTrend?.toFixed(1) || '0.0'}
              </h4>
              <p className="text-sm text-gray-500">30-Day Trend</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All Reviews" },
              { value: "pending", label: "Needs Response" },
              { value: "positive", label: "Positive (4-5★)" },
              { value: "negative", label: "Negative (1-2★)" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  filter === tab.value 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <MdStorefront className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Store Reviews</h3>
              <p className="text-gray-500 mt-2">Store-level reviews will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {review.customerName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{review.customerName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex text-sm">
                            {renderStars(review.rating)}
                          </div>
                          {review.isVerified && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <MdVerified /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FiClock className="text-xs" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-700">{review.comment}</p>

                  {review.response ? (
                    <div className="mt-4 bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">Your Response:</p>
                      <p className="text-sm text-blue-700">{review.response}</p>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-3">
                      <a 
                        href={`/seller/reviews/respond/${review._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Respond to Review
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">🏪 Store Rating Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Maintain a high response rate by replying to all reviews</li>
              <li>• Address negative feedback promptly and professionally</li>
              <li>• Thank customers for positive feedback</li>
              <li>• Use reviews to improve your service quality</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default StoreReviews;
