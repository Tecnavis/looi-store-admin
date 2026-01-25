import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import Swal from 'sweetalert2'; // Import SweetAlert
import axiosInstance from '../../../../axiosConfig';
import EditCategoryModal from './EditCategory'

const AllCategoryTable = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/get-category', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const list = response?.data?.categories || response?.data || [];
                if (Array.isArray(list)) {
                    setProducts(list);
                } else {
                    setError('No categories found');
                }
            } catch (err) {
                setError('Error fetching categories: ' + (err.response ? err.response.data.message : err.message));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleEditButtonClick = (category) => {
        setCurrentCategory(category);
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        setCurrentCategory(null);
    };

    const handleEdit = (id, updatedName) => {
        setProducts((prev) =>
            prev.map((category) => (category._id === id ? { ...category, name: updatedName } : category))
        );
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-sm btn-danger',
            cancelButtonClass: 'btn btn-sm btn-secondary',
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            const token = localStorage.getItem('token');
            try {
                await axiosInstance.delete(`/delete-category/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setProducts((prev) => prev.filter((category) => category._id !== id)); // Update state

                Swal.fire({
                    text: 'Category deleted successfully!',
                    icon: 'success',
                    confirmButtonClass: 'btn btn-sm btn-primary',
                    buttonsStyling: false,
                    showCloseButton: true,
                    closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
                    customClass: {
                        closeButton: 'btn btn-sm btn-icon btn-danger',
                    },
                });
            } catch (err) {
                console.error('Error deleting category:', err);
                Swal.fire({
                    text: 'Error deleting category: ' + (err.response ? err.response.data.message : err.message),
                    icon: 'error',
                    confirmButtonClass: 'btn btn-sm btn-primary',
                    buttonsStyling: false,
                });
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = products.slice(indexOfFirstData, indexOfLastData);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(products.length / dataPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <OverlayScrollbarsComponent>
                <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped mt-5" id="allProductTable">
                    <thead>
                        <tr>
                            <th className="no-sort">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="markAllProduct" />
                                </div>
                            </th>
                            <th>Main Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    No main categories have been added yet.
                                </td>
                            </tr>
                        ) : (
                        currentData.map((data) => (
                            <tr key={data._id}>
                                <td>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" />
                                    </div>
                                </td>
                                <td>{data.name || 'N/A'}</td>
                                <td>
                                    <div className="btn-box">
                                        <button onClick={() => handleEditButtonClick(data)}>
                                            <i className="fa-light fa-pen"></i>
                                        </button>
                                        <button onClick={() => handleDelete(data._id)}>
                                            <i className="fa-light fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </Table>
            </OverlayScrollbarsComponent>
            {/* Uncomment this to use pagination */}
            {/* <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} /> */}

            {currentCategory && (
                <EditCategoryModal
                    show={modalShow}
                    handleClose={handleCloseModal}
                    category={currentCategory}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
}

export default AllCategoryTable;
