import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { computeOrderStats } from "../utils/orderMetrics";

export const useSellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stoken = localStorage.getItem("stoken");

  const fetchOrders = useCallback(async () => {
    if (!stoken) {
      setOrders([]);
      setError("Please sign in to view orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/orders`,
        { headers: { stoken } }
      );

      if (data.success) {
        setOrders(data.filteredOrders || []);
        setError(null);
      } else {
        setOrders([]);
        setError(data.message || "Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  }, [stoken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const stats = useMemo(() => computeOrderStats(orders), [orders]);

  return {
    orders,
    setOrders,
    loading,
    error,
    stats,
    refresh: fetchOrders,
  };
};
