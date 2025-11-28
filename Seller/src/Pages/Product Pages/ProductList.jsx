import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, IconButton } from "@mui/material";
import { MdOutlineEdit, MdClose, MdSaveAlt } from "react-icons/md";
import { LuTrash2, LuPackage, LuSearch } from "react-icons/lu";
import Progress from "../../Components/Progress/Progress";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [updateTask, setUpdateTask] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const stoken = localStorage.getItem("stoken") || "";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts`,
        { headers: { stoken } }
      );
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setUpdateTask({
      [product._id]: {
        title: product.title,
        price: product.price,
        stock: product.stock,
      },
    });
  };

  const handleUpdateChange = (id, value, field) => {
    setUpdateTask((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveUpdate = async (id) => {
    const dataToSend = updateTask[id];
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/updateproduct/${id}`,
        dataToSend
      );
      await fetchProducts();
      setEditingId(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/deleteproduct/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">Out of Stock</span>;
    } else if (stock < 5) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Low: {stock} Left</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">{stock} In Stock</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <Progress />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <LuPackage className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isEditing = editingId === product._id;
                  const draft = updateTask[product._id] || {};

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Product Name & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <LuPackage className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          {isEditing ? (
                            <TextField 
                              size="small" 
                              value={draft.title} 
                              onChange={(e) => handleUpdateChange(product._id, e.target.value, "title")}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                          ) : (
                            <span className="font-medium text-gray-900">{product.title}</span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <TextField 
                            type="number" 
                            size="small" 
                            className="w-28"
                            value={draft.price} 
                            onChange={(e) => handleUpdateChange(product._id, e.target.value, "price")}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        ) : (
                          <span className="font-semibold text-gray-700">₹{product.price?.toLocaleString()}</span>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <TextField 
                            type="number" 
                            size="small" 
                            label="Qty" 
                            className="w-24"
                            value={draft.stock ?? product.stock} 
                            onChange={(e) => handleUpdateChange(product._id, e.target.value, "stock")}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        ) : (
                          getStockBadge(product.stock)
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => saveUpdate(product._id)} 
                                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <MdSaveAlt className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => setEditingId(null)} 
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                              >
                                <MdClose className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleEditClick(product)} 
                                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <MdOutlineEdit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => deleteProduct(product._id)} 
                                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LuTrash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!loading && filteredProducts.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filteredProducts.length}</span> of <span className="font-medium text-gray-700">{products.length}</span> products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;