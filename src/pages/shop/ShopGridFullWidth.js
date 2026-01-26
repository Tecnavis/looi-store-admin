
// editing code-new

import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Form } from "react-bootstrap";
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import axiosInstance from '../../config/axiosconfig';
import { Loader } from 'lucide-react';
import { BASE_URL} from '../../config/baseurlconfig';
import { getImageUrl } from "../../utils/imageUrl";



const ShopGridFullWidth = () => {

  const location = useLocation(); 
    const [layout, setLayout] = useState('grid three-column');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { subcategoryId } = useParams();
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [sortOrder, setSortOrder] = useState('default');

    // const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://looi-store-server-ypdx.onrender.com'
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Show 12 items per page

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Handle page changes
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top of product section
            window.scrollTo({
                top: document.querySelector('.shop-area').offsetTop,
                behavior: 'smooth'
            });
        }
    };
    useEffect(() => {
        localStorage.setItem("lastVisitedPage", location.pathname);
      }, [location.pathname]);
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const priceRanges = [
        { label: 'Rs. 299 To Rs. 499', value: '299-499' },
        { label: 'Rs. 499 To Rs. 999', value: '499-999' },
        { label: 'Rs. 999 To Rs. 1999', value: '999-1999' },
        { label: 'Rs. 1999 To Rs. 2999', value: '1999-2999' },
    ];
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/get-allproduct`);
                const allProducts = response.data.products;
                const filteredProducts = allProducts.filter(product => product.subcategory === subcategoryId);
                setProducts(filteredProducts);
                setFilteredProducts(filteredProducts);

                // Extract all unique colors from the products
                const colors = new Set();
                filteredProducts.forEach(product => {
                    product.sizes.forEach(size => {
                        size.colors.forEach(colorObj => {
                            colors.add(colorObj.color);
                        });
                    });
                });
                setAvailableColors(Array.from(colors));

                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products");
                setLoading(false);
            }
        };
        const fetchBanners = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/get-adbanner', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setBanners(response.data.banners); // Assuming response.data.banners contains the list of banners
            } catch (err) {
                setError('Error fetching banners');
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();

        fetchProducts();
    }, [subcategoryId]);

    useEffect(() => {
        setCurrentPage(1);
        filterProducts();
    }, [selectedSizes, selectedColors, selectedPriceRanges, sortOrder]);

    const filterProducts = () => {
        let filtered = [...products];

        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product =>
                product.sizes.some(sizeObj => selectedSizes.includes(sizeObj.size))
            );
        }

        if (selectedColors.length > 0) {
            filtered = filtered.filter(product =>
                product.sizes.some(sizeObj =>
                    sizeObj.colors.some(colorObj => selectedColors.includes(colorObj.color))
                )
            );
        }

        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter(product =>
                selectedPriceRanges.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return product.price >= min && product.price <= max;
                })
            );
        }

        switch (sortOrder) {
            case 'lowToHigh':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'highToLow':
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                // Default sorting (you might want to define a default sort order)
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleSizeChange = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const handlePriceChange = (value) => {
        setSelectedPriceRanges(prev =>
            prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
        );
    };

    const handleCardClick = (productId) => {
        navigate(`/product-tab-left/${productId};
    };

    const getLayout = (layout) => {
        setLayout(layout);
    };
    const getFilterSortParams = (sortType, value) => {
        if (sortType === "filterSort") {
            setSortOrder(value);
        }
    };

   

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader size={38} className="animate-spin text-center" />
      </div>
        );
    }

    if (error) {
        return <div className="text-center">{error}</div>;
    }

    return (
        <Fragment>
            <SEO titleTemplate="Shop Page" description="Shop page of flone react minimalist eCommerce template." />
            <LayoutOne headerTop="visible">
                <div className="banner-container ">
                    {banners.length > 0 ? (
                        banners.map((banner, index) => (
                            <div key={banner._id} className="banner-item">
                                <div className="banner-div">
                                    {banner.image ? (
                                        <img
                                            src={getImageUrl(banner.image)}
                                            className="img-fluid"
                                            alt={`Banner ${index}`}
                                            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <p>No Image Available</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Banners Available</p>
                    )}
                </div>
                <div className="shop-area pt-50 pb-100">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                <h4 className='mb-3' style={{ color: 'grey' }}>COLORS</h4>
                                {availableColors.map((color, idx) => (
                                    <div key={idx} className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label={color}
                                            id={`color-${color)}
                                            onChange={() => handleColorChange(color)}
                                            checked={selectedColors.includes(color)}
                                        />
                                    </div>
                                ))}
                                <h4 className='mt-3 mb-3' style={{ color: 'grey' }}>SIZES</h4>
                                {sizes.map((size, idx) => (
                                    <div key={idx} className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label={size}
                                            id={`size-${size)}
                                            onChange={() => handleSizeChange(size)}
                                            checked={selectedSizes.includes(size)}
                                        />
                                    </div>
                                ))}
                                <h4 className='mt-3 mb-3' style={{ color: 'grey' }}>PRICES</h4>
                                {priceRanges.map((range, idx) => (
                                    <div key={idx} className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label={range.label}
                                            id={`priceRange-${idx)}
                                            onChange={() => handlePriceChange(range.value)}
                                            checked={selectedPriceRanges.includes(range.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                <ShopTopbar
                                    getLayout={getLayout}
                                    getFilterSortParams={getFilterSortParams}
                                    productCount={filteredProducts.length} />
                                <Row className="justify-content-center">
                                    {filteredProducts.map((product) => (
                                        <Col xs={6} sm={6} md={4} lg={3} className="mb-4" key={product._id}>
                                            <Card style={{ width: '100%', border: 'none', height: '100%' }} onClick={() => handleCardClick(product._id)}>
                                                <div className="position-relative">
                                                    <Card.Img
                                                        variant="top"
                                                        src={getImageUrl(product.coverImage)}
                                                        alt={product.name}
                                                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <Card.Body>
                                                    <Card.Title className="product-name" style={{ color: '#5b5b5b', fontSize: '16px', height: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        <h5><b>{product.name}</b></h5>
                                                    </Card.Title>
                                                    <hr />
                                                    <Card.Text>
                                                        <b>₹ {product.price}</b>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                {/* <BlogPagination
                            
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                /> */}

                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    );
};

export default ShopGridFullWidth;