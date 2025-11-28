import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdStarBorder, MdStarHalf, MdFilterList } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";

function CustomerReviews() {
  const [data, setData] = useState({ reviews: [], stats: {}, pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/customers/reviews?page=${page}&rating=${ratingFilter}`,
          { headers: { stoken } }
        );
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, ratingFilter]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<MdStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<MdStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<MdStarBorder key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
        <p className="text-sm text-gray-500">See what customers say about your products</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-5 text-white">
          <p className="text-sm opacity-90">Average Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-3xl font-bold">{data.stats.average || 0}</h3>
            <div className="flex">{renderStars(parseFloat(data.stats.average) || 0)}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.stats.total || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">5 Star Reviews</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">{data.stats.distribution?.[5] || 0}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">1-2 Star Reviews</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">
            {(data.stats.distribution?.[1] || 0) + (data.stats.distribution?.[2] || 0)}
          </h3>
        </div>
      </div>

      {/* Rating Distribution */}
      {data.stats.distribution && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = data.stats.distribution[rating] || 0;
              const percentage = data.stats.total > 0 ? (count / data.stats.total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <MdStar className="text-yellow-400" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setRatingFilter("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !ratingFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {[5, 4, 3, 2, 1].map(r => (
          <button
            key={r}
            onClick={() => setRatingFilter(r.toString())}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              ratingFilter === r.toString() ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r} <MdStar className={ratingFilter === r.toString() ? 'text-white' : 'text-yellow-400'} />
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : data.reviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
            <FiMessageSquare className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          data.reviews.map((review, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {review.productId?.images?.[0]?.url && (
                  <img 
                    src={review.productId.images[0].url} 
                    alt={review.productId.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                      <p className="text-sm text-gray-500">{review.productId?.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerReviews;
