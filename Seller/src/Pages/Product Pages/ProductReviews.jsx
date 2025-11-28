import React, { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { useSellerProducts } from "../../hooks/useSellerProducts.js";
import { useProductReviews } from "../../hooks/useProductReviews.js";
import ProductReviewList from "../../Components/Products/ProductReviewList.jsx";

const ratingLabels = {
  5: "Excellent",
  4: "Great",
  3: "Average",
  2: "Fair",
  1: "Poor",
};

function ProductReviews() {
  const { products, loading: productsLoading, error: productsError } =
    useSellerProducts();

  const [activeProductId, setActiveProductId] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    if (!activeProductId && products.length) {
      setActiveProductId(products[0]._id);
    }
  }, [activeProductId, products]);

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    averageRating,
    ratingBreakdown,
    refresh,
  } = useProductReviews(activeProductId);

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "all") return reviews;
    return reviews.filter((r) => Number(r.rating) === Number(ratingFilter));
  }, [reviews, ratingFilter]);

  const totalReviews = reviews.length;
  const positiveRatio = totalReviews
    ? Math.round(
        (reviews.filter((r) => Number(r.rating) >= 4).length /
          totalReviews) *
          100
      )
    : 0;

  return (
    <div className="space-y-10 p-3 md:p-5 bg-white animate-fadeIn">

      {/* PAGE HEADER */}
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-400">Analytics</p>
        <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
        <p className="text-sm text-gray-500">
          Understand customer experience & track product feedback.
        </p>
      </header>

      {/* PRODUCT + FILTER BAR */}
      <div
        className="
          flex flex-col md:flex-row md:items-end gap-5 
          bg-white border border-gray-200 rounded-2xl shadow-sm 
          p-5 md:p-6
        "
      >
        {/* PRODUCT SELECT */}
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Select Product
          </label>

          <select
            value={activeProductId}
            onChange={(e) => setActiveProductId(e.target.value)}
            className="
              mt-2 w-full rounded-xl border border-gray-300 
              bg-gray-50 px-3 py-2.5 text-sm
              shadow-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-300
            "
          >
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* RATING FILTER + REFRESH */}
        <div className="flex items-center gap-3">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="
              rounded-xl px-4 py-2.5 text-sm border border-gray-300 
              bg-white shadow-sm focus:ring-2 focus:ring-gray-300
            "
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s} Stars
              </option>
            ))}
          </select>

          <button
            onClick={refresh}
            className="
              inline-flex items-center gap-2 
              px-4 py-2.5 text-sm font-medium 
              rounded-xl border border-gray-300 
              bg-gray-50 hover:bg-gray-100 transition 
              shadow-sm text-gray-700
            "
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* AVG RATING */}
        <div
          className="
            p-6 text-center rounded-2xl shadow-sm border border-amber-100
            bg-gradient-to-br from-amber-50/60 to-white
          "
        >
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Average Rating
          </p>

          <p className="text-5xl font-bold text-gray-900 mt-3">
            {averageRating.toFixed(1)}
          </p>

          <div className="mt-2 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  i < Math.round(averageRating)
                    ? "text-amber-400"
                    : "text-gray-300"
                } text-lg`}
              />
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-500">{totalReviews} reviews</p>
        </div>

        {/* RATING BREAKDOWN */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Rating Breakdown
          </p>

          <ul className="mt-4 space-y-3">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = ratingBreakdown?.[score] || 0;
              const percent = totalReviews
                ? Math.round((count / totalReviews) * 100)
                : 0;

              return (
                <li
                  key={score}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <span className="w-8 font-semibold">{score}★</span>

                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-amber-400 rounded-full`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <span className="w-12 text-right text-xs text-gray-500">
                    {percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* POSITIVE FEEDBACK */}
        <div
          className="
            p-6 rounded-2xl shadow-sm border border-purple-200
            bg-gradient-to-br from-purple-50/60 to-white
          "
        >
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Positive Feedback
          </p>

          <p className="mt-4 text-4xl font-bold text-gray-900">
            {positiveRatio}%
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Buyers say it's{" "}
            <span className="font-semibold">
              {ratingLabels[Math.round(averageRating)] || "Good"}
            </span>
          </p>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <section
        className="
          rounded-3xl border border-gray-200 bg-white 
          shadow-sm mt-4 overflow-hidden
        "
      >
        {productsLoading || reviewsLoading ? (
          <p className="p-8 text-center text-gray-500">Loading reviews…</p>
        ) : productsError || reviewsError ? (
          <p className="p-8 text-center text-red-600">
            {productsError || reviewsError}
          </p>
        ) : (
          <ProductReviewList reviews={filteredReviews} />
        )}
      </section>
    </div>
  );
}

export default ProductReviews;
