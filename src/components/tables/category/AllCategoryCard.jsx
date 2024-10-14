import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../../../axiosConfig';

const AllCategoryCard = () => {
    const [categoryCount, setCategoryCount] = useState(0); // State to hold Category count
    const [mainCategoryCount, setMainCategoryCount] = useState(0); // State to hold MainCategory count
    const [subCategoryCount, setSubCategoryCount] = useState(0); // State to hold SubCategory count
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch all counts from the API
    useEffect(() => {
        const fetchCounts = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch Main Categories count
                const responseMainCategory = await axiosInstance.get('/maincategoriescount', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setMainCategoryCount(responseMainCategory.data.count); // Set Main Category count

                // Fetch Categories count
                const responseCategory = await axiosInstance.get('/categoriescount', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setCategoryCount(responseCategory.data.count); // Set Category count

                // Fetch Subcategories count
                const responseSubCategory = await axiosInstance.get('/subcategoriescount', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setSubCategoryCount(responseSubCategory.data.count); // Set Subcategory count
            } catch (err) {
                setError('Error fetching data: ' + (err.response ? err.response.data.message : err.message));
                console.error(err); // Log the error for debugging
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>; // Display error in a styled manner

    return (
        <>
            {/* Card section for Category, Main Category, and Subcategory counts */}
            <Row className=" p-3">
            <Col md={4}>
                    <Card className="shadow-sm" style={{borderRadius:'15px'}}>
                        <Card.Body>
                            <Card.Title>Category</Card.Title>
                            <Card.Text>
                                {mainCategoryCount} {/* Display Main Category count */}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm" style={{borderRadius:'15px'}}>
                        <Card.Body>
                            <Card.Title>Main Category</Card.Title>
                            <Card.Text>
                                {categoryCount} {/* Display Category count */}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4}>
                    <Card className="shadow-sm" style={{borderRadius:'15px'}}>
                        <Card.Body>
                            <Card.Title>Subcategory</Card.Title>
                            <Card.Text>
                                {subCategoryCount} {/* Display Subcategory count */}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AllCategoryCard;
