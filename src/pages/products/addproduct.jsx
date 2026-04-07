import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Spinner } from 'react-bootstrap';

const MySwal = withReactContent(Swal);

const AddProduct = () => {
  const [availableSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);

  const [formData, setFormData] = useState({
    name: '',
    oldPrice: '',
    price: '',
    sizes: [],
    description: '',
    countryOfOrigin: '',
    manufacturer: '',
    packedBy: '',
    commodity: '',
    hsn: '',
    sku: '',
    height: '',
    width: '',
    length: '',
    weight: '',
    currentColor: '',
    maincategory: '',
    subcategory: '',
    coverImage: '',
  });

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [currentSize, setCurrentSize] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // For inline editing of Added Sizes/Colors table
  const [editingCell, setEditingCell] = useState(null); // { sizeIndex, colorIndex, field }

  const imageInputRef = useRef();
  const coverImageRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        const categoriesResponse = await axiosInstance.get('/get-subcategory', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        setSubCategories(categoriesResponse.data);
        const mainCategoriesResponse = await axiosInstance.get('/get-category', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        setMainCategories(mainCategoriesResponse.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError((prev) => ({ ...prev, fetch: 'Error fetching categories' }));
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentSize') {
      setCurrentSize(value);
    } else if (name === 'subcategory') {
      const selectedSubcategory = subCategories.find((sub) => sub._id === value);
      if (selectedSubcategory) {
        setSelectedCategory(selectedSubcategory.category);
        setFormData((prev) => ({
          ...prev,
          subcategory: value,
          maincategory: selectedSubcategory.category.maincategoriesData,
        }));
      } else {
        setSelectedCategory(null);
        setFormData((prev) => ({ ...prev, subcategory: value, maincategory: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file || null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setCurrentImages(files);
  };

  const handleAddColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !colors.includes(trimmed)) {
      setColors([...colors, trimmed]);
      setColorInput('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  const handleAddSize = () => {
    if (currentSize && currentColor && currentStock > 0) {
      setFormData((prev) => {
        const existingSizeIndex = prev.sizes.findIndex((s) => s.size === currentSize);
        if (existingSizeIndex !== -1) {
          return {
            ...prev,
            sizes: prev.sizes.map((size, index) =>
              index === existingSizeIndex
                ? {
                    ...size,
                    colors: [
                      ...size.colors,
                      { color: currentColor, stock: parseInt(currentStock), images: [...currentImages] },
                    ],
                  }
                : size
            ),
          };
        } else {
          return {
            ...prev,
            sizes: [
              ...prev.sizes,
              {
                size: currentSize,
                colors: [{ color: currentColor, stock: parseInt(currentStock), images: [...currentImages] }],
              },
            ],
          };
        }
      });
      setCurrentSize('');
      setCurrentColor('');
      setCurrentStock('');
      setCurrentImages([]);
      if (imageInputRef.current) imageInputRef.current.value = null;
      setError((prev) => ({ ...prev, size: null }));
    } else {
      setError({ size: 'Please fill in Size, Color, and Stock (images are optional).' });
    }
  };

  // Inline edit handlers for the table
  const handleTableEdit = (sizeIndex, colorIndex, field, value) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes.map((size, si) => {
        if (si !== sizeIndex) return size;
        return {
          ...size,
          colors: size.colors.map((color, ci) => {
            if (ci !== colorIndex) return color;
            return { ...color, [field]: field === 'stock' ? parseInt(value) || 0 : value };
          }),
        };
      });
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleRemoveColorRow = (sizeIndex, colorIndex) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes
        .map((size, si) => {
          if (si !== sizeIndex) return size;
          return { ...size, colors: size.colors.filter((_, ci) => ci !== colorIndex) };
        })
        .filter((size) => size.colors.length > 0);
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleTableImageChange = (sizeIndex, colorIndex, files) => {
    setFormData((prev) => {
      const updatedSizes = prev.sizes.map((size, si) => {
        if (si !== sizeIndex) return size;
        return {
          ...size,
          colors: size.colors.map((color, ci) => {
            if (ci !== colorIndex) return color;
            return { ...color, images: Array.from(files) };
          }),
        };
      });
      return { ...prev, sizes: updatedSizes };
    });
  };

  const clearForm = () => {
    setFormData({
      name: '', oldPrice: '', price: '', sizes: [], description: '',
      countryOfOrigin: '', manufacturer: '', packedBy: '', commodity: '',
      hsn: '', sku: '', height: '', width: '', length: '', weight: '',
      currentColor: '', maincategory: '', subcategory: '', coverImage: '',
    });
    setCurrentSize(''); setCurrentColor(''); setCurrentStock('');
    setCurrentImages([]); setCoverImage(null); setColors([]);
    if (imageInputRef.current) imageInputRef.current.value = null;
    if (coverImageRef.current) coverImageRef.current.value = null;
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'sizes') formDataToSend.append(key, formData[key]);
      });
      if (coverImage) formDataToSend.append('coverImage', coverImage);

      const sizesData = formData.sizes.map((size) => ({
        size: size.size,
        colors: size.colors.map((color) => ({
          color: color.color,
          stock: color.stock,
          imageCount: color.images.length,
        })),
      }));
      formDataToSend.append('sizes', JSON.stringify(sizesData));

      let imageIndex = 0;
      formData.sizes.forEach((size) => {
        size.colors.forEach((color) => {
          color.images.forEach((image) => {
            const modifiedName = `size_${size.size}_color_${color.color}_image_${imageIndex}`;
            formDataToSend.append('productImages', image, modifiedName);
            imageIndex++;
          });
        });
      });

      const response = await axiosInstance.post('/add-product', formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        MySwal.fire({
          title: 'Product Added!',
          text: `Product "${formData.name}" was successfully added.`,
          icon: 'success',
          confirmButtonClass: 'btn btn-sm btn-primary',
          buttonsStyling: false,
          showCloseButton: true,
          closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
          customClass: { closeButton: 'btn btn-sm btn-icon btn-danger' },
        });
        clearForm();
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError({ submit: 'Failed to add product: ' + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const totalVariants = formData.sizes.reduce((acc, s) => acc + s.colors.length, 0);
  const totalStock = formData.sizes.reduce(
    (acc, s) => acc + s.colors.reduce((ca, c) => ca + (parseInt(c.stock) || 0), 0),
    0
  );

  return (
    <div className="container-fluid mt-4 px-4" style={{ maxWidth: '1200px' }}>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-0 fw-bold">Add New Product</h2>
          <p className="text-muted mb-0 small">Fill in the details below to add a product to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── SECTION 1: Basic Info ── */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-header border-0 py-3 px-4" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 0 0' }}>
            <h5 className="mb-0 fw-semibold">
              <span className="badge bg-primary me-2" style={{ width: '26px', height: '26px', lineHeight: '26px', borderRadius: '50%', fontSize: '12px' }}>1</span>
              Basic Information
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Product Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Classic Cotton T-Shirt" required />
                {error.name && <div className="text-danger small mt-1">{error.name}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Country of Origin</label>
                <input type="text" className="form-control" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="e.g. India" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Old Price (₹)</label>
                <input type="number" className="form-control" name="oldPrice" value={formData.oldPrice} onChange={handleChange} placeholder="0" min="0" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Selling Price (₹) <span className="text-danger">*</span></label>
                <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} placeholder="0" min="0" required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">HSN Code</label>
                <input type="number" className="form-control" name="hsn" value={formData.hsn} onChange={handleChange} placeholder="e.g. 6109" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">SKU</label>
                <input type="number" className="form-control" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. 10012" />
              </div>

              {/* Categories */}
              <div className="col-md-6">
                <label className="form-label fw-medium">Sub Category</label>
                <select className="form-select" name="subcategory" value={formData.subcategory} onChange={handleChange}>
                  <option value="">Select Sub Category</option>
                  {subCategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>{subcategory.subcategoryname}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Main Category</label>
                <input type="text" className="form-control" value={selectedCategory ? selectedCategory.name : ''} disabled placeholder="Auto-filled from sub category" />
                <input type="hidden" name="maincategory" value={formData.maincategory} />
              </div>

              {/* Manufacturer info */}
              <div className="col-md-4">
                <label className="form-label fw-medium">Manufacturer</label>
                <input type="text" className="form-control" name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="Manufacturer name" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Packed By</label>
                <input type="text" className="form-control" name="packedBy" value={formData.packedBy} onChange={handleChange} placeholder="Packed by" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Commodity</label>
                <input type="text" className="form-control" name="commodity" value={formData.commodity} onChange={handleChange} placeholder="Commodity type" />
              </div>

              {/* Dimensions */}
              <div className="col-12">
                <label className="form-label fw-medium text-muted small text-uppercase">Shipping Dimensions</label>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Height (cm)</label>
                <input type="number" className="form-control" name="height" value={formData.height} onChange={handleChange} placeholder="0" min="0" step="0.1" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Width (cm)</label>
                <input type="number" className="form-control" name="width" value={formData.width} onChange={handleChange} placeholder="0" min="0" step="0.1" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Length (cm)</label>
                <input type="number" className="form-control" name="length" value={formData.length} onChange={handleChange} placeholder="0" min="0" step="0.1" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Weight (kg)</label>
                <input type="number" className="form-control" name="weight" value={formData.weight} onChange={handleChange} placeholder="0" min="0" step="0.01" />
              </div>

              {/* Description */}
              <div className="col-md-8">
                <label className="form-label fw-medium">Description</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Product description..." />
              </div>

              {/* Cover Image — OPTIONAL */}
              <div className="col-md-4">
                <label className="form-label fw-medium">
                  Cover Image
                  <span className="badge bg-secondary ms-2" style={{ fontSize: '10px', fontWeight: '400' }}>Optional</span>
                </label>
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center text-center p-3"
                  style={{ minHeight: '120px', borderStyle: 'dashed !important', cursor: 'pointer', borderColor: '#6c757d', borderStyle: 'dashed' }}
                  onClick={() => coverImageRef.current?.click()}
                >
                  {coverImage ? (
                    <>
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Cover preview"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div className="text-muted small mt-1">{coverImage.name}</div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger mt-1"
                        onClick={(e) => { e.stopPropagation(); setCoverImage(null); if (coverImageRef.current) coverImageRef.current.value = null; }}
                      >Remove</button>
                    </>
                  ) : (
                    <>
                      <i className="fa-light fa-cloud-arrow-up fa-2x text-muted mb-2"></i>
                      <div className="text-muted small">Click to upload cover image</div>
                    </>
                  )}
                </div>
                <input type="file" ref={coverImageRef} className="d-none" name="coverImage" accept=".jpg,.jpeg,.png" onChange={handleCoverImageChange} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Colors ── */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-header border-0 py-3 px-4" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 0 0' }}>
            <h5 className="mb-0 fw-semibold">
              <span className="badge bg-primary me-2" style={{ width: '26px', height: '26px', lineHeight: '26px', borderRadius: '50%', fontSize: '12px' }}>2</span>
              Available Colors
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: '260px' }}
                placeholder="e.g. Navy Blue, Red, White"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }}
              />
              <button type="button" className="btn btn-primary px-4" onClick={handleAddColor}>
                <i className="fa-light fa-plus me-1"></i> Add Color
              </button>
            </div>
            {colors.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <span key={index} className="badge d-flex align-items-center gap-1 px-3 py-2" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', fontSize: '13px' }}>
                    <span className="rounded-circle d-inline-block me-1" style={{ width: '10px', height: '10px', background: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : color, border: '1px solid rgba(255,255,255,0.3)' }}></span>
                    {color}
                    <button type="button" className="btn-close btn-close-white ms-1" style={{ width: '8px', height: '8px' }} onClick={() => handleRemoveColor(color)}></button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted small mb-0">No colors added yet. Add colors before adding size variants.</p>
            )}
          </div>
        </div>

        {/* ── SECTION 3: Add Size/Color Variant ── */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-header border-0 py-3 px-4" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 0 0' }}>
            <h5 className="mb-0 fw-semibold">
              <span className="badge bg-primary me-2" style={{ width: '26px', height: '26px', lineHeight: '26px', borderRadius: '50%', fontSize: '12px' }}>3</span>
              Add Size / Color Variant
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-2">
                <label className="form-label fw-medium">Size <span className="text-danger">*</span></label>
                <select className="form-select" name="currentSize" value={currentSize} onChange={handleChange}>
                  <option value="">Select Size</option>
                  {availableSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium">Color <span className="text-danger">*</span></label>
                <select className="form-select" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} disabled={!colors.length}>
                  <option value="">{colors.length ? 'Select a color' : 'Add colors first'}</option>
                  {colors.map((color, index) => <option key={index} value={color}>{color}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-medium">Stock <span className="text-danger">*</span></label>
                <input type="number" className="form-control" placeholder="0" min="0" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">
                  Product Images
                  <span className="badge bg-secondary ms-2" style={{ fontSize: '10px', fontWeight: '400' }}>Optional</span>
                </label>
                <input type="file" className="form-control" multiple accept=".jpg,.jpeg,.png" ref={imageInputRef} onChange={handleFileChange} />
                {currentImages.length > 0 && (
                  <div className="text-muted small mt-1">{currentImages.length} file(s) selected</div>
                )}
              </div>
              <div className="col-md-1">
                <button type="button" className="btn btn-success w-100" onClick={handleAddSize} title="Add variant">
                  <i className="fa-light fa-plus"></i>
                </button>
              </div>
            </div>
            {error.size && (
              <div className="alert alert-danger d-flex align-items-center mt-3 py-2" role="alert">
                <i className="fa-light fa-triangle-exclamation me-2"></i>
                {error.size}
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 4: Variants Table ── */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-header border-0 py-3 px-4 d-flex align-items-center justify-content-between" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 0 0' }}>
            <h5 className="mb-0 fw-semibold">
              <span className="badge bg-primary me-2" style={{ width: '26px', height: '26px', lineHeight: '26px', borderRadius: '50%', fontSize: '12px' }}>4</span>
              Product Variants
            </h5>
            {formData.sizes.length > 0 && (
              <div className="d-flex gap-3">
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  {totalVariants} variant{totalVariants !== 1 ? 's' : ''}
                </span>
                <span className="badge bg-success rounded-pill px-3 py-2">
                  {totalStock} units total
                </span>
              </div>
            )}
          </div>
          <div className="card-body p-0">
            {formData.sizes.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-light fa-layer-group fa-3x text-muted mb-3 d-block"></i>
                <p className="text-muted mb-1">No variants added yet.</p>
                <p className="text-muted small">Use the form above to add size/color combinations.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <th className="px-4 py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Size</th>
                      <th className="py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Color</th>
                      <th className="py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Stock</th>
                      <th className="py-3 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Images</th>
                      <th className="py-3 pe-4 fw-semibold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.sizes.map((size, sizeIndex) =>
                      size.colors.map((color, colorIndex) => (
                        <tr key={`${sizeIndex}-${colorIndex}`}>
                          <td className="px-4 py-3">
                            <span className="badge px-3 py-2" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', fontSize: '13px', borderRadius: '8px' }}>
                              {size.size}
                            </span>
                          </td>
                          <td className="py-3">
                            {editingCell?.sizeIndex === sizeIndex && editingCell?.colorIndex === colorIndex && editingCell?.field === 'color' ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ maxWidth: '130px' }}
                                value={color.color}
                                onChange={(e) => handleTableEdit(sizeIndex, colorIndex, 'color', e.target.value)}
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
                                <span className="rounded-circle d-inline-block flex-shrink-0" style={{ width: '14px', height: '14px', background: color.color.toLowerCase() === 'white' ? '#eee' : color.color.toLowerCase() === 'black' ? '#333' : color.color, border: '1px solid rgba(255,255,255,0.2)' }}></span>
                                {color.color}
                                <i className="fa-light fa-pen text-muted" style={{ fontSize: '11px' }}></i>
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            {editingCell?.sizeIndex === sizeIndex && editingCell?.colorIndex === colorIndex && editingCell?.field === 'stock' ? (
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ maxWidth: '90px' }}
                                value={color.stock}
                                min="0"
                                onChange={(e) => handleTableEdit(sizeIndex, colorIndex, 'stock', e.target.value)}
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
                                <i className="fa-light fa-pen text-muted" style={{ fontSize: '11px' }}></i>
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              {color.images.length > 0 ? (
                                <>
                                  {color.images.slice(0, 3).map((img, imgIdx) => (
                                    <img
                                      key={imgIdx}
                                      src={URL.createObjectURL(img)}
                                      alt={`preview-${imgIdx}`}
                                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                  ))}
                                  {color.images.length > 3 && (
                                    <span className="badge bg-secondary">+{color.images.length - 3}</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted small">No images</span>
                              )}
                              <label className="btn btn-sm btn-outline-secondary mb-0" style={{ cursor: 'pointer', fontSize: '11px' }} title="Change images">
                                <i className="fa-light fa-upload"></i>
                                <input
                                  type="file"
                                  className="d-none"
                                  multiple
                                  accept=".jpg,.jpeg,.png"
                                  onChange={(e) => handleTableImageChange(sizeIndex, colorIndex, e.target.files)}
                                />
                              </label>
                            </div>
                          </td>
                          <td className="py-3 pe-4">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveColorRow(sizeIndex, colorIndex)}
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
        </div>

        {/* ── Submit ── */}
        {error.submit && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fa-light fa-triangle-exclamation me-2"></i>
            {error.submit}
          </div>
        )}
        <div className="d-flex gap-3 justify-content-end mb-5">
          <button type="button" className="btn btn-outline-secondary px-4" onClick={clearForm}>
            <i className="fa-light fa-rotate-left me-2"></i>Clear Form
          </button>
          <button type="submit" className="btn btn-primary px-5" disabled={loading}>
            {loading ? (
              <><Spinner size="sm" className="me-2" />Adding...</>
            ) : (
              <><i className="fa-light fa-plus me-2"></i>Add Product</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;