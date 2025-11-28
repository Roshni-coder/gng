import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import axios from 'axios';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"; // arrow icons

const ViewBtn = styled(Button)`
  color: white;
  background: #7d0492;
  text-transform: none;
  padding: 7px 30px;
  border-radius: 4px;
  box-shadow: none;
  font-weight: 600;
  height: 35px;
  &:hover {
    background: #5c0170;
  }
`;

const ProductSlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/client/productsbycategory`;
      const { data } = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (data?.success && Array.isArray(data.categories)) {
        const filteredCategories = data.categories
          .map((cat) => ({
            category: cat.category,
            products: cat.products.filter((p) => p.approved),
          }))
          .filter((cat) => cat.products.length > 0);

        setCategories(filteredCategories);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching products by category:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-lg font-medium text-gray-600">Loading products...</div>;
  }

  if (!categories.length) {
    return <div className="text-center py-10 text-lg font-medium text-gray-600">No products found.</div>;
  }

  return (
    <section className="pt-4 my-2 lg:pt-6">
      {categories.map((cat, idx) => (
        <div key={idx} className="container mx-auto px-4 md:px-6 !mb-6 bg-white rounded-lg shadow-lg relative">
          <div className="flex items-center justify-between mb-4 px-6 py-4 border-b border-gray-200">
            <h3 className="text-[14px] sm:text-2xl font-semibold text-gray-800 capitalize">
              {cat.category || 'Untitled Category'}
            </h3>
            <Link to="/productlist" state={{ category: cat.category }}>
              <ViewBtn>View</ViewBtn>
            </Link>
          </div>

          {/* Swiper with Navigation */}
          <Swiper
  spaceBetween={20}
  breakpoints={{
    320: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1280: { slidesPerView: 4 },
  }}
  className="mySwiper"
>
  {cat.products.map((product) => (
    <SwiperSlide key={product._id}>
      <Link to={`/products/${product._id}`}>
        <div className="bg-white !mb-4 rounded overflow-hidden shadow-md hover:shadow-lg transition duration-300">
          <div className="w-full h-[280px] overflow-hidden">
            <img
              src={product?.images?.[0]?.url || '/default-image.jpg'}
              alt={product?.images?.[0]?.altText || product?.title}
              className="w-full h-full object-contain sm:object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 text-center">
            <h3 className="text-gray-700 text-sm sm:text-base truncate">{product.title}</h3>
            <h2 className="text-gray-900 text-sm sm:text-lg font-semibold mt-1">
              ₹{product.price || "N/A"}
            </h2>
          </div>
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>


          {/* Navigation Arrows */}
          <div className={`prev-${idx} absolute top-1/2 -left-1 mx-2 z-10 -translate-y-1/2 bg-gray-500/50 text-white w-4 h-12 flex items-center justify-center rounded cursor-pointer shadow`}>
            <HiChevronLeft size={20} />
          </div>
          <div className={`next-${idx} absolute top-1/2 -right-1 mx-2 z-10 -translate-y-1/2 bg-gray-500/80 text-white w-4 h-12 flex items-center justify-center rounded cursor-pointer shadow`}>
            <HiChevronRight size={20} />
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductSlider;
