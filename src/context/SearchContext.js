import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../config/axiosconfig';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get(`/newarrival-product`);
      const products = response.data.products;
      
      // Client-side filtering
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.subcategoryname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, isSearching, searchProducts }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};