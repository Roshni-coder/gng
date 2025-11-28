import axios from 'axios';
import React, { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AppContext = createContext();
axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const backendurl = import.meta.env.VITE_BACKEND_URL || "http://localhost:7000";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserdata] = useState(false);
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const token = localStorage.getItem('token') || null;

  // Helper: Axios headers
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch detailed profile info
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendurl}/api/user/profile`, {
        headers: authHeader,
      });
      if (data.success && data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch basic user data
  const getuserData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendurl}/api/user/data`, {
        headers: authHeader,
      });
      if (data.success) {
        setUserdata(data.userData);
        fetchProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Check if user is authenticated
  const getAuthstate = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendurl}/api/auth/is-auth`, {
        headers: authHeader,
      });
      if (data.success) {
        setIsLoggedin(true);
        getuserData();
        fetchCart();
        fetchWishlist();
      }
    } catch (error) {
      console.error("Auth state check failed:", error);
    }
  };

  // Fetch Cart
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendurl}/api/auth/cart`, {
        headers: authHeader,
      });
      setCartItems(res.data.cart || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Clear cart after order
  const clearCartAfterOrder = async () => {
    if (!token) return;
    setCartItems([]);
    try {
      await axios.delete(`${backendurl}/api/auth/clear-cart`, {
        headers: authHeader,
      });
      await fetchCart();
    } catch (err) {
      console.error("Error clearing backend cart:", err);
    }
  };

  // Fetch Wishlist
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendurl}/api/auth/wishlist`, {
        headers: authHeader,
      });
      setWishlistItems(res.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/logout`, {}, {
        headers: authHeader,
      });
      if (data.success) {
        localStorage.removeItem("token");
        setIsLoggedin(false);
        setUserdata(false);
        setProfile({ name: '', phone: '', email: '' });
        setCartItems([]);
        setWishlistItems([]);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthstate();
  }, []);

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserdata,
    profile,
    setProfile,
    fetchProfile,
    logout,
    cartItems,
    setCartItems,
    wishlistItems,
    setWishlistItems,
    fetchCart,
    fetchWishlist,
    clearCartAfterOrder
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
