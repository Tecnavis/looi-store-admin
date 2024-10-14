import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditProduct = ({ show, handleClose, productId, onEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        coverImage: '',
        sizes: [],
        description: '',
        productId: '',
        commodity: '',
        countryOfOrigin: '',
        manufacturer: '',
        packedBy: '',
        maincategory: '',
        subcategory: '',
        totalStock: 0,
        ratings: {
            average: 0,
            count: 0
        }
    });
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            const token = localStorage.getItem('token');
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/get-productid/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const productData = response.data.product;
                setFormData({
                    name: productData.name || '',
                    price: productData.price || 0,
                    coverImage: productData.coverImage || '',
                    sizes: productData.sizes || [],
                    description: productData.description || '',
                    productId: productData.productId || '',
                    commodity: productData.commodity || '',
                    countryOfOrigin: productData.countryOfOrigin || '',
                    manufacturer: productData.manufacturer || '',
                    packedBy: productData.packedBy || '',
                    maincategory: productData.maincategory || '',
                    subcategory: productData.subcategory || '',
                    totalStock: productData.totalStock || 0,
                    ratings: {
                        average: productData.ratings?.average || 0,
                        count: productData.ratings?.count || 0
                    }
                });
            } catch (err) {
                console.error('Error fetching product details:', err);
                MySwal.fire({
                    title: 'Error',
                    text: 'Failed to load product details',
                    icon: 'error',
                });
            } finally {
                setLoading(false);
            }
        };

        if (show && productId) {
            fetchProduct();
        }
    }, [show, productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSizeChange = (index, field, value) => {
        const updatedSizes = [...formData.sizes];
        updatedSizes[index] = {
            ...updatedSizes[index],
            [field]: value,
        };
        setFormData(prevData => ({
            ...prevData,
            sizes: updatedSizes,
        }));
    };

    const handleColorChange = (sizeIndex, colorIndex, field, value) => {
        const updatedSizes = [...formData.sizes];
        updatedSizes[sizeIndex].colors[colorIndex] = {
            ...updatedSizes[sizeIndex].colors[colorIndex],
            [field]: value,
        };
        setFormData(prevData => ({
            ...prevData,
            sizes: updatedSizes,
        }));
    };
    const handleImageChange = (sizeIndex, colorIndex, files) => {
        const updatedSizes = [...formData.sizes];
        const color = updatedSizes[sizeIndex].colors[colorIndex];

        // Store the actual files for upload
        color.imageFiles = Array.from(files);

        // Update preview URLs while keeping the existing image array intact
        color.imagePreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));

        setFormData(prevData => ({
            ...prevData,
            sizes: updatedSizes,
        }));
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImageFile(file);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const updatedFormData = new FormData();

        // Append basic product data
        Object.keys(formData).forEach(key => {
            if (key !== 'sizes') {
                updatedFormData.append(key, formData[key]);
            }
        });

        // Handle cover image
        if (coverImageFile) {
            updatedFormData.append('coverImage', coverImageFile);
        }

        // Handle sizes and their images
        const sizesForBackend = formData.sizes.map(size => ({
            ...size,
            colors: size.colors.map(color => ({
                ...color,
                images: color.images || [] // Keep the existing images array
            }))
        }));
        updatedFormData.append('sizes', JSON.stringify(sizesForBackend));

        // Append new image files
        formData.sizes.forEach((size, sizeIndex) => {
            size.colors.forEach((color, colorIndex) => {
                if (color.imageFiles) {
                    color.imageFiles.forEach((file, imageIndex) => {
                        const fieldName = `size_${size.size}_color_${color.color}_image_${imageIndex}`;
                        updatedFormData.append(fieldName, file);
                    });
                }
            });
        });

        try {
            const response = await axiosInstance.put(`/update-productid/${productId}`, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            onEdit(productId, response.data.product);
            MySwal.fire({
                title: 'Success',
                text: 'Product updated successfully',
                icon: 'success',
            });
            handleClose();
        } catch (err) {
            console.error('Error updating product:', err);
            MySwal.fire({
                title: 'Error',
                text: 'Failed to update product',
                icon: 'error',
            });
        }
    };
    if (loading) {
        return (
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Body>Loading product details...</Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>


                    <Row className="mb-3">

                        <Col md={6}>
                            {/* <Form.Group>
                                <Form.Label>Total Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="totalStock"
                                    value={formData.totalStock}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group> */}
                            <Form.Group>
                                <Form.Label>Country of origin</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="countryOfOrigin"
                                    value={formData.countryOfOrigin}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Commodity</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="commodity"
                                    value={formData.commodity}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">

                        <Col md={6}>
                            {/* <Form.Group>
                               <Form.Label>Total Stock</Form.Label>
                               <Form.Control
                                   type="number"
                                   name="totalStock"
                                   value={formData.totalStock}
                                   onChange={handleChange}
                                   required
                               />
                           </Form.Group> */}
                            <Form.Group>
                                <Form.Label>manufacturer</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>packedBy</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="packedBy"
                                    value={formData.packedBy}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Cover Image</Form.Label>
                        {formData.coverImage && (
                            <div className="mb-2">
                                <img
                                    src={`http://localhost:8000/uploads/${formData.coverImage}`}
                                    alt="Product Cover"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <Form.Control
                            type="file"
                            onChange={handleCoverImageChange}
                        />
                    </Form.Group>

                    <div className="mb-3">
                        <h5>Sizes and Colors</h5>
                        {formData.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="border p-3 mb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label>Size</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={size.size}
                                        onChange={(e) => handleSizeChange(sizeIndex, 'size', e.target.value)}
                                    />
                                </Form.Group>

                                {size.colors && size.colors.map((color, colorIndex) => (
                                    <div key={colorIndex} className="border p-2 mb-2">
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Color</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={color.color}
                                                        onChange={(e) => handleColorChange(sizeIndex, colorIndex, 'color', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Stock</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={color.stock}
                                                        onChange={(e) => handleColorChange(sizeIndex, colorIndex, 'stock', parseInt(e.target.value))}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mt-2">
                                            <Form.Label>Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                multiple
                                                onChange={(e) => handleImageChange(sizeIndex, colorIndex, e.target.files)}
                                            />
                                            <div className="mt-2 d-flex flex-wrap">
                                                {color.imagePreviewUrls ? (
                                                    // Show new images to be uploaded
                                                    color.imagePreviewUrls.map((url, imgIndex) => (
                                                        <img
                                                            key={`preview-${imgIndex}`}
                                                            src={url}
                                                            alt={`New ${color.color} preview ${imgIndex + 1}`}
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 10px 10px 0' }}
                                                        />
                                                    ))
                                                ) : color.images && color.images.length > 0 ? (
                                                    // Show existing images
                                                    color.images.map((img, imgIndex) => (
                                                        <img
                                                            key={`existing-${imgIndex}`}
                                                            src={`http://localhost:8000/uploads/${img}`}
                                                            alt={`Existing ${color.color} ${imgIndex + 1}`}
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 10px 10px 0' }}
                                                        />
                                                    ))
                                                ) : (
                                                    <div>No images uploaded yet</div>
                                                )}
                                            </div>
                                        </Form.Group>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button type="submit">Update Product</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditProduct;
