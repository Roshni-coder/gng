import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={
          index < Math.round(rating)
            ? "text-amber-400"
            : "text-gray-200"
        }
      />
    ))}
  </div>
);

function ProductReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return <p className="p-6 text-center text-gray-500">No reviews yet for this product.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {reviews.map((review) => (
        <li key={review._id || `${review.userName}-${review.createdAt}`}
          className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{review.userName || "Anonymous"}</p>
            <p className="text-xs text-gray-400">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
            </p>
            <p className="mt-2 text-sm text-gray-600">{review.comment || "No comment provided."}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-bold text-gray-900">{Number(review.rating || 0).toFixed(1)}</span>
            <StarRating rating={review.rating || 0} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ProductReviewList;
