import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuStar, LuSearch, LuThumbsUp, LuMessageCircle, LuImage, LuDownload } from "react-icons/lu";
import { exportToExcel, REVIEW_EXPORT_COLUMNS } from "../../utils/exportUtils";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews?rating=${filter}`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setReviews(res.data.data.reviews || []);
        setStats(res.data.data.stats || stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <LuStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
      />
    ));
  };

  const totalRatings = Object.values(stats.ratingBreakdown).reduce((a, b) => a + b, 0);

  const filteredReviews = reviews.filter(r => 
    r.productName?.toLowerCase().includes(search.toLowerCase()) ||
    r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all customer reviews</p>
        </div>
        <button 
          onClick={() => exportToExcel(reviews, `reviews_${filter}`, REVIEW_EXPORT_COLUMNS)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
        >
          <LuDownload className="w-4 h-4" />
          Export Reviews
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Rating Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <h2 className="text-5xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || '0.0'}</h2>
                <div className="flex justify-center gap-1 my-3">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-sm text-gray-500">{stats.totalReviews} total reviews</p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = stats.ratingBreakdown[star] || 0;
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-12 text-sm text-gray-600 flex items-center gap-1">{star} <LuStar className="w-3 h-3 fill-amber-400 text-amber-400" /></span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-sm text-gray-500 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "5", "4", "3", "2", "1"].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilter(rating)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === rating 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {rating === "all" ? "All" : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <LuStar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Reviews Yet</h3>
              <p className="text-gray-500 text-sm mt-1">Customer reviews will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      {review.productImage ? (
                        <img src={review.productImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <LuImage className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.productName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              by {review.customerName}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {review.title && (
                        <h5 className="font-medium text-gray-900 mt-3">{review.title}</h5>
                      )}
                      
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.comment}</p>

                      {/* Review Images */}
                      {review.images?.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {review.images.map((img, j) => (
                            <img 
                              key={j} 
                              src={img} 
                              alt="" 
                              className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 border border-gray-100"
                            />
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <button className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                          <LuThumbsUp className="w-4 h-4" /> Helpful ({review.helpfulCount || 0})
                        </button>
                        <a 
                          href={`/seller/reviews/respond/${review._id}`}
                          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 font-medium transition-colors"
                        >
                          <LuMessageCircle className="w-4 h-4" /> {review.response ? 'View Response' : 'Respond'}
                        </a>
                      </div>

                      {/* Seller Response */}
                      {review.response && (
                        <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                          <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">Your Response</p>
                          <p className="text-sm text-indigo-700">{review.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyReviews;
