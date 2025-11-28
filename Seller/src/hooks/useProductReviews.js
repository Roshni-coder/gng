import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const buildRatingBreakdown = (reviews = []) => {
  const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const rating = Math.round(Number(review.rating) || 0);
    if (rating >= 1 && rating <= 5) {
      buckets[rating] += 1;
    }
  });
  return buckets;
};

export const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/reviews/${productId}`
      );
      setReviews(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Unable to fetch reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const ratingBreakdown = useMemo(() => buildRatingBreakdown(reviews), [reviews]);

  return {
    reviews,
    loading,
    error,
    averageRating,
    ratingBreakdown,
    refresh: fetchReviews,
  };
};
