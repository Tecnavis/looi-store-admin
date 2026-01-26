import React, { useEffect, useState, Fragment } from "react";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import axiosInstance from '../../config/axiosconfig';
import { Loader } from 'lucide-react';


const ProductTabLeft = () => {
  let { productId } = useParams(); // Get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); 
  useEffect(() => {
   localStorage.setItem("lastVisitedPage", location.pathname);
 }, [location.pathname]);

  // Fetch product by id from API or static data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/get-productid/${productId}`); // Fetch product by id
        setProduct(response.data.product); // Adjust based on your actual response structure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
 
  if (loading) {
    return (

     <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader size={38} className="animate-spin text-center" />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
          galleryType="leftThumb"
        />

      
      </LayoutOne>
    
    </Fragment>
  );
};

export default ProductTabLeft;

