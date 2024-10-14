// import React, { useEffect, useState } from 'react';
// import { Table } from 'react-bootstrap';
// import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
// import PaginationSection from './PaginationSection';
// import axiosInstance from '../../../axiosConfig';

// const AllProductTable = () => {
//   const [products, setProducts] = useState([]); // State to hold product data
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dataPerPage] = useState(10);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [selectedSize, setSelectedSize] = useState(''); // State to hold selected size
//   const [availableColors, setAvailableColors] = useState([]); // State to hold colors for selected size

//   // Fetch all products from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await axiosInstance.get('/get-allproduct', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setProducts(response.data.products);
//       } catch (err) {
//         setError('Error fetching products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Handle loading and error states
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   // Pagination logic
//   const indexOfLastData = currentPage * dataPerPage;
//   const indexOfFirstData = indexOfLastData - dataPerPage;
//   const currentData = products.slice(indexOfFirstData, indexOfLastData);

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Calculate total number of pages
//   const totalPages = Math.ceil(products.length / dataPerPage);
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   // Function to calculate total stock
//   const calculateTotalStock = (sizes) => {
//     let totalStock = 0;
//     sizes.forEach((size) => {
//       size.colors.forEach((color) => {
//         totalStock += color.stock; // Add stock for each color
//       });
//     });
//     return totalStock;
//   };

//   // Handle size selection
//   const handleSizeChange = (size, colors) => {
//     setSelectedSize(size); // Update selected size
//     setAvailableColors(colors); // Set available colors for the selected size
//   };

//   return (
//     <>
//       <OverlayScrollbarsComponent>
//         <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
//           <thead>
//             <tr>
//               <th className="no-sort">
//                 <div className="form-check">
//                   <input className="form-check-input" type="checkbox" id="markAllProduct" />
//                 </div>
//               </th>
//               <th>Product Image</th>
//               <th>Product Id</th>
//               <th>Name</th>
//               <th>Price</th>
//               <th>Sizes</th>
//               <th>Colors & Stock</th>
//               <th>Total Stock</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((data) => (
//               <tr key={data._id}>
//                 <td>
//                   <div className="form-check">
//                     <input className="form-check-input" type="checkbox" />
//                   </div>
//                 </td>
//                 <td>
//                   {/* <div className="table-product-card">
//                     <div className="part-img">
//                       {data && data.images && data.images.length > 0 ? (
//                         data.images.map((item, index) => (
//                           <img
//                             key={index}
//                             src={`http://localhost:8000/uploads/${item}`}
//                             alt={`Product Image ${index}`}
//                           />
//                         ))
//                       ) : (
//                         <p>No Image Available</p>
//                       )}
//                     </div>
//                   </div> */}

//                   {data.coverImage ? (
//                     <img
//                       src={`http://localhost:8000/uploads/${data.coverImage}`}
//                       alt="Cover Image"
//                       style={{ width: '50px', height: '80px' }} // Adjust size as needed
//                     />
//                   ) : (
//                     <p>No Cover Image Available</p>
//                   )}

//                 </td>
//                 <td>{data.productId}</td>
//                 <td>{data.name}</td>
//                 <td>${data.price}</td>
//                 <td>
//                   {/* Dropdown for sizes */}
//                   {data.sizes && data.sizes.length > 0 ? (
//                     <select
//                       className="form-select"
//                       onChange={(e) => {
//                         const selectedSize = data.sizes.find(size => size.size === e.target.value);
//                         handleSizeChange(selectedSize.size, selectedSize.colors); // Update selected size and colors
//                       }}
//                     >
//                       <option value="">Select Size</option>
//                       {data.sizes.map((size, sizeIndex) => (
//                         <option key={sizeIndex} value={size.size}>
//                           {size.size}
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <p>No Sizes Available</p>
//                   )}
//                 </td>
//                 <td>
//                   {/* Dropdown for colors based on selected size */}
//                   {availableColors.length > 0 ? (
//                     <select className="form-select">
//                       <option value="">Select Color</option>
//                       {availableColors.map((color, colorIndex) => (
//                         <option key={colorIndex} value={color.color}>
//                           {color.color} (Stock: {color.stock})
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <p>No Colors Available</p>
//                   )}
//                 </td>
//                 <td>{calculateTotalStock(data.sizes)}</td> {/* Calculate and display total stock */}
//                 <td>
//                   <div className="btn-box">
//                     <button>
//                       <i className="fa-light fa-eye"></i>
//                     </button>
//                     <button>
//                       <i className="fa-light fa-pen"></i>
//                     </button>
//                     <button>
//                       <i className="fa-light fa-trash"></i>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </OverlayScrollbarsComponent>
//       <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />
//     </>
//   );
// };

