import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResultsPage = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(10000);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search)
    .get("query")
    ?.toLowerCase()
    .trim();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/search`
        );
        const products = res.data.data;

        const filtered = products.filter((product) => {
          const title = product.title?.toLowerCase() || "";
          const category = product.categoryname?.name?.toLowerCase() || "";
          const subcategory = product.subcategory?.name?.toLowerCase() || "";

          return (
            title.includes(searchQuery) ||
            category.includes(searchQuery) ||
            subcategory.includes(searchQuery)
          );
        });

        setOriginalProducts(filtered);
        setFilteredProducts(filtered);

        const prices = filtered.map((p) => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(min);
        setMaxPrice(max);
        setSelectedMaxPrice(max);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchProducts();
    } else {
      setLoading(false);
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  const handleApplyFilters = () => {
    const filtered = originalProducts.filter((product) => {
      const withinPrice =
        product.price >= minPrice && product.price <= selectedMaxPrice;
      const meetsDiscount =
        selectedDiscount === null ||
        (product.discount || 0) >= selectedDiscount;
      return withinPrice && meetsDiscount;
    });

    setFilteredProducts(filtered);
    setShowMobileFilters(false); // Close filter drawer on apply
  };

  const discountOptions = [10, 20, 30, 40, 50];

  return (
    <div className="p-6">
      <div className="mb-2">
        <h2 className="text-2xl px-2 font-bold text-gray-800">
          Search Results for "{searchQuery || ""}"
        </h2>
      </div>

      {/* Responsive Filters Button in next line */}
      <div className="block lg:hidden px-4 py-2">
  <button
    className="text-white px-4 py-2 rounded w-full"
    style={{ backgroundColor: '#7d0492' }}
    onClick={() => setShowMobileFilters(!showMobileFilters)}
  >
    {showMobileFilters ? "Close Filters" : "Filters"}
  </button>
</div>


      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Panel - responsive */}
        <div
          className={`${
            showMobileFilters ? "block" : "hidden"
          } md:block w-full md:w-1/4 p-4 bg-white h-auto md:h-[80vh] rounded shadow`}
        >
          <h3 className="font-bold text-lg mb-4">Filters</h3>

          <label className="block text-sm text-gray-600 mb-3">
            Price: ₹{minPrice} – ₹{selectedMaxPrice}
          </label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={selectedMaxPrice}
            onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
            className="w-full accent-[#7d0492] mb-4"
          />

          <h4 className="font-semibold text-sm mb-4">Discount</h4>
          {discountOptions.map((discount) => (
            <div key={discount} className="mb-1">
              <label className="text-sm text-gray-700">
                <input
                  type="radio"
                  name="discount"
                  value={discount}
                  checked={selectedDiscount === discount}
                  onChange={() => setSelectedDiscount(discount)}
                  className="mr-2"
                />
                {discount}% or more
              </label>
            </div>
          ))}

          <div className="mt-2">
            <label className="text-sm text-gray-700">
              <input
                type="radio"
                name="discount"
                value=""
                checked={selectedDiscount === null}
                onChange={() => setSelectedDiscount(null)}
                className="mr-2"
              />
              All Discounts
            </label>
          </div>

          <button
            onClick={handleApplyFilters}
            className="mt-5 w-full bg-[#7d0492] text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Apply Filter
          </button>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4 bg-white rounded shadow-md">
  {loading ? (
    <p className="text-gray-500">Loading products...</p>
  ) : filteredProducts.length > 0 ? (
    <div className="flex flex-wrap justify-center gap-4 p-2 sm:p-4">
      {filteredProducts.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded overflow-hidden shadow hover:shadow-lg transition w-[47%] sm:w-[45%] md:w-[30%] lg:w-[28%] xl:w-[23%] cursor-pointer"
          onClick={() => navigate(`/products/${product._id}`)}
        >
                    <div className="w-full h-[280px] sm:h-[280px] md:h-[280px] lg:h-[280px] overflow-hidden">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.title}
              // className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              className="w-full h-full object-contain sm:object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-center p-2">
            <h3 className="text-gray-700 text-[13px] sm:text-[15px] md:text-[16px] font-semibold mb-1">
              {product.title}
            </h3>
            <div className="flex justify-center items-center gap-2 text-center">
              <p className="text-gray-900 font-semibold text-sm sm:text-base">
                ₹{product.price}
              </p>
              {product.discount > 0 && (
                <p className="text-green-800 text-[13px] sm:text-[14px]">
                  {product.discount}% off
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-600 mt-4">
      No products found matching "<strong>{searchQuery}</strong>"
    </p>
  )}
</div>

      </div>
    </div>
  );
};

export default SearchResultsPage;
