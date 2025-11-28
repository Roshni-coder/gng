import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { normalizeProductRecord } from "../utils/productStatus.js";

export const useSellerProducts = () => {
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stoken = localStorage.getItem("stoken");

  const fetchProducts = useCallback(async () => {
    if (!stoken) {
      setRawProducts([]);
      setError("Please sign in to view products.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts`,
        { headers: { stoken } }
      );

      if (Array.isArray(data?.data)) {
        setRawProducts(data.data);
        setError(null);
      } else {
        setRawProducts([]);
        setError("Unable to load products.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error fetching products.");
      setRawProducts([]);
    } finally {
      setLoading(false);
    }
  }, [stoken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const products = useMemo(() => rawProducts.map(normalizeProductRecord), [rawProducts]);

  return {
    products,
    rawProducts,
    loading,
    error,
    refresh: fetchProducts,
  };
};
