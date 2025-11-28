import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LeftFilter from './LeftFilter';

function ProductList() {
  const location = useLocation();
  const { category } = location.state || {};

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState(category || 'Birthday Wish List');

  useEffect(() => {
    document.title = `${activeCategoryName} - GiftNgift`;
  }, [activeCategoryName]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/productsbycategory`
        );
        if (data.success && Array.isArray(data.categories)) {
          const categoryData = data.categories.find(cat => cat.category === category);
          if (categoryData && Array.isArray(categoryData.products)) {
            const approvedProducts = categoryData.products.filter(p => p.approved === true);
            console.log("Approved Products:", approvedProducts);
            setProducts(approvedProducts);
          } else {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category]);

  const applyFilters = async (appliedFilters) => {
    setFilters(appliedFilters);

    try {
      // First: resolve the category name based on ID
      const categoryResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getcategories`
      );
      const allCategories = categoryResponse.data;

      if (appliedFilters.selectedCategories.length > 0) {
        const selectedCatId = appliedFilters.selectedCategories[0]; // assuming single select
        const selectedCat = allCategories.find(cat => cat._id === selectedCatId);
        if (selectedCat) {
          setActiveCategoryName(selectedCat.categoryname); // ✅ update title
        }
      }

      // Then: fetch filtered products
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/filter`,
        {
          params: {
            categoryname: appliedFilters.selectedCategories.join(","),
            minPrice: appliedFilters.priceRange[0],
            maxPrice: appliedFilters.priceRange[1],
            discount: appliedFilters.selectedDiscount || "",
            sort: appliedFilters.sort
          }
        }
      );

      setProducts(response.data.data);
    } catch (error) {
      console.log("Error applying filters:", error);
    }
  };

  return (
    <div className="w-full px-2">
      <h1 className="text-center text-lg sm:text-xl font-semibold text-gray-800 my-4">
        {activeCategoryName} Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Filter */}
        <div className="w-full lg:w-1/4 bg-white rounded shadow-md">
          <LeftFilter onApplyFilters={applyFilters} />
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4 bg-white rounded shadow-md">
          <div className="flex flex-wrap justify-center gap-4 p-2 sm:p-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded overflow-hidden shadow hover:shadow-lg transition w-[47%] sm:w-[45%] md:w-[30%] lg:w-[28%] xl:w-[23%]"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="w-full h-auto sm:h-[260px] md:h-[280px] lg:h-[280px] overflow-hidden">
                      <img
                        src={product?.images?.[0]?.url || "/default-image.jpg"}
                        alt={product?.images?.[0]?.altText || product?.title}
                        className="w-full h-full max-h-[300px] object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="text-center p-2">
                    <h3 className="text-gray-700 text-[13px] sm:text-[15px] md:text-[16px] font-semibold mb-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-900 text-sm sm:text-base font-semibold">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No products found for this criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
