import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdFavorite, MdTrendingUp } from "react-icons/md";
import { FiHeart, FiShoppingBag, FiUsers } from "react-icons/fi";

function WishlistInsights() {
  const [data, setData] = useState({ totalWishlistAdditions: 0, uniqueCustomers: 0, topWishlistedProducts: [] });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/customers/wishlist-insights`, {
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Wishlist Insights</h1>
        <p className="text-sm text-gray-500">See which products customers love</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <MdFavorite className="text-2xl" />
            <span className="text-sm font-medium uppercase tracking-wider">Total Wishlists</span>
          </div>
          <h2 className="text-3xl font-bold">{data.totalWishlistAdditions}</h2>
          <p className="text-xs mt-2 opacity-80">Products added to wishlists</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-purple-500">
            <FiUsers className="text-xl" />
            <span className="text-sm font-semibold text-gray-500 uppercase">Unique Customers</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{data.uniqueCustomers}</h2>
          <p className="text-xs text-gray-400 mt-1">Interested in your products</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-green-500">
            <FiShoppingBag className="text-xl" />
            <span className="text-sm font-semibold text-gray-500 uppercase">Conversion Potential</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{data.topWishlistedProducts.length}</h2>
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

        {data.topWishlistedProducts.length === 0 ? (
          <div className="p-12 text-center">
            <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No wishlist data yet</p>
            <p className="text-sm text-gray-400 mt-1">Products will appear here when customers add them to wishlists</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.topWishlistedProducts.map((item, i) => (
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
  );
}

export default WishlistInsights;
