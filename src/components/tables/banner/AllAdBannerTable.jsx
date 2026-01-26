// import React, { useEffect, useState } from 'react';
// import { Table } from 'react-bootstrap';
// import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
// import PaginationSection from '../PaginationSection';
// import axiosInstance from '../../../../axiosConfig';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content'; 

// const MySwal = withReactContent(Swal);

// const AllAdBannerTable = () => {
//     const [products, setProducts] = useState([]); // State to hold product data
//     const [currentPage, setCurrentPage] = useState(1);
//     const [dataPerPage] = useState(10);
//     const [loading, setLoading] = useState(true); // Loading state
//     const [error, setError] = useState(null); // Error state

//     // Fetch all products from the API
//     useEffect(() => {
//         const fetchProducts = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axiosInstance.get('/get-adbanner', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 setProducts(response.data.banners);
//             } catch (err) {
//                 setError('Error fetching products');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, []);

//     // Handle loading and error states
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     // Pagination logic
//     const indexOfLastData = currentPage * dataPerPage;
//     const indexOfFirstData = indexOfLastData - dataPerPage;
//     const currentData = products.slice(indexOfFirstData, indexOfLastData);

//     const paginate = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     // Calculate total number of pages
//     const totalPages = Math.ceil(products.length / dataPerPage);
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//     }

//     const handleDelete = async (id) => {
//         const result = await Swal.fire({
//             title: 'Are you sure?',
//             text: 'You won’t be able to revert this!',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'No, cancel!',
//             confirmButtonClass: 'btn btn-sm btn-danger',
//             cancelButtonClass: 'btn btn-sm btn-secondary',
//             buttonsStyling: false,
//         });
      

//         if (result.isConfirmed) {
//             const token = localStorage.getItem('token');
//             try {
//                 await axiosInstance.delete(`/delete-banner/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });
//                 setProducts(products.filter(product => product._id !== id));

//                 Swal.fire({
//                     text: 'Banner deleted successfully!',
//                     icon: 'success',
//                     confirmButtonClass: 'btn btn-sm btn-primary',
//                     buttonsStyling: false,
//                     showCloseButton: true,
//                     closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
//                     customClass: {
//                         closeButton: 'btn btn-sm btn-icon btn-danger',
//                     },
//                 });
//             } catch (err) {
//                 console.error('Error deleting subcategory:', err);
//                 Swal.fire({
//                     text: 'Error deleting subcategory: ' + (err.response ? err.response.data.message : err.message),
//                     icon: 'error',
//                     confirmButtonClass: 'btn btn-sm btn-primary',
//                     buttonsStyling: false,
//                 });
//             }
//         }
//     };

  

//     return (
//         <>
//             <OverlayScrollbarsComponent>
//                 <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped mt-5" id="allProductTable">
//                     <thead>
//                         <tr>
//                             <th>Sl. No</th>
                         
//                             <th>Banner Image</th>
//                             <th>Created Date</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentData.map((data, index) => (
//                             <tr key={data._id}>
//                                 <td>{indexOfFirstData + index + 1}</td>
//                                 <td>{data.categoryName
//                                 }</td>
//                                 <td>
//                                     <div className="table-product-card">
//                                         <div className="part-img">
//                                             {data.images.length > 0 ? (
//                                                 data.images.map((item, imgIndex) => (
//                                                     <img
//                                                         key={imgIndex}
//                                                         src={`http://localhost:8000/uploads/${item[0]}`}
//                                                         alt={`Banner Image ${imgIndex}`}
//                                                         style={{ width: '100px', height: 'auto', objectFit: 'contain' }}
//                                                     />
//                                                 ))
//                                             ) : (
//                                                 <p>No Image Available</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td>{new Date(data.createdAt).toLocaleDateString()}</td>
//                                 <td>
//                                     <div className="btn-box">
//                                         <button onClick={() => handleDelete(data._id)}>
//                                             <i className="fa-light fa-trash"></i>
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </OverlayScrollbarsComponent>
//             <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />
//         </>
//     );
// }

// export default AllAdBannerTable;


import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from '../PaginationSection';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const BASE_URL = import.meta.env.VITE_BASE_URL || process.env.REACT_APP_BASE_URL || 'https://looi-store-server-ypdx.onrender.com'


const AllAdBannerTable = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/get-adbanner', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setProducts(response.data.banners);
            } catch (err) {
                setError('Error fetching products');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = products.slice(indexOfFirstData, indexOfLastData);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(products.length / dataPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
                await axiosInstance.delete(`/delete-adbanner/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setProducts(products.filter(product => product._id !== id));

                Swal.fire({
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
            } catch (err) {
                console.error('Error deleting banner:', err);
                Swal.fire({
                    text: 'Error deleting banner: ' + (err.response ? err.response.data.message : err.message),
                    icon: 'error',
                    confirmButtonClass: 'btn btn-sm btn-primary',
                    buttonsStyling: false,
                });
            }
        }
    };

    return (
        <>
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
                                                    src={data.image}
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
                                        <button onClick={() => handleDelete(data._id)}>
                                            <i className="fa-light fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </OverlayScrollbarsComponent>
            <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />
        </>
    );
}

export default AllAdBannerTable;