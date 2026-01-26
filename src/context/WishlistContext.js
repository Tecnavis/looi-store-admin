

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from "../config/axiosconfig";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Function to fetch the wishlist data
  const fetchWishlistData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/get-wishlist');
        setWishlistItems(response.data.wishlist.products);
        setWishlistCount(response.data.wishlist.products.length);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };

  // Function to update the count when adding to wishlist
  const addToWishlist = () => {
    setWishlistCount(prevCount => prevCount + 1);
  };

  // Function to update the count when removing from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axiosInstance.delete(`/delete-wishlist/${productId}`);
        setWishlistCount(prevCount => prevCount - 1);
        setWishlistItems(prevItems => prevItems.filter(item => item.productId._id !== productId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  return (
    <WishlistContext.Provider value={{ 
      wishlistCount, 
      wishlistItems,
      addToWishlist, 
      removeFromWishlist,
      fetchWishlistData
    }}>
      {children}
    </WishlistContext.Provider>
  );
};



