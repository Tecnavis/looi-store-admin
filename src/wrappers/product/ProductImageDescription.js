
// ------------------------------------------------------------------------------

import PropTypes from "prop-types";
import clsx from "clsx";
import { useState, useEffect, useContext } from "react";
import { EffectFade, Thumbs } from 'swiper';
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../../components/swiper";
import { useNavigate } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import './styles/cartstyle.css'
import axiosInstance from '../../config/axiosconfig'
import { WishlistContext } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext"; // Import useCart
import SimilarProduct from "../../wrappers/product/SimilarProduct";
import cogoToast from 'cogo-toast';
import { BASE_URL} from '../../config/baseurlconfig';
import { getImageUrl } from "../../utils/imageUrl";

const ProductImageDescription = ({ spaceTopClass, spaceBottomClass, galleryType, product, wishlistItem, compareItem }) => {
  const {
    name,
    price,
    sizes,
    totalStock,
    description,
    countryOfOrigin,
    manufacturer,
    packedBy,
    commodity,
    coverImage,
    subcategory
  } = product;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [index, setIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for color and size selection
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState(sizes[0]?.colors[0]?.color || "");
  const [productStock, setProductStock] = useState(sizes[0]?.colors[0]?.stock || 0);
  const [quantityCount, setQuantityCount] = useState(1);
  const [currentImages, setCurrentImages] = useState([]);

  const [wishlistStatus, setWishlistStatus] = useState(null);

  const { addToCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  // Get all available colors
  const allColors = [...new Set(sizes.flatMap(size =>
    size.colors.map(color => color.color)
  ))];

  // Get sizes available for the selected color
  const availableSizes = sizes.filter(size =>
    size.colors.some(color => color.color === selectedColor)
  ).map(size => size.size);


  // Update images when color changes
  useEffect(() => {
    const getImagesForColor = () => {
      let colorImages = [];
      sizes.forEach(sizeItem => {
        const colorData = sizeItem.colors.find(c => c.color === selectedColor);
        if (colorData) {
          colorImages = [...colorImages, ...colorData.images];
        }
      });
      return [coverImage, ...colorImages];
    };

    const newImages = getImagesForColor();
    setCurrentImages(newImages);
  }, [selectedColor, sizes, coverImage]);

  const slides = currentImages.map((imgFileName, i) => ({
    src: getImageUrl(imgFileName),
    key: i,
  }));

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    loop: true,
    slideToClickedSlide: true,
    direction: "vertical",
    breakpoints: {
      320: { slidesPerView: 4, direction: "horizontal" },
      640: { slidesPerView: 4, direction: "horizontal" },
      768: { slidesPerView: 4, direction: "horizontal" },
      992: { slidesPerView: 4, direction: "horizontal" },
      1200: { slidesPerView: 4, direction: "vertical" },
    },
  };

  const handleThumbnailClick = (key) => {
    setCurrentIndex(key);
    setIndex(key);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const availableSizesForColor = sizes.filter(size =>
      size.colors.some(c => c.color === color)
    );
    if (availableSizesForColor.length > 0) {
      setSelectedSize(availableSizesForColor[0].size);
      const selectedColorData = availableSizesForColor[0].colors.find(c => c.color === color);
      setProductStock(selectedColorData.stock);
    }
    setQuantityCount(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const selectedSizeData = sizes.find(s => s.size === size);
    const selectedColorData = selectedSizeData.colors.find(c => c.color === selectedColor);
    setProductStock(selectedColorData.stock);
    setQuantityCount(1);
  };

  const thumbPosition = "left";

  // wishlist
  const { addToWishlist } = useContext(WishlistContext);

  const handleAddToWishlist = async () => {

    try {
      const token = localStorage.getItem("token"); // Assuming JWT token is stored in localStorage

      if (!token) {
        navigate('/login-register');
        return;
      }

      const response = await axiosInstance.post(
        `/add-wishlist/${product._id}`,
        {}, // No data in the body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in headers
          },
        }
      );
      if (response.status === 200) {
        addToWishlist();
        setWishlistStatus("Product added to wishlist successfully!");
        cogoToast.success("Product added to wishlist successfully", { position: "top-right" });

      } else {
        setWishlistStatus(response.data.message);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setWishlistStatus("Failed to add product to wishlist.");
    }
  };
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to add a product to the cart

  const [cartStatus, setCartStatus] = useState('');

  const handleAddToCart = async () => {

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login-register');
        return;
      }
      await addToCart(product._id, quantityCount, selectedSize, selectedColor);
      setIsInCart(true);
      setCartStatus('Product added to cart successfully!');
      cogoToast.success("Product added to cart successfully", { position: "top-right" });

    } catch (error) {
      console.error('Error adding to cart:', error.message);
      setCartStatus('Failed to add product to cart.');
    }
  };
  const handleAddToCart1 = async () => {

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login-register');
        return;
      }
      await addToCart(product._id, quantityCount, selectedSize, selectedColor);
      setIsInCart(true);
      setCartStatus('Product added to cart successfully!');
      cogoToast.success("Product added to cart successfully", { position: "top-right" });
     navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      setCartStatus('Failed to add product to cart.');
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };
  // const BASE_URL = 'https://looi-store-server-1.onrender.com';

  const isOutOfStock = () => {
    return totalStock === 0 || productStock === 0;
  };

  return (
    <div className={clsx("shop-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="row row-5">
              <div className={clsx(thumbPosition === "left" ? "col-xl-10 order-1 order-xl-2" : "col-xl-10")}>
                <div className="product-large-image-wrapper">
                  {slides.length > 0 && (
                    <Swiper options={gallerySwiperParams}>
                      {slides.map((single, key) => (
                        <SwiperSlide key={key}>
                          <button className="lightgallery-button" onClick={() => handleThumbnailClick(key)}>
                            <i className="pe-7s-expand1"></i>
                          </button>
                          {/* <div className="single-image">
                            <img src={single.src} className="img-fluid" alt={`${name} - Image ${key + 1)} />
                          </div> */}
                          <div className="single-image">
                            <img src={single.src} className="img-fluid" alt={name} />
                          </div>

                        </SwiperSlide>
                      ))}
                      <AnotherLightbox
                        open={index >= 0}
                        index={index}
                        close={() => setIndex(-1)}
                        slides={slides}
                        plugins={[Thumbnails, Zoom, Fullscreen]}
                      />
                    </Swiper>
                  )}
                </div>
              </div>
              <div className={clsx(thumbPosition === "left" ? "col-xl-2 order-2 order-xl-1" : "col-xl-2")}>
                <div className="product-small-image-wrapper product-small-image-wrapper--side-thumb">
                  {slides.length > 0 && (
                    <Swiper options={thumbnailSwiperParams}>
                      {slides.map((single, key) => (
                        <SwiperSlide key={key}>
                          <div className="single-image" onClick={() => handleThumbnailClick(key)}>
                            <img src={single.src} className="img-fluid" alt={`${name} - Thumbnail ${key + 1}`} />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="product-details-content ml-70">
              <h1 style={{ color: 'grey' }}>{name}</h1>
              {/* <p>{product.subcategory.subcategoryname}</p> */}
              <hr className="product-divider" style={{ border: '0', height: '1px', backgroundColor: '#00B7EB', marginBottom: '20px' }} />

              <div>
                <h2 className="mt-3 ">₹{price}</h2> <span style={{ textDecoration: 'line-through', color: '#999' }}>₹{product.oldPrice}</span>
                <p className="mb-4">MRP incl. of all taxes</p>
              </div>

              <div className="pro-details-size-color">
                <div className="pro-details-color-wrap">
                  <span>Color</span>
                  <select value={selectedColor} onChange={(e) => handleColorChange(e.target.value)}>
                    {allColors.map((color, index) => (
                      <option key={index} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pro-details-size">
                  <span>Please select a size</span>
                  <div className="pro-details-size-content">
                    {availableSizes.map((size, key) => (
                      <button
                        key={key}
                        className={`size-button ${size === selectedSize ? 'selected' : ''}`}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pro-details-quality">
                <div className="cart-plus-minus">
                  <button
                    onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)}
                    className="dec qtybutton"
                  >
                    -
                  </button>
                  <input
                    className="cart-plus-minus-box"
                    type="text"
                    value={quantityCount}
                    readOnly
                  />
                  <button
                    onClick={() => setQuantityCount(quantityCount < productStock ? quantityCount + 1 : quantityCount)}
                    className="inc qtybutton"
                  >
                    +
                  </button>
                </div>

              </div>

              <div className="d-flex justify-space-between">
                <div className="pro-details-cart " style={{ width: '100%' }}>
                  {isOutOfStock() ? (
                    <button
                      disabled
                      style={{
                        border: 'none',
                        height: '40px',
                        width: '90%',
                        backgroundColor: '#cccccc',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'not-allowed'
                      }}
                    >
                      Out of Stock
                    </button>
                  ) : isInCart ? (
                    <button
                      onClick={handleGoToCart}
                      style={{
                        border: 'none',
                        height: '40px',
                        width: '90%',
                        backgroundColor: 'green',
                        color: 'white',
                        borderRadius: '5px'
                      }}
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      style={{
                        border: 'none',
                        height: '40px',
                        width: '90%',
                        backgroundColor: '#007FFF',
                        color: 'white',
                        borderRadius: '5px'
                      }}
                    >
                      Add To Cart
                    </button>
                  )}
                </div>

                {/* <div className="pro-details-cart " style={{width:'100%'}}>
                  {isInCart ? (
                    <button onClick={handleGoToCart} style={{border: 'none', height: '40px',width:'90%',backgroundColor:'green',color:'white',borderRadius:'5px'}}>Go to Cart</button>
                  ) : (
                    <button onClick={handleAddToCart} style={{border: 'none', height: '40px',width:'90%',backgroundColor:'red',color:'white',borderRadius:'5px'}}>
                      Add To Cart
                    </button>
                  )}
              </div> */}

                <div className="pro-details-cart " style={{ width: '100%' }}>
                  <button onClick={handleAddToWishlist} style={{ height: '40px', width: '100%', border: '#007FFF 1px solid', borderRadius: '5px', color: '#007FFF' }}>
                    Add To Wishlist
                  </button>
                </div>
                
              </div><br/>
              <div className="pro-details-cart " style={{ width: '100%' }}>
                  <button  onClick={handleAddToCart1} style={{ height: '40px', width: '100%',  color: 'white',backgroundColor:"rgb(0, 127, 255)" ,border: 'none', borderRadius: '5px'}}>
                    BUY NOW
                  </button>
                </div>
              <div className="accordion-div mt-4">
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <h3 className="h5 mb-0" style={{ color: 'grey' }}>Product Details</h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>{description}</p>
                      <div className="mb-3 mt-3">
                        <h5 className="mb-2"><b>Country of Origin -</b> </h5>
                        <p className="ms-3">{countryOfOrigin}</p>
                      </div>
                      <div className="mb-3">
                        <h5 className="mb-2"><b>Manufactured By - </b></h5>
                        <p className="ms-3">{manufacturer}</p>
                      </div>
                      <div className="mb-3">
                        <h5 className="mb-2"><b>Packed By -</b> </h5>
                        <p className="ms-3">{packedBy}</p>
                      </div>
                      <div className="mb-3">
                        <h5 className="mb-2"><b>Commodity -</b> </h5>
                        <p className="ms-3">{commodity}</p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProduct subcategory={product.subcategory} currentProductId={product._id} />
    </div>
  );
};

ProductImageDescription.propTypes = {
  galleryType: PropTypes.string,
  product: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    coverImage: PropTypes.string,
    sizes: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string,
        colors: PropTypes.arrayOf(
          PropTypes.shape({
            color: PropTypes.string,
            images: PropTypes.arrayOf(PropTypes.string),
            stock: PropTypes.number,
          })
        ),
      })
    ),
    totalStock: PropTypes.number,
    description: PropTypes.string,
    countryOfOrigin: PropTypes.string,
    manufacturer: PropTypes.string,
    packedBy: PropTypes.string,
    commodity: PropTypes.string,
  }).isRequired,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  wishlistItem: PropTypes.object,
  compareItem: PropTypes.object,

  subcategory: PropTypes.shape({
    _id: PropTypes.string,
    subcategoryname: PropTypes.string
  }).isRequired,

};

export default ProductImageDescription;



// ------------------------------------------------------------------------------