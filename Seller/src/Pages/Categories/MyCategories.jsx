import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdCategory, MdSearch } from "react-icons/md";
import { FiPackage, FiGrid } from "react-icons/fi";

function MyCategories() {
  const [data, setData] = useState({ categories: [], totalProducts: 0 });
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
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/categories/my-categories`, {
          headers: { stoken }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCategories = data.categories.filter(cat =>
    (cat.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to handle both Cloudinary and Local images
  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith("http")) return imgUrl; // Cloudinary or external
    return `${import.meta.env.VITE_BACKEND_URL}/${imgUrl.replace(/\\/g, "/")}`; // Local fallback
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Categories</h1>
          <p className="text-sm text-gray-500">View categories where you have products listed</p>
        </div>
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FiGrid className="text-xl" />
            <span className="text-sm font-medium">Total Categories</span>
          </div>
          <h3 className="text-2xl font-bold">{data.categories.length}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Products</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{data.totalProducts}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Avg. Products/Category</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {data.categories.length > 0 ? Math.round(data.totalProducts / data.categories.length) : 0}
          </h3>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <MdCategory className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No Categories Found</h3>
          <p className="text-gray-500 mt-2">Start adding products to see your categories here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {getImageUrl(category.image) ? (
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  {/* Fallback Initial if image missing or fails to load */}
                  <span className="text-2xl font-bold text-blue-400" style={{ display: getImageUrl(category.image) ? 'none' : 'block' }}>
                    {category.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{category.productCount} products</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Revenue</p>
                    <p className="font-semibold text-gray-800">{formatINR(category.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Sales</p>
                    <p className="font-semibold text-gray-800">{category.salesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCategories;