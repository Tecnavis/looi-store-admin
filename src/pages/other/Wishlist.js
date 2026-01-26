
import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import {  Row, Col, Card, Container, Modal, Form } from "react-bootstrap";
import LayoutOne from "../../layouts/LayoutOne";
import SEO from "../../components/seo";
import { WishlistContext } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import cogoToast from 'cogo-toast';
import { Loader } from 'lucide-react';
import { BASE_URL} from '../../config/baseurlconfig';
import { getImageUrl } from "../../utils/imageUrl";



const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, fetchWishlistData } = useContext(WishlistContext);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // States for the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantityCount, setQuantityCount] = useState(1);
  const [productStock, setProductStock] = useState(0);

  useEffect(() => {
    const initializeWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login-register');
          setError("You need to be logged in to view your wishlist");
          return;
        }
        await fetchWishlistData();
      } catch (err) {
        console.error("Error initializing wishlist:", err);
        if (err.response && err.response.status === 406) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError("Failed to load wishlist. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeWishlist();
  }, []);

  const handleCardClick = (productId) => {
    navigate(`/product-tab-left/${productId}`);
  };

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = (product) => {
    setSelectedProduct(product);
    // Set initial values
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
      if (product.sizes[0].colors && product.sizes[0].colors.length > 0) {
        setSelectedColor(product.sizes[0].colors[0].color);
        setProductStock(product.sizes[0].colors[0].stock);
      }
    }
    setShowModal(true);
  };

  const handleAddToCart = async () => {
    try {
      if (!selectedSize || !selectedColor) {
        cogoToast.error("Please select size and color", { position: "top-right" });
        return;
      }

      await addToCart(selectedProduct._id, quantityCount, selectedSize, selectedColor);
      cogoToast.success("Product added to cart successfully", { position: "top-right" });
      setShowModal(false);
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(selectedProduct._id);
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      cogoToast.error("Failed to add product to cart", { position: "top-right" });
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const selectedSizeData = selectedProduct.sizes.find(s => s.size === size);
    const selectedColorData = selectedSizeData.colors.find(c => c.color === selectedColor);
    if (selectedColorData) {
      setProductStock(selectedColorData.stock);
    }
    setQuantityCount(1);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const sizeData = selectedProduct.sizes.find(s => s.size === selectedSize);
    if (sizeData) {
      const colorData = sizeData.colors.find(c => c.color === color);
      if (colorData) {
        setProductStock(colorData.stock);
      }
    }
    setQuantityCount(1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader size={38} className="animate-spin text-center" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">{error}</div>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <SEO
        titleTemplate="Wishlist"
        description="Wishlist page of your e-commerce application."
      />
      <LayoutOne headerTop="visible">
        <Container className="py-5">
          {wishlistItems.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <h4 className="text-center">Your wishlist is empty</h4>
            </div>
          ) : (
            <>
              <h4 className="mb-4" style={{color:'#007fff'}}>My Wishlist ({wishlistItems.length} items)</h4>
              <Row>
                {wishlistItems.map((item) => (
                  <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={item.productId._id}>
                    <Card style={{ height: '100%' }} onClick={() => handleCardClick(item.productId._id)} className="ms-3 me-3">
                      <div className="position-relative">
                        <FaTimes
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromWishlist(item.productId._id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer',
                            zIndex: 1,
                            color: '#666',
                          }}
                        />
                        {item.productId.coverImage ? (
                          <Card.Img
                            variant="top"
                            src={getImageUrl(item.productId.coverImage)}
                            alt={item.productId.name}
                            
                          />
                        ) : (
                          <div className="p-3 text-center">No Cover Image Available</div>
                        )}
                      </div>
                      <Card.Body style={{ height: '100%' }}>
                        <Card.Title className="product-name" style={{ color: '#5b5b5b', fontSize: '16px', height: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <b>{item.productId.name}</b>
                        </Card.Title>
                        <hr />
                        <Card.Text style={{ flex: 1 }}>
                          <b>₹ {item.productId.price}</b>
                        </Card.Text>
                        <button 
                          style={{color: '#007FFF', border: '1px solid #007FFF', height: '40px', backgroundColor: 'white'}}
                          className="w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveToCart(item.productId);
                          }}
                        >
                          Move to Cart
                        </button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>

        {/* Modal for size and color selection */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Select 
                    value={selectedSize} 
                    onChange={(e) => handleSizeChange(e.target.value)}
                  >
                    {selectedProduct.sizes.map((size, index) => (
                      <option key={index} value={size.size}>
                        {size.size}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Select 
                    value={selectedColor} 
                    onChange={(e) => handleColorChange(e.target.value)}
                  >
                    {selectedProduct.sizes
                      .find(s => s.size === selectedSize)?.colors
                      .map((color, index) => (
                        <option key={index} value={color.color}>
                          {color.color}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <div className="d-flex align-items-center">
                    <button 
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantityCount(Math.max(1, quantityCount - 1))}
                    >
                      -
                    </button>
                    <span className="mx-3">{quantityCount}</span>
                    <button 
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantityCount(Math.min(productStock, quantityCount + 1))}
                    >
                      +
                    </button>
                  </div>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button 
              style={{
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                padding: '8px 16px',
                borderRadius: '4px'
              }} 
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button 
              style={{
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px'
              }} 
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </Modal.Footer>
        </Modal>
      </LayoutOne>
    </React.Fragment>
  );
};

export default Wishlist;