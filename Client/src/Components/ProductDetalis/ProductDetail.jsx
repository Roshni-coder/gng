import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LeftComponent from "./ProductLeft/LeftComponent";
import RightComponent from "./ProductRight/RightComponent";
import axios from "axios";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

function ProductDetail() {
  const { id: productId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(3);
  const [userName, setUserName] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  useEffect(() => {
    if (productId) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
        .then((res) => setProduct(res.data))
        .catch((err) => console.error("Error fetching product details", err));

      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/reviews/${productId}`
        )
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Error loading reviews:", err));

      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/related/${productId}`
        )
        .then((res) => setRelatedProducts(res.data.data))
        .catch((err) => console.error("Error loading related products", err));
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !newRating || !productId) {
      console.error("Missing required fields");
      return;
    }

    const reviewData = {
      productId,
      userName,
      rating: newRating,
      comment: newComment,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/review`,
        reviewData
      );
      setNewComment("");
      setNewRating(3);
      setUserName("");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/reviews/${productId}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="bg-white  shadow-md">
      <div className="container mt-[80px] py-4 lg:pl-3 lg:flex gap-1">
        <div className="leftContainer mb-4 lg:w-[40%] w-full">
          <LeftComponent product={product} />
        </div>
        <div className="rightContainer w-full my-4 lg:w-[60%]">
          <RightComponent product={product} />
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-8 pl-3">
        <div className="flex items-center gap-4 mb-5">
          {["Description", "Product Details", "Reviews"].map((tab, idx) => (
            <span
              key={tab}
              className={`flex link sm:text-[18px] text-[16px] cursor-pointer font-medium ${
                activeTab === idx && "text-[#7d0492]"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <div className="shadow-lg border border-gray-200 p-5 rounded-md">
            <p className="text-sm font-semibold">{product.description}</p>
            <ul className="list-disc ml-5 text-sm p-2">
              {product.careInstructions?.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 1 && (
          <div className="shadow-lg border border-gray-200 p-5 rounded-md">
            <p className="text-sm font-semibold">{product.description}</p>
            <ul className="list-disc ml-5 text-sm p-2">
              {product.careInstructions?.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 2 && (
          <div className="shadow-lg border border-gray-200 p-5 rounded-md">
            <div className="productReview">
              <h2 className="text-black text-[18px] mb-2">Customer Reviews</h2>
              <div className="border-b border-gray-200 max-h-[300px] overflow-y-scroll pr-2">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="mb-4 flex items-start gap-3">
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: "#7d0492",
                          color: "white",
                          fontSize: 15,
                        }}
                      >
                        {review.userName?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <div className="w-full">
                        <h4 className="text-black text-sm font-medium">
                          {review.userName || "Anonymous"}
                        </h4>
                        <h5 className="text-black text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </h5>
                        <p className="text-gray-700 text-sm">
                          {review.comment}
                        </p>
                        <Rating size="small" value={review.rating} readOnly />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                )}
              </div>

              <div className="reviewForm mt-6 p-5 rounded-md bg-[#fafafa]">
                <h2 className="text-[18px] mb-3">Add Review</h2>
                <form onSubmit={handleSubmit}>
                  <TextField
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    label="Your Name"
                    className="w-full !mb-3"
                    required
                  />
                  <TextField
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    label="Write a Review..."
                    className="w-full !mb-3"
                    multiline
                    rows={3}
                  />
                  <Rating
                    value={newRating}
                    onChange={(e, value) => setNewRating(value)}
                  />
                  <div className="flex items-center mt-2">
                    <button type="submit" className="btn-org">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
  <section className="pt-4 my-2 lg:pt-6">
    <div className="container mx-auto px-4 md:px-6 mb-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex items-center justify-between mb-4 px-2 py-4 border-b border-gray-200">
        <h3 className="text-[14px] sm:text-2xl font-semibold text-gray-800 capitalize">
          Related Products
        </h3>
      </div>

      <Swiper
        spaceBetween={20}
        modules={[Navigation]}
        navigation={{
          nextEl: `.next-related`,
          prevEl: `.prev-related`,
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="mySwiper"
      >
        {relatedProducts.map((item) => (
          <SwiperSlide key={item._id}>
            <Link to={`/products/${item._id}`}>
              <div className="bg-white mb-4 rounded overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="w-full h-[280px] overflow-hidden">
                  <img
                    src={
                      item.images?.[0]?.url ||
                      (typeof item.images?.[0] === "string"
                        ? `${import.meta.env.VITE_BACKEND_URL}/${item.images[0]}`
                        : "/placeholder.png")
                    }
                    alt={item.title}
                    className="w-full h-full object-contain sm:object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-gray-700 text-sm sm:text-base truncate">
                    {item.title}
                  </h3>
                  <h2 className="text-gray-900 text-sm sm:text-lg font-semibold mt-1">
                    ₹{item.price}
                  </h2>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <div className="prev-related absolute top-1/2 -left-2 z-10 -translate-y-1/2 bg-gray-500/80 text-white w-6 h-10 flex items-center justify-center rounded cursor-pointer shadow">
        <HiChevronLeft size={20} />
      </div>
      <div className="next-related absolute top-1/2 -right-2 z-10 -translate-y-1/2 bg-gray-500/80 text-white w-6 h-10 flex items-center justify-center rounded cursor-pointer shadow">
        <HiChevronRight size={20} />
      </div>
    </div>
  </section>
)}

    </div>
  );
}

export default ProductDetail;
