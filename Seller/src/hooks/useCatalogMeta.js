import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export const useCatalogMeta = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMeta = async () => {
      try {
        setLoading(true);
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getcategories`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getsubcategories`),
        ]);

        if (!isMounted) return;
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setSubcategories(Array.isArray(subcategoriesRes.data) ? subcategoriesRes.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching catalog metadata:", err);
        if (!isMounted) return;
        setError("Unable to load category information.");
        setCategories([]);
        setSubcategories([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryNameById = useCallback(
    (id) => categories.find((cat) => cat._id === id)?.categoryname || "-",
    [categories]
  );
  const getSubCategoryNameById = useCallback(
    (id) => subcategories.find((sub) => sub._id === id)?.subcategory || "-",
    [subcategories]
  );

  return {
    categories,
    subcategories,
    loading,
    error,
    getCategoryNameById,
    getSubCategoryNameById,
  };
};
