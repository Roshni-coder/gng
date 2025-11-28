import React, { useState, useEffect } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { Button } from "@mui/material";
import axios from "axios";

function AddCategory({ onClose }) {
  const stoken = localStorage.getItem("stoken") || "null";
  const [approved, setApproved] = useState(false);

  const [category, setCategory] = useState({
    categoryname: "",
    image: null,
  });
  const [preview, setPreview] = useState("");

  const handleCategoryChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory({ ...category, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();

    if (!category.categoryname.trim() || !category.image) {
      alert("Please enter category name and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryname", category.categoryname.trim());
    formData.append("image", category.image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/addcategory`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message || "Category added successfully!");
      setCategory({ categoryname: "", image: null });
      setPreview("");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.response?.data?.message || "Failed to add category");
    }
  };

  const fetchSeller = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/sellerdetails`,
      { headers: { stoken } }
    );
    if (res.data.success) {
      setApproved(res.data.seller[0].approved);
    }
  };

  useEffect(() => {
    fetchSeller();
  }, []);

  if (!approved) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-300 text-red-700 text-center px-10 py-16 rounded-lg shadow-md max-w-xl w-full">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>You are not approved to add categories.</p>
          <p>Please contact the administrator for approval.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex justify-center items-center  px-4">
      <div className="bg-white !mt-20 rounded-xl w-full max-w-lg p-8 !pb-10">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Category</h2>
        <form onSubmit={addCategory} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <input
              type="text"
              name="categoryname"
              value={category.categoryname}
              onChange={handleCategoryChange}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-[15px]"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="!mt-4 !w-30 h-30 object-cover rounded-md border"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="!bg-blue-600 hover:!bg-blue-700 text-white flex items-center justify-center gap-2 !py-3"
              startIcon={<MdOutlineCloudUpload />}
            >
              Upload Category
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddCategory;