// export default AllProductTable;


import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axiosInstance from '../../../axiosConfig';
import EditProduct from '../../pages/products/editproduct';
import Swal from 'sweetalert2'; // Import SweetAlert

const AllProductTable = () => {
  const [products, setProducts] = useState([]); // State to hold product data
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedSize, setSelectedSize] = useState(''); // State to hold selected size
  const [availableColors, setAvailableColors] = useState([]); // State to hold colors for selected size
  const [modalShow, setModalShow] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);


  // Fetch all products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get('/get-allproduct', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProducts(response.data.products);
      } catch (err) {
        // setError('Error fetching products');
        console.log('error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

   // Handle edit button click
   const handleEditButtonClick = (product) => {
    setSelectedProductId(product._id);
    setShowEditModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedProductId(null);
  };

  // Handle successful edit
  const handleProductEdit = (productId, updatedData) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? { ...product, ...updatedData } : product
      )
    );
  };


  

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = products.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(products.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle size selection
  const handleSizeChange = (size, colors) => {
    setSelectedSize(size); // Update selected size
    setAvailableColors(colors); // Set available colors for the selected size
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
            await axiosInstance.delete(`/delete-product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setProducts((prev) => prev.filter((category) => category._id !== id)); // Update state

            Swal.fire({
                text: 'Product deleted successfully!',
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

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="markAllProduct" />
                </div>
              </th>
              <th>Cover Image</th>
              {/* <th>Product Images</th> */}
              <th>Product Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Colors & Stock</th>
              <th>Total Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No products have been added yet.
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
                  <td>
                    {data.coverImage ? (
                      <img
                        src={`http://localhost:8000/uploads/${data.coverImage}`}
                        alt="Cover Image"
                        style={{ width: '50px', height: '80px' }} // Adjust size as needed
                      />
                    ) : (
                      <p>No Cover Image Available</p>
                    )}
                  </td>
                  {/* <td>
                    {data.sizes.map((size) =>
                      size.colors.map((color, colorIndex) => (
                        <div key={colorIndex}>
                          {color.images.map((image, imageIndex) => (
                            <img
                              key={imageIndex}
                              src={`http://localhost:8000/uploads/${image}`}
                              alt={`Product Image ${imageIndex}`}
                              style={{ width: '50px', height: '80px' }} // Adjust size as needed
                            />
                          ))}
                        </div>
                      ))
                    )}
                  </td> */}
                  <td>{data.productId}</td>
                  <td>{data.name}</td>
                  <td>${data.price}</td>
                  <td>
                   {/* Dropdown for sizes */}
                   {data.sizes && data.sizes.length > 0 ? (
                     <select
                     className="form-select"
                      onChange={(e) => {
                        const selectedSize = data.sizes.find(size => size.size === e.target.value);
                        handleSizeChange(selectedSize.size, selectedSize.colors); // Update selected size and colors
                      }}
                    >
                      <option value="">Select Size</option>
                      {data.sizes.map((size, sizeIndex) => (
                        <option key={sizeIndex} value={size.size}>
                          {size.size}
                       </option>                      ))}
                     </select>
                   ) : (
                    <p>No Sizes Available</p>
                  )}
                </td>
                <td>
                   {/* Dropdown for colors based on selected size */}
                   {availableColors.length > 0 ? (
                    <select className="form-select">
                      <option value="">Select Color</option>
                      {availableColors.map((color, colorIndex) => (
                        <option key={colorIndex} value={color.color}> {color.color} (Stock: {color.stock})
                        </option>
                      ))}
                    </select>                   ) : (
                    <p>No Colors Available</p>
                  )}
                </td>
                
                  <td>{data.totalStock}</td>
                                   <td>
                  <div className="btn-box">
                    <button><i className="fa-light fa-eye"></i>
                     </button>
                     <button>
                       <i className="fa-light fa-pen" onClick={() => handleEditButtonClick(data)}></i>
                     </button>
                     <button onClick={() => handleDelete(data._id)}>
                       <i className="fa-light fa-trash"></i>
                    </button>
                  </div>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
     <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />

     <EditProduct
  show={showEditModal}
  handleClose={handleModalClose}
  productId={selectedProductId}
  onEdit={handleProductEdit}
/>
    
    </>
  );
};

export default AllProductTable;


