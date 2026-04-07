import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
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
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    ratings: { average: 0, count: 0 },
  });

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'variants'
  const [editingCell, setEditingCell] = useState(null); // { sizeIndex, colorIndex, field }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const token = localStorage.getItem('token');
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/get-productid/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = response.data.product;
        setFormData({
          name: d.name || '',
          price: d.price || 0,
          coverImage: d.coverImage || '',
          sizes: d.sizes || [],
          description: d.description || '',
          productId: d.productId || '',
          commodity: d.commodity || '',
          countryOfOrigin: d.countryOfOrigin || '',
          manufacturer: d.manufacturer || '',
          packedBy: d.packedBy || '',
          maincategory: d.maincategory || '',
          subcategory: d.subcategory || '',
          totalStock: d.totalStock || 0,
          length: d.length || 0,
          width: d.width || 0,
          height: d.height || 0,
          weight: d.weight || 0,
          ratings: { average: d.ratings?.average || 0, count: d.ratings?.count || 0 },
        });
      } catch (err) {
        MySwal.fire({ title: 'Error', text: 'Failed to load product details', icon: 'error' });
      } finally {
        setLoading(false);
      }
    };
    if (show && productId) {
      setActiveTab('basic');
      setEditingCell(null);
      fetchProduct();
    }
  }, [show, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Inline table editing
  const handleCellEdit = (sizeIndex, colorIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size, si) => {
        if (si !== sizeIndex) return size;
        return {
          ...size,
          size: field === 'size' ? value : size.size,
          colors: size.colors.map((color, ci) => {
            if (ci !== colorIndex) return color;
            return { ...color, [field]: field === 'stock' ? parseInt(value) || 0 : value };
          }),
        };
      }),
    }));
  };

  const handleImageChange = (sizeIndex, colorIndex, files) => {
    const fileArray = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size, si) => {
        if (si !== sizeIndex) return size;
        return {
          ...size,
          colors: size.colors.map((color, ci) => {
            if (ci !== colorIndex) return color;
            return {
              ...color,
              imageFiles: fileArray,
              imagePreviewUrls: fileArray.map((f) => URL.createObjectURL(f)),
            };
          }),
        };
      }),
    }));
  };

  const handleRemoveVariant = (sizeIndex, colorIndex) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes
        .map((size, si) => {
          if (si !== sizeIndex) return size;
          return { ...size, colors: size.colors.filter((_, ci) => ci !== colorIndex) };
        })
        .filter((size) => size.colors.length > 0),
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setFormData((prev) => ({ ...prev, coverImage: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const updatedFormData = new FormData();
    setSubmitting(true);

    Object.keys(formData).forEach((key) => {
      if (key !== 'sizes' && key !== 'ratings') updatedFormData.append(key, formData[key]);
    });

    if (coverImageFile) updatedFormData.append('coverImage', coverImageFile);

    const sizesForBackend = formData.sizes.map((size) => ({
      ...size,
      colors: size.colors.map((color) => ({ ...color, images: color.images || [] })),
    }));
    updatedFormData.append('sizes', JSON.stringify(sizesForBackend));

    formData.sizes.forEach((size, sizeIndex) => {
      size.colors.forEach((color, colorIndex) => {
        if (color.imageFiles) {
          color.imageFiles.forEach((file, imageIndex) => {
            updatedFormData.append(`size_${size.size}_color_${color.color}_image_${imageIndex}`, file);
          });
        }
      });
    });

    try {
      const response = await axiosInstance.put(`/update-productid/${productId}`, updatedFormData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onEdit(productId, response.data.product);
      MySwal.fire({ title: 'Success', text: 'Product updated successfully', icon: 'success' });
      handleClose();
    } catch (err) {
      MySwal.fire({ title: 'Error', text: 'Failed to update product', icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalVariants = formData.sizes.reduce((acc, s) => acc + s.colors.length, 0);
  const totalStock = formData.sizes.reduce(
    (acc, s) => acc + s.colors.reduce((ca, c) => ca + (parseInt(c.stock) || 0), 0),
    0
  );

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3 text-muted">Loading product details...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
        <div>
          <Modal.Title className="fw-bold fs-5">Edit Product</Modal.Title>
          <p className="text-muted small mb-0 mt-1">{formData.name || 'Loading...'}</p>
        </div>
      </Modal.Header>

      {/* Tab Navigation */}
      <div className="px-4 pt-3">
        <ul className="nav nav-pills gap-2">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              <i className="fa-light fa-info-circle me-2"></i>Basic Info
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === 'variants' ? 'active' : ''}`}
              onClick={() => setActiveTab('variants')}
            >
              <i className="fa-light fa-layer-group me-2"></i>
              Variants
              {totalVariants > 0 && (
                <span className="badge bg-primary rounded-pill ms-2">{totalVariants}</span>
              )}
            </button>
          </li>
        </ul>
        <hr className="mt-3 mb-0" />
      </div>

      <Modal.Body className="px-4 py-4">
        <Form onSubmit={handleSubmit}>
          {/* ── TAB: BASIC INFO ── */}
          {activeTab === 'basic' && (
            <div>
              {/* Cover Image */}
              <div className="mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="d-flex align-items-center gap-4">
                  <div className="flex-shrink-0">
                    {formData.coverImage ? (
                      <img
                        src={formData.coverImage}
                        alt="Cover"
                        style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    ) : (
                      <div style={{ width: '90px', height: '90px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-light fa-image fa-2x text-muted"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="fw-medium mb-1">Cover Image</p>
                    <p className="text-muted small mb-2">
                      Upload a new image to replace the current cover.
                      <span className="badge bg-secondary ms-2" style={{ fontSize: '10px' }}>Optional</span>
                    </p>
                    <Form.Control type="file" onChange={handleCoverImageChange} accept=".jpg,.jpeg,.png" style={{ maxWidth: '280px' }} />
                  </div>
                </div>
              </div>

              {/* Basic fields */}
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label className="fw-medium">Product Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-medium">Price (₹) <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-medium">Country of Origin</Form.Label>
                  <Form.Control type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-medium">Commodity</Form.Label>
                  <Form.Control type="text" name="commodity" value={formData.commodity} onChange={handleChange} />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-medium">Manufacturer</Form.Label>
                  <Form.Control type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-medium">Packed By</Form.Label>
                  <Form.Control type="text" name="packedBy" value={formData.packedBy} onChange={handleChange} />
                </Col>
              </Row>

              {/* Dimensions */}
              <div className="mt-4">
                <p className="fw-medium text-muted small text-uppercase mb-3">Shipping Dimensions</p>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Label className="fw-medium">Length (cm)</Form.Label>
                    <Form.Control type="number" name="length" value={formData.length} onChange={handleChange} min="0" step="0.1" />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-medium">Width (cm)</Form.Label>
                    <Form.Control type="number" name="width" value={formData.width} onChange={handleChange} min="0" step="0.1" />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-medium">Height (cm)</Form.Label>
                    <Form.Control type="number" name="height" value={formData.height} onChange={handleChange} min="0" step="0.1" />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-medium">Weight (kg)</Form.Label>
                    <Form.Control type="number" name="weight" value={formData.weight} onChange={handleChange} min="0" step="0.01" />
                  </Col>
                </Row>
              </div>

              {/* Description */}
              <div className="mt-3">
                <Form.Label className="fw-medium">Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* ── TAB: VARIANTS ── */}
          {activeTab === 'variants' && (
            <div>
              {/* Summary badges */}
              {formData.sizes.length > 0 && (
                <div className="d-flex gap-3 mb-3">
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {totalVariants} variant{totalVariants !== 1 ? 's' : ''}
                  </span>
                  <span className="badge bg-success rounded-pill px-3 py-2">
                    {totalStock} units total
                  </span>
                </div>
              )}

              <p className="text-muted small mb-3">
                <i className="fa-light fa-circle-info me-1"></i>
                Click any cell to edit inline. Changes will be saved when you click Update Product.
              </p>

              {formData.sizes.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fa-light fa-layer-group fa-3x text-muted d-block mb-3"></i>
                  <p className="text-muted">No size/color variants found for this product.</p>
                </div>
              ) : (
                <div className="table-responsive rounded" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <table className="table table-hover mb-0 align-middle">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <th className="px-3 py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Size</th>
                        <th className="py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Color</th>
                        <th className="py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Stock</th>
                        <th className="py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Images</th>
                        <th className="py-3 pe-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.sizes.map((size, sizeIndex) =>
                        size.colors.map((color, colorIndex) => (
                          <tr key={`${sizeIndex}-${colorIndex}`}>
                            {/* Size — editable */}
                            <td className="px-3 py-3">
                              {editingCell?.sizeIndex === sizeIndex && editingCell?.colorIndex === colorIndex && editingCell?.field === 'size' ? (
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  style={{ maxWidth: '80px' }}
                                  value={size.size}
                                  onChange={(e) => handleCellEdit(sizeIndex, colorIndex, 'size', e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="badge px-2 py-2 d-inline-flex align-items-center gap-1"
                                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                                  onClick={() => setEditingCell({ sizeIndex, colorIndex, field: 'size' })}
                                  title="Click to edit"
                                >
                                  {size.size}
                                  <i className="fa-light fa-pen" style={{ fontSize: '10px' }}></i>
                                </span>
                              )}
                            </td>

                            {/* Color — editable */}
                            <td className="py-3">
                              {editingCell?.sizeIndex === sizeIndex && editingCell?.colorIndex === colorIndex && editingCell?.field === 'color' ? (
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  style={{ maxWidth: '130px' }}
                                  value={color.color}
                                  onChange={(e) => handleCellEdit(sizeIndex, colorIndex, 'color', e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => setEditingCell({ sizeIndex, colorIndex, field: 'color' })}
                                  title="Click to edit"
                                >
                                  <span className="rounded-circle flex-shrink-0" style={{ width: '12px', height: '12px', background: color.color.toLowerCase() === 'white' ? '#eee' : color.color.toLowerCase() === 'black' ? '#333' : color.color, border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block' }}></span>
                                  {color.color}
                                  <i className="fa-light fa-pen text-muted" style={{ fontSize: '10px' }}></i>
                                </div>
                              )}
                            </td>

                            {/* Stock — editable */}
                            <td className="py-3">
                              {editingCell?.sizeIndex === sizeIndex && editingCell?.colorIndex === colorIndex && editingCell?.field === 'stock' ? (
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  style={{ maxWidth: '90px' }}
                                  value={color.stock}
                                  min="0"
                                  onChange={(e) => handleCellEdit(sizeIndex, colorIndex, 'stock', e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => setEditingCell({ sizeIndex, colorIndex, field: 'stock' })}
                                  title="Click to edit"
                                >
                                  <span className={`badge rounded-pill px-2 ${parseInt(color.stock) > 10 ? 'bg-success' : parseInt(color.stock) > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                    {color.stock}
                                  </span>
                                  <i className="fa-light fa-pen text-muted" style={{ fontSize: '10px' }}></i>
                                </div>
                              )}
                            </td>

                            {/* Images */}
                            <td className="py-3">
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                {(color.imagePreviewUrls || color.images || []).slice(0, 3).map((img, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    src={img}
                                    alt={`img-${imgIdx}`}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
                                  />
                                ))}
                                {(color.imagePreviewUrls || color.images || []).length > 3 && (
                                  <span className="badge bg-secondary">+{(color.imagePreviewUrls || color.images || []).length - 3}</span>
                                )}
                                {!(color.imagePreviewUrls || color.images || []).length && (
                                  <span className="text-muted small">No images</span>
                                )}
                                <label className="btn btn-sm btn-outline-secondary mb-0" style={{ cursor: 'pointer', fontSize: '11px' }} title="Upload images">
                                  <i className="fa-light fa-upload"></i>
                                  <Form.Control
                                    type="file"
                                    className="d-none"
                                    multiple
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => handleImageChange(sizeIndex, colorIndex, e.target.files)}
                                  />
                                </label>
                              </div>
                            </td>

                            {/* Remove */}
                            <td className="py-3 pe-3">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveVariant(sizeIndex, colorIndex)}
                                title="Remove variant"
                              >
                                <i className="fa-light fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Footer buttons */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button variant="outline-secondary" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-4" disabled={submitting}>
              {submitting ? (
                <><Spinner size="sm" className="me-2" />Updating...</>
              ) : (
                <><i className="fa-light fa-floppy-disk me-2"></i>Update Product</>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProduct;