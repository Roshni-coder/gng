import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdAdd, MdRemove, MdSearch } from "react-icons/md";
import { FiPackage, FiStar, FiTrendingUp } from "react-icons/fi";

function FeaturedProducts() {
  const [data, setData] = useState({ 
    featuredProducts: [], 
    availableProducts: [],
    maxFeatured: 10 
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/featured`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (productId, isFeatured) => {
    try {
      const endpoint = isFeatured ? 'unfeature' : 'feature';
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/featured/${endpoint}/${productId}`,
        {},
        { headers: { stoken } }
      );
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  const filteredProducts = data.availableProducts?.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Featured Products</h1>
          <p className="text-sm text-gray-500">Highlight your best products for more visibility</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
          {data.featuredProducts?.length || 0} / {data.maxFeatured} Featured
        </div>
      </div>

      {/* Current Featured Products */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiStar className="text-yellow-500" /> Currently Featured
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
          </div>
        ) : data.featuredProducts?.length === 0 ? (
          <div className="text-center py-8">
            <MdStar className="text-5xl text-yellow-300 mx-auto mb-2" />
            <p className="text-gray-600">No featured products yet</p>
            <p className="text-sm text-gray-500">Select products below to feature them</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.featuredProducts?.map((product, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm relative group">
                <button
                  onClick={() => handleToggleFeatured(product._id, true)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MdRemove />
                </button>
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage className="text-gray-400 text-xl" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <p className="text-sm text-green-600 font-semibold">{formatINR(product.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Products */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-semibold text-gray-800">Add More Products</h3>
            <div className="relative max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products available to feature</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {filteredProducts.map((product, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="font-semibold text-gray-800">{formatINR(product.price)}</p>
                <button
                  onClick={() => handleToggleFeatured(product._id, false)}
                  disabled={data.featuredProducts?.length >= data.maxFeatured}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdAdd /> Feature
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <FiStar className="text-2xl text-yellow-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Higher Visibility</h4>
          <p className="text-sm text-gray-600 mt-1">Featured products appear at the top of search results</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <FiTrendingUp className="text-2xl text-green-500 mb-2" />
          <h4 className="font-semibold text-gray-800">More Sales</h4>
          <p className="text-sm text-gray-600 mt-1">Featured products get 3x more views on average</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <MdStar className="text-2xl text-blue-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Stand Out</h4>
          <p className="text-sm text-gray-600 mt-1">Show customers your best products first</p>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
