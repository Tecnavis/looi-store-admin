import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import { Fragment } from "react";
import LayoutOne from "../../layouts/LayoutOne";
import { BASE_URL} from '../../config/baseurlconfig';
import { getImageUrl } from "../../utils/imageUrl";



const SearchResults = () => {
  const { searchResults, isSearching } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || '';

  const handleCardClick = (productId) => {
    navigate(`/product-tab-left/${productId}`);
  };

  if (isSearching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Fragment>
          <LayoutOne headerTop="visible">
          <div className="product-area pb-60 section-padding-1">
      <div className="container-fluid">
        <h3 className="text-center my-5">
          Search Results for "{searchTerm}" ({searchResults.length} items)
        </h3>
        
        {searchResults.length === 0 ? (
          <div className="text-center">
            <p>No products found matching your search.</p>
          </div>
        ) : (
          <Row className="justify-content-center">
            {searchResults.map((product) => (
              <Col xs={12} sm={6} md={3} className="mb-4 d-flex justify-content-center" key={product._id}>
                <Card 
                  style={{ width: '100%', border: 'none', height: '100%' }} 
                  onClick={() => handleCardClick(product._id)}
                >
                  {product.coverImage ? (
                    <img
                      src={getImageUrl(product.coverImage)}
                      alt={product.name}
                      style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                    />
                  ) : (
                    <p>No Cover Image Available</p>
                  )}
                  <Card.Body style={{ height: '100%' }}>
                    <Card.Title 
                      className="product-name" 
                      style={{ 
                        color: '#5b5b5b', 
                        fontSize: '16px', 
                        height: '20px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      <b>{product.name}</b>
                    </Card.Title>
                    <hr />
                    <Card.Text style={{ flex: 1 }}>
                      <h5 style={{ color: '#999999' }}>{product.subcategory.subcategoryname}</h5>
                      <b>₹ {product.price}</b>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
          </LayoutOne>
   
    </Fragment>
  );
};

export default SearchResults;