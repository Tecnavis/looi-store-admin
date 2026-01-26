import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axiosInstance from '../../config/axiosconfig'; // Assuming axios instance is already set up
import './styles/categories.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL} from '../../config/baseurlconfig';


const CategoryGrid = () => {
  const navigate = useNavigate();
  const [categoriesData, setCategoriesData] = useState([]);


  // Fetch categories data from API using axios
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/get-subcategory'); // Adjust API endpoint as necessary
        setCategoriesData(Array.isArray(res.data) ? res.data : (res.data?.categories || res.data?.data || [])); // Assuming the response contains an array of categories
      } catch (error) {
        console.error('Error fetching categories data:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/shop-grid-full-width/${subcategoryId}`);
  };

  return (
    <Container fluid >
      <h3 className="text-center my-5"><b>CATEGORIES</b></h3>
     
      {/* Render categories dynamically */}
      <Row className="mb-4">
        {categoriesData.slice(0, 3).map((category, index) => (
          <Col key={category._id} md={4}>
            <Card className="h-100 mb-3" style={{ border: 'none' }}>
              <div className="zoom-container" onClick={() => handleSubcategoryClick(category._id)}>
                <Card.Img
                  variant="top"
                  className="zoom-image"
                  src={`${BASE_URL}/uploads/${category.images[0]}`} // Adjust the image path as per your backend
                  alt={category.subcategoryname}
                />
              </div>
              <Card.Body>
                {/* <Card.Title>{category.subcategoryname}</Card.Title>  */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Second Row - Render the rest of the categories */}
      <Row>
        {categoriesData.slice(3).map((category, index) => (
          <Col key={category._id} md={3}>
            <Card className="h-100 mb-3" style={{ border: 'none' }}>
              <div className="zoom-container">
                <Card.Img
                  variant="top"
                  className="zoom-image"
                  src={`${BASE_URL}/uploads/${category.images[0]}`} // Adjust the image path as per your backend
                  alt={category.subcategoryname}
                />
              </div>
              <Card.Body>
                {/* <Card.Title>{category.subcategoryname}</Card.Title>  */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </Container>
  );
};

export default CategoryGrid;
