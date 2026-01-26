import React, { useEffect, useMemo, useState } from "react";
import { Carousel, Col, Row } from "react-bootstrap";
import axiosInstance from "../../config/axiosconfig";
import "./styles/beststyle.css";
import { useNavigate } from "react-router-dom";

const BestSellers = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const navigate = useNavigate();

  // ✅ Normalize API response to always array
  const normalizeList = (data, keys = []) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      for (const k of keys) {
        if (Array.isArray(data[k])) return data[k];
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          axiosInstance.get("/get-category"),
          axiosInstance.get("/get-subcategory"),
        ]);

        const catList = normalizeList(categoriesResponse.data, ["categories", "data"]);
        const subList = normalizeList(subcategoriesResponse.data, ["subcategories", "subCategories", "data"]);

        setCategoriesData(catList);
        setSubcategoriesData(subList);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategoriesData([]);
        setSubcategoriesData([]);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    const relatedSubcategories = (Array.isArray(subcategoriesData) ? subcategoriesData : []).filter(
      (subcategory) => {
        const cat = subcategory?.category;

        // populated object
        if (cat && typeof cat === "object" && cat._id) return cat._id === categoryId;

        // string id
        if (typeof cat === "string") return cat === categoryId;

        return false;
      }
    );

    if (relatedSubcategories.length > 0) {
      navigate(`/shop-grid-full-width/${relatedSubcategories[0]._id}`);
    } else {
      console.log("No subcategories found for this category");
    }
  };

  // ✅ Always safe length
  const totalSlides = useMemo(() => {
    const length = Array.isArray(categoriesData) ? categoriesData.length : 0;
    return Math.ceil(length / 3);
  }, [categoriesData]);

  // ✅ Image resolver (Cloudinary or local fallback)
  const getCategoryImage = (category) => {
    // if images stored as array of URLs (cloudinary)
    const first = category?.images?.[0];

    if (!first) return "/assets/img/product/product-1.jpg"; // fallback

    // if already URL
    if (typeof first === "string" && (first.startsWith("http://") || first.startsWith("https://"))) {
      return first;
    }

    // if local filename (old system)
    return `/uploads/${first}`;
  };

  return (
    <div className="carousel-container">
      <h3 className="text-center my-5">
        <b>BEST SELLERS</b>
      </h3>

      <Carousel interval={3000} className="full-screen-carousel">
        {Array.from({ length: totalSlides }).map((_, carouselIndex) => (
          <Carousel.Item key={carouselIndex}>
            <Row className="text-center">
              {(Array.isArray(categoriesData) ? categoriesData : [])
                .slice(carouselIndex * 3, carouselIndex * 3 + 3)
                .map((category) => (
                  <Col
                    key={category?._id}
                    xs={12}
                    md={4}
                    className="carousel-col"
                    onClick={() => handleCategoryClick(category?._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={getCategoryImage(category)}
                      alt={category?.name || "Category"}
                      className="d-block w-100"
                      style={{ height: "430px", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/product/product-1.jpg";
                      }}
                    />
                  </Col>
                ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BestSellers;
