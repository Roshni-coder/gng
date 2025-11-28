import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdTrendingUp, MdTrendingDown, MdSearch } from "react-icons/md";
import { FiImage, FiMessageCircle, FiEye } from "react-icons/fi";

function ProductReviews() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("reviews");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchProductReviews();
  }, [sortBy]);

  const fetchProductReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/by-product?sort=${sortBy}`, {
        headers: { stoken }
      });
      if (res.data.success) setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-100";
    if (rating >= 3) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Product Reviews</h1>
        <p className="text-sm text-gray-500">See review performance by product</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="reviews">Most Reviews</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
              <option value="recent">Recently Reviewed</option>
            </select>
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FiImage className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Product Reviews</h3>
              <p className="text-gray-500 mt-2">Reviews by product will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProducts.map((product, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiImage className="text-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>

                      <div className="flex items-center gap-4 mt-3">
                        {/* Rating Badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${getRatingColor(product.averageRating)}`}>
                          <MdStar className="text-lg" />
                          <span className="font-semibold">{product.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>

                        {/* Review Count */}
                        <span className="text-sm text-gray-600">
                          {product.reviewCount || 0} reviews
                        </span>

                        {/* Trend */}
                        {product.trend && (
                          <span className={`text-sm flex items-center gap-1 ${
                            product.trend > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.trend > 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                            {Math.abs(product.trend).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Bars */}
                  <div className="mt-4 grid grid-cols-5 gap-1">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = product.ratingBreakdown?.[star] || 0;
                      const total = product.reviewCount || 1;
                      const percentage = (count / total) * 100;
                      return (
                        <div key={star} className="text-center">
                          <div className="h-12 bg-gray-100 rounded relative overflow-hidden">
                            <div 
                              className={`absolute bottom-0 w-full ${
                                star >= 4 ? 'bg-green-400' : star === 3 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              style={{ height: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{star}★</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Reviews Preview */}
                  {product.recentReviews?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <strong>Latest:</strong> "{product.recentReviews[0].comment}"
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <a 
                      href={`/seller/reviews/product/${product._id}`}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-2"
                    >
                      <FiEye /> View All
                    </a>
                    <a 
                      href={`/seller/reviews/respond?product=${product._id}`}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle /> Respond
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h4 className="font-semibold text-green-800 mb-2">💡 Improve Your Ratings</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Respond to negative reviews professionally and offer solutions</li>
              <li>• Thank customers for positive reviews</li>
              <li>• Use feedback to improve product quality</li>
              <li>• Request reviews from satisfied customers</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductReviews;
