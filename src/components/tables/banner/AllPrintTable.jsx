import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from '../PaginationSection';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AllPrintTable = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/get-print', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Check if response.data.prints exists and is an array
                if (response.data?.prints && Array.isArray(response.data.prints)) {
                    setProducts(response.data.prints);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (err) {
                setError(err.message || 'Error fetching products');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Early return for loading and error states
    if (loading) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                {error}
            </div>
        );
    }

    // Calculate pagination values only if we have products
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = products.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(products.length / dataPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        try {
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
                await axiosInstance.delete(`/delete-print/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                setProducts(prevProducts => prevProducts.filter(product => product._id !== id));

                await Swal.fire({
                    text: 'Banner deleted successfully!',
                    icon: 'success',
                    confirmButtonClass: 'btn btn-sm btn-primary',
                    buttonsStyling: false,
                    showCloseButton: true,
                    closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
                    customClass: {
                        closeButton: 'btn btn-sm btn-icon btn-danger',
                    },
                });
            }
        } catch (err) {
            console.error('Error deleting banner:', err);
            await Swal.fire({
                text: 'Error deleting banner: ' + (err.response?.data?.message || err.message),
                icon: 'error',
                confirmButtonClass: 'btn btn-sm btn-primary',
                buttonsStyling: false,
            });
        }
    };

    // Show message if no products available
    if (products.length === 0) {
        return (
            <div className="alert alert-info m-4" role="alert">
                No prints available.
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <OverlayScrollbarsComponent>
                <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped mt-5" id="allProductTable">
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Banner Image</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((data, index) => (
                            <tr key={data._id}>
                                <td>{indexOfFirstData + index + 1}</td>
                                <td>
                                    <div className="table-product-card">
                                        <div className="part-img">
                                            {data.image ? (
                                                <img
                                                    src={`http://localhost:8000/uploads/${data.image}`}
                                                    alt="Banner Image"
                                                    style={{ width: '100px', height: 'auto', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <p>No Image Available</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="btn-box">
                                        <button 
                                            onClick={() => handleDelete(data._id)}
                                            className="btn btn-sm btn-danger"
                                            title="Delete Banner"
                                        >
                                            <i className="fa-light fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </OverlayScrollbarsComponent>
            {totalPages > 1 && (
                <PaginationSection 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    paginate={paginate} 
                    pageNumbers={pageNumbers} 
                />
            )}
        </div>
    );
}

export default AllPrintTable;