import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axios from "axios";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import SearchBox from "../../Components/SearchBox/SearchBox.jsx";
function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSellerIndex, setOpenSellerIndex] = useState(null);
  const [sellerProducts, setSellerProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
const [filteredSellers, setFilteredSellers] = useState([]);

  

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/sellers`
      );
      if (data.success) {
        setSellers(data.sellers);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async (sellerId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/seller-products/${sellerId}`
      );
      if (data.success) {
        setSellerProducts((prev) => ({
          ...prev,
          [sellerId]: data.products,
        }));
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };

  const toggleSellerRow = (index, sellerId) => {
    const newIndex = openSellerIndex === index ? null : index;
    setOpenSellerIndex(newIndex);
    if (newIndex !== null && !sellerProducts[sellerId]) {
      fetchSellerProducts(sellerId);
    }
  };

  const handleToggleApproveSeller = async (sellerId) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/toggle-approve/${sellerId}`
      );
      if (data.success) {
        setSellers((prev) =>
          prev.map((s) => (s._id === sellerId ? data.seller : s))
        );
      }
    } catch (error) {
      console.error("Error toggling seller approval:", error);
    }
  };

  const toggleApproveProduct = async (productId, sellerId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/toggle-product/${productId}`
      );
      if (res.data.success) {
        fetchSellerProducts(sellerId); // refresh product list
      }
    } catch (error) {
      console.error("Error toggling product approval:", error);
      alert("Failed to toggle product approval");
    }
  };
useEffect(() => {
  if (!searchTerm) {
    setFilteredSellers(sellers);
  } else {
    const lower = searchTerm.toLowerCase();
    const filtered = sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(lower) ||
        seller.nickName.toLowerCase().includes(lower) ||
        seller.email.toLowerCase().includes(lower)
    );
    setFilteredSellers(filtered);
  }
}, [searchTerm, sellers]);


  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="orders my-3 shadow-md rounded-md py-4 px-4 bg-white max-w-full">
        <h2 className="text-xl md:text-2xl font-semibold py-2 sm:text-left text-center">All Sellers</h2>
        <div className="py-2">
             <div className="w-full ">
               <SearchBox
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search Sellers..."
/>

             </div>
           </div>
      

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <div className="relative mt-5 overflow-x-auto scrollbar-thin max-w-full">
          <table className="w-full min-w-[900px] text-sm text-gray-500 border-collapse">
            <thead className="text-xs uppercase text-[12px] bg-gray-100 text-black">
              <tr>
                <th className="px-3 py-3 w-[30px]"></th>
                <th className="px-4 py-3">Seller Name</th>
                <th className="px-4 py-3">Seller Brand Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller, index) => (
                <React.Fragment key={seller._id}>
                  <tr className="bg-white text-[13px] border-b text-center">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleSellerRow(index, seller._id)}
                        className="py-2 px-3 rounded-full hover:bg-gray-100"
                      >
                        {openSellerIndex === index ? (
                          <FaAngleUp className="text-[16px]" />
                        ) : (
                          <FaAngleDown className="text-[16px]" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">{seller.name}</td>
                    <td className="px-4 py-3">{seller.nickName}</td>
                    <td className="px-4 py-3">{seller.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          seller.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {seller.approved ? "Approved" : "Not Approved"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="small"
                        variant="contained"
                        color={seller.approved ? "error" : "primary"}
                        onClick={() => handleToggleApproveSeller(seller._id)}
                      >
                        {seller.approved ? "Disapprove" : "Approve"}
                      </Button>
                    </td>
                  </tr>

                  {openSellerIndex === index && (
                    <tr>
                      <td colSpan="5" className="py-2 px-3 bg-gray-50">
                      <div className="w-full flex justify-center">
                        <div className="w-full pl-6 md:pl-12 md:w-[90%]  overflow-x-auto mx-auto mb-3 rounded-md border border-gray-200">
                          <table className="w-full min-w-[700px] text-sm text-gray-600 shadow-md border-collapse">
                            <thead className="bg-gray-100 text-[12px] uppercase text-black">
                              <tr>
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sellerProducts[seller._id]?.length > 0 ? (
                                sellerProducts[seller._id].map((product) => (
                                  <tr key={product._id} className="bg-white border-b text-center">
                                    <td className="px-4 py-3">
                                      <img
                                        src={product.images[0]?.url}
                                        alt="Product"
                                        className="w-12 h-12 object-cover mx-auto rounded-md"
                                      />
                                    </td>
                                    <td className="px-4 py-3">{product.title}</td>
                                    <td className="px-4 py-3">₹{product.price}</td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs ${
                                          product.approved
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                      >
                                        {product.approved ? "Approved" : "Not Approved"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <Tooltip title={product.approved ? "Disapprove" : "Approve"}>
                                        <IconButton
                                          onClick={() =>
                                            toggleApproveProduct(product._id, seller._id)
                                          }
                                          style={{
                                            backgroundColor: product.approved ? "#dc2626" : "#16a34a",
                                            color: "white",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {product.approved ? "⛔" : "✔"}
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center py-3 text-gray-400">
                                    No products found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!sellers.length && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SellersList;
