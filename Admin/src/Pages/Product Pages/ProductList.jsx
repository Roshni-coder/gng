// ProductList.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { LuTrash2 } from "react-icons/lu";
import { Button, TextField, IconButton } from "@mui/material";
import { MyContext } from "../../App.jsx";
import { FiPlus } from "react-icons/fi";
import { MdOutlineEdit, MdClose, MdSaveAlt } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import SearchBox from "../../Components/SearchBox/SearchBox.jsx";
import Progress from "../../Components/Progress/Progress.jsx";

function ProductList() {
  const { setIsOpenAddProductPanel } = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatetask, setUpdatetask] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
  if (!searchTerm) {
    setFilteredProducts(products);
  } else {
    const lower = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(lower) ||
      getCategoryNameById(product.categoryname).toLowerCase().includes(lower) ||
      getSubCategoryNameById(product.subcategory).toLowerCase().includes(lower) ||
      (product.sellerId?.name?.toLowerCase().includes(lower) || false)
    );
    setFilteredProducts(filtered);
  }
}, [searchTerm, products]);


  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getcategories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getsubcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat._id === id);
    return category ? category.categoryname : "Not found";
  };

  const getSubCategoryNameById = (id) => {
    const sub = subcategories.find((cat) => cat._id === id);
    return sub ? sub.subcategory : "Not found";
  };

  const handleupdate = (id, value, field) => {
    setUpdatetask((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleImageChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setUpdatetask({
      [product._id]: {
        title: product.title,
      },
    });
    setNewImageFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setUpdatetask({});
    setNewImageFile(null);
  };

  const update = async (_id) => {
    const updateData = updatetask[_id] || {};

    try {
      if (newImageFile) {
        const formData = new FormData();
        formData.append("image", newImageFile);

        const imgRes = await axios.put(
        `  ${import.meta.env.VITE_BACKEND_URL}/api/product/updateimage/${_id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!imgRes.data.success) {
          alert("Image upload failed");
          return;
        }
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/updateproduct/${_id}`,
        updateData
      );

      if (res.data.success) {
        alert("Product updated successfully!");
        fetchProducts();
        handleCancel();
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const removeproduct = async (_id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/deleteproduct/${_id}`);
      if (response.data.success) {
        setProducts(products.filter((product) => product._id !== _id));
      } else {
        alert("Cannot delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleApprove = async (_id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/toggle-product/${_id}`);
      alert(res.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error toggling approval:", error);
      alert("Approval toggle failed");
    }
  };

  return (
    <div className="products shadow-md rounded-md  !mt-2 px-1 md:px-6 bg-white">
      <h2 className="text-xl md:text-2xl font-semibold py-2 sm:text-left text-center">Products List</h2>

      <div className="py-2">
        <div className="w-full ">
          <SearchBox
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search Products..."
/>

        </div>
      </div>

      <div className="w-full overflow-x-auto mt-4 max-h-[550px]">
        <table className="min-w-[1000px] w-full text-sm text-center text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-black">
            <tr>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Sub Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Seller</th> {/* ✅ NEW COLUMN */}
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  <Progress />
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isEditing = editingId === product._id;
                const updateData = updatetask[product._id] || {};

                return (
                  <tr key={product._id} className="border-b border-gray-200">
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-4">
                        <div className="w-[65px] h-[65px] rounded-md overflow-hidden relative">
                          <img src={product.images[0]?.url} className="w-full h-full object-cover" alt="Product" />
                          {isEditing && (
                            <input
                              type="file"
                              onChange={handleImageChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          )}
                        </div>
                        <div className="text-left w-[75%]">
                          {isEditing ? (
                            <TextField
                              size="small"
                              fullWidth
                              value={updateData.title || ""}
                              onChange={(e) => handleupdate(product._id, e.target.value, "title")}
                            />
                          ) : (
                            <h3 className="font-semibold text-sm text-black whitespace-nowrap overflow-hidden text-ellipsis">{product.title}</h3>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{getCategoryNameById(product.categoryname)}</td>
                    <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{getSubCategoryNameById(product.subcategory)}</td>

                    <td className="px-6 py-2">
                      <div className="flex gap-2 justify-center">
                        <span className="text-black font-semibold">₹{product.price}</span>
                        <span className="line-through text-gray-500 text-sm">₹{product.oldprice}</span>
                      </div>
                    </td>

                    {/* ✅ Seller ID column */}
                    <td className="px-6 py-2  whitespace-nowrap overflow-hidden text-ellipsis">{product.sellerId?.name || "N/A"}</td>


                    <td className="px-6 py-2">
                      <span
                        className={`text-sm font-medium !px-2 py-1 rounded-full ${
                          product.approved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.approved ? "Approved" : "NotApproved"}
                      </span>
                    </td>

                    <td className="px-6 py-2">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton onClick={() => update(product._id)}>
                                <MdSaveAlt />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton onClick={handleCancel}>
                                <MdClose />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEditClick(product)}>
                                <MdOutlineEdit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => removeproduct(product._id)}>
                                <LuTrash2 />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title={product.approved ? "Disapprove" : "Approve"}>
                              <IconButton
                                onClick={() => toggleApprove(product._id)}
                                style={{
                                  backgroundColor: product.approved ? "#dc2626" : "#16a34a",
                                  color: "white",
                                  fontSize: "12px",
                                }}
                              >
                                {product.approved ? "⛔" : "✔"}
                              </IconButton>
                            </Tooltip>
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
    </div>
  );
}

export default ProductList;
