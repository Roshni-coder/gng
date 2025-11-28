import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { MdOutlineCloudUpload } from "react-icons/md";
import axios from "axios";

function AddSubCategory({ onSubCategoryAdded, className = "" }) {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const stoken = localStorage.getItem("stoken") || "null";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/getcategories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryName.trim() || !selectedCategory) {
      alert("Please enter a subcategory name and select a category.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/addsubcategory`,
        {
          subcategory: subCategoryName.trim(),
          categoryId: selectedCategory,
        }
      );

      alert(response.data.message || "Subcategory added!");
      onSubCategoryAdded?.(response.data);

      setSubCategoryName("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to add subcategory");
    } finally {
      setLoading(false);
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
      <div className="min-h-[50vh] flex items-center justify-center text-center text-xl font-semibold text-red-600">
        You are not approved to add sub-categories. Please contact the administrator.
      </div>
    );
  }

  return (
    <section className={`flex justify-center p-6 ${className}`}>
      <div className="w-full max-w-xl bg-white rounded-2xl  p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Subcategory</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Subcategory Name</label>
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subcategory name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryname}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="!mt-6  !bg-blue-600 hover:!bg-blue-700 text-white font-semibold !py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <MdOutlineCloudUpload className="text-[22px]" />
            {loading ? "Uploading..." : "Upload Subcategory"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddSubCategory;
