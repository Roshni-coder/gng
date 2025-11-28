import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuTag, LuPenLine, LuSave, LuX, LuPercent, LuPackage, LuSearch, LuInfo } from "react-icons/lu";

function DiscountManager() {
  const [data, setData] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [discountValue, setDiscountValue] = useState("");
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
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/discounts`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiscount = async (productId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/discounts/${productId}`,
        { discountPercentage: Number(discountValue) },
        { headers: { stoken } }
      );
      if (res.data.success) {
        setEditingProduct(null);
        setDiscountValue("");
        fetchData();
        alert("Discount updated!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update discount");
    }
  };

  const filteredProducts = data.products?.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Discount Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Set discounts for individual products</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg shadow-amber-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <LuTag className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Products on Sale</span>
            </div>
            <h3 className="text-3xl font-bold">
              {data.products?.filter(p => p.discount > 0).length || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <LuPackage className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{data.products?.length || 0}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <LuPercent className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Discount</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {data.products?.length > 0 
              ? Math.round(data.products.reduce((sum, p) => sum + (p.discount || 0), 0) / data.products.length)
              : 0}%
          </h3>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <LuPackage className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No Products Found</h3>
          <p className="text-gray-500 text-sm mt-1">Add products to start managing discounts</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Original Price</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Final Price</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <LuPackage className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">{formatINR(product.price)}</td>
                    <td className="px-6 py-4 text-right">
                      {editingProduct === product._id ? (
                        <input
                          type="number"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-right text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          product.discount > 0 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {product.discount || 0}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-emerald-600">
                        {formatINR(product.price * (1 - (product.discount || 0) / 100))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingProduct === product._id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setEditingProduct(null); setDiscountValue(""); }}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            <LuX className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateDiscount(product._id)}
                            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <LuSave className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingProduct(product._id); setDiscountValue(product.discount?.toString() || ""); }}
                          className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <LuPenLine className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <LuInfo className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 text-sm mb-2">Discount Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Use discounts strategically - 10-20% works well for most products</li>
              <li>• Time-limited discounts create urgency</li>
              <li>• Bundle discounts can increase average order value</li>
              <li>• Don't over-discount - it can devalue your brand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountManager;
