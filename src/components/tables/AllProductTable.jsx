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
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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
    fetchProducts();
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

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = products.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(products.length / dataPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
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
            {products.length === 0
              ? (<tr><td colSpan="10" className="text-center py-4 text-muted">No products have been added yet.</td></tr>)
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
