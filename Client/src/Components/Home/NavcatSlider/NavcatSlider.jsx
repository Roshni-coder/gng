import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import axios from "axios";

const NavCatSlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getcategories`
      );

      const categoryArray = Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];

      setCategories(categoryArray);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Helper function to construct image URL safely
  const getCategoryImageUrl = (images) => {
    // 1. Safety check: Ensure images array exists and has content
    if (!images || images.length === 0 || !images[0].url) {
      return "/fallback-category.png"; // Use a placeholder if missing
    }

    const imagePath = images[0].url;

    // 2. If it is a Cloudinary URL (http/https), return it directly
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    // 3. Fallback for old local images: Append backend URL
    const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
    const cleanPath = imagePath.replace(/^\/+/, ""); // Remove leading slash
    return `${base}/${cleanPath}`;
  };

  return (
    <div className="NavcatSlider bg-gray-100">
      <div className="container py-6 md:py-10 m-auto px-1">
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          modules={[Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            350: { slidesPerView: 5 },
            550: { slidesPerView: 6 },
            768: { slidesPerView: 7 },
            900: { slidesPerView: 8 },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <Link
                to="/productlist"
                state={{ category: category.categoryname }}
              >
                <div className="text-center mt-2 cursor-pointer">
                  <img
                    // Pass the entire images array to the helper
                    src={getCategoryImageUrl(category.images)}
                    alt={category.categoryname}
                    // Added w-16 h-16 for mobile default size to prevent invisible images
                    className="mx-auto sm:w-20 sm:h-20 w-16 h-16 rounded-full shadow-lg object-cover transition-transform hover:scale-105"
                  />
                  <h3 className="mt-2 hidden sm:block text-sm font-semibold text-gray-800">
                    {category.categoryname}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NavCatSlider;