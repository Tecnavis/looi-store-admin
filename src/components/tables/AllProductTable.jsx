import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axiosInstance from '../../../axiosConfig';
import EditProduct from '../../pages/products/editproduct';
import Swal from 'sweetalert2';

// Per-row component so each row has its own size/color state (fixes shared-state bug)
const ProductRow = ({ data, onEdit, onDelete }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [availableColors, setAvailableColors] = useState([]);

  const handleSizeChange = (e) => {
    const sizeName = e.target.value;
    if (!sizeName) { setSelectedSize(''); setAvailableColors([]); return; }
    const found = data.sizes?.find((s) => s.size === sizeName);
    if (found) { setSelectedSize(found.size); setAvailableColors(found.colors); }
  };

  const handleView = () => {
    Swal.fire({
      title: data.name,
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.7">
          <p><strong>Product ID:</strong> ${data.productId}</p>
          <p><strong>Price:</strong> ₹${data.price}</p>
          <p><strong>Total Stock:</strong> ${data.totalStock}</p>
          <p><strong>Status:</strong> ${data.totalStock > 0 ? '<span style="color:#198754">In Stock</span>' : '<span style="color:#dc3545">Out of Stock</span>'}</p>
          ${data.coverImage ? `<img src="${data.coverImage}" alt="cover" style="width:100px;height:130px;object-fit:cover;border-radius:6px;margin-top:8px;"/>` : ''}
        </div>`,
      confirmButtonText: 'Close',
      confirmButtonColor: '#037fe0',
    });
  };

  return (
    <tr>
      <td><div className="form-check"><input className="form-check-input" type="checkbox" /></div></td>
      <td>
        {data.coverImage
          ? <img src={data.coverImage} alt="Cover" style={{ width: '50px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
          : <span className="text-muted" style={{ fontSize: '12px' }}>No Image</span>}
      </td>
      <td>{data.productId}</td>
      <td>{data.name}</td>
      <td>₹{data.price}</td>
      <td>
        {data.sizes && data.sizes.length > 0
          ? (<select className="form-select form-select-sm" value={selectedSize} onChange={handleSizeChange}>
              <option value="">Select Size</option>
              {data.sizes.map((size, i) => <option key={i} value={size.size}>{size.size}</option>)}
            </select>)
          : <span className="text-muted" style={{ fontSize: '12px' }}>N/A</span>}
      </td>
      <td>
        {availableColors.length > 0
          ? (<select className="form-select form-select-sm">
              <option value="">Select Color</option>
              {availableColors.map((color, i) => (
                <option key={i} value={color.color}>{color.color} (Stock: {color.stock})</option>
              ))}
            </select>)
          : <span className="text-muted" style={{ fontSize: '12px' }}>{selectedSize ? 'No Colors' : '—'}</span>}
      </td>
      <td>{data.totalStock}</td>
      <td>
        {data.totalStock > 0
          ? <span className="badge bg-success">In Stock</span>
          : <span className="badge bg-danger">Out of Stock</span>}
      </td>
      <td>
        <div className="btn-box">
          <button title="View" onClick={handleView}><i className="fa-light fa-eye"></i></button>
          <button title="Edit" onClick={() => onEdit(data)}><i className="fa-light fa-pen"></i></button>
          <button title="Delete" onClick={() => onDelete(data._id)}><i className="fa-light fa-trash"></i></button>
        </div>
      </td>
    </tr>
  );
};

const AllProductTable = () => {
  const [products, setProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get('/get-allproduct', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        setProducts(response.data.products);
      } catch (err) {
        console.log('error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchMainCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get('/get-maincategory', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        setMainCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.log('error fetching main categories', err);
      }
    };
    fetchProducts();
    fetchMainCategories();
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;

  const handleEditButtonClick = (product) => { setSelectedProductId(product._id); setShowEditModal(true); };
  const handleModalClose = () => { setShowEditModal(false); setSelectedProductId(null); };
  const handleProductEdit = (productId, updatedData) => {
    setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, ...updatedData } : p)));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        await axiosInstance.delete(`/delete-product/${id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        setProducts((prev) => prev.filter((p) => p._id !== id));
        Swal.fire({ text: 'Product deleted successfully!', icon: 'success', confirmButtonColor: '#037fe0', showCloseButton: true });
      } catch (err) {
        Swal.fire({ text: 'Error: ' + (err.response ? err.response.data.message : err.message), icon: 'error', confirmButtonColor: '#037fe0' });
      }
    }
  };

  // Helper to read a possibly-populated-or-not maincategory field
  const getMainCategoryId = (p) => {
    if (!p.maincategory) return '';
    return typeof p.maincategory === 'object' ? p.maincategory._id : p.maincategory;
  };

  // ── Apply filters + search + sort (client-side, over the full fetched list) ─
  let filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || getMainCategoryId(p) === categoryFilter;

    const matchesStock =
      !stockFilter ||
      (stockFilter === 'in' && p.totalStock > 0) ||
      (stockFilter === 'out' && p.totalStock <= 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow': return (a.price || 0) - (b.price || 0);
      case 'priceHigh': return (b.price || 0) - (a.price || 0);
      case 'nameAZ': return (a.name || '').localeCompare(b.name || '');
      case 'stockLow': return (a.totalStock || 0) - (b.totalStock || 0);
      case 'newest':
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  const hasActiveFilters = searchTerm || categoryFilter || stockFilter;
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredProducts.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredProducts.length / dataPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="table-filter-option all-products-table-header mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-lg-3 col-md-6 col-12">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent"><i className="fa-light fa-magnifying-glass"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or product ID..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <select
              className="form-select form-select-sm"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Categories</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.mainCategoryName}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <select
              className="form-select form-select-sm"
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Stock</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="stockLow">Stock: Low to High</option>
            </select>
          </div>
          <div className="col-lg-1 col-md-6 col-6">
            {hasActiveFilters && (
              <button className="btn btn-sm btn-outline-secondary w-100" onClick={handleResetFilters} title="Reset filters">
                <i className="fa-light fa-rotate-left"></i> Reset
              </button>
            )}
          </div>
          <div className="col-lg-2 col-md-6 col-12 d-flex justify-content-end align-items-center gap-2">
            <label className="text-muted small mb-0" style={{ whiteSpace: 'nowrap' }}>Show</label>
            <select
              className="form-select form-select-sm"
              style={{ width: '70px' }}
              value={dataPerPage}
              onChange={(e) => { setDataPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <p className="text-muted small mt-2 mb-0">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}
      </div>

      <OverlayScrollbarsComponent>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
          <thead>
            <tr>
              <th className="no-sort"><div className="form-check"><input className="form-check-input" type="checkbox" id="markAllProduct" /></div></th>
              <th>Cover Image</th>
              <th>Product Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Colors &amp; Stock</th>
              <th>Total Stock</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0
              ? (<tr><td colSpan="10" className="text-center py-4 text-muted">
                  {products.length === 0 ? 'No products have been added yet.' : 'No products match the current filters.'}
                </td></tr>)
              : currentData.map((data) => (
                  <ProductRow key={data._id} data={data} onEdit={handleEditButtonClick} onDelete={handleDelete} />
                ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} pageNumbers={pageNumbers} />
      <EditProduct show={showEditModal} handleClose={handleModalClose} productId={selectedProductId} onEdit={handleProductEdit} />
    </>
  );
};

export default AllProductTable;
