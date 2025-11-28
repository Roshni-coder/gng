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
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCategories = data.categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <MdCategory className="text-3xl text-blue-500" />
                  )}
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

              {category.subcategories?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Subcategories:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 3).map((sub, j) => (
                      <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        +{category.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">📂 Category Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• List products in relevant categories for better visibility</li>
          <li>• Use subcategories to help customers find products easily</li>
          <li>• Popular categories get more traffic - focus on top performers</li>
        </ul>
      </div>
    </div>
  );
}

export default MyCategories;
