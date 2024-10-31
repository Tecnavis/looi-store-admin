
// import React, { useCallback, useState, useEffect } from 'react';
// import axiosInstance from '../../../axiosConfig'; 
// import { useDropzone } from 'react-dropzone';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const AddMainCategory = () => {
//     const [showThumbnail, setShowThumbnail] = useState(false);
//     const [maincategoriesData, setMaincategoriesData] = useState([]);
//     const [categoryTitle, setCategoryTitle] = useState('');
//     const [selectedMainCategory, setSelectedMainCategory] = useState('');
//     const [categoryTitleError, setCategoryTitleError] = useState('');
//     const [mainCategoryError, setMainCategoryError] = useState('');
    

//   const clearForm = () => {
//     setCategoryTitle('');
//     setSelectedMainCategory('');
//     setError('');
//   };

//     const handleShowThumbnail = () => {
//         setShowThumbnail(!showThumbnail);
//     };

//     const onDropSingle = useCallback((acceptedFiles) => {
//         // Handle the single file upload
//         console.log(acceptedFiles);
//     }, []);

//     const { getRootProps: getSingleRootProps, getInputProps: getSingleInputProps, isDragActive: isSingleDragActive } = useDropzone({ onDrop: onDropSingle });

//     // Fetch main categories from the backend
//     useEffect(() => {
//       const fetchCategories = async () => {
//         const token = localStorage.getItem('token'); // Get the token from localStorage
//         try {
//             const response = await axiosInstance.get('/get-maincategory', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,  // JWT token for Authorization
//                     'Content-Type': 'application/json',  // Set the content type
//                 },
//             });
//             setMaincategoriesData(response.data); // Update the state with fetched categories
//         } catch (err) {
//             console.error('Error fetching main categories:', err);
//         }
//     };

//       fetchCategories();
//   }, []);
  
//   // Validation for categoryTitle while typing
//   const handleCategoryTitleChange = (e) => {
//       const value = e.target.value;
//       setCategoryTitle(value);
//       if (!value) {
//           setCategoryTitleError('Main Category title is required');
//       } else {
//           setCategoryTitleError(''); // Clear error if valid
//       }
//   };

//   // Validation for selectedMainCategory while selecting
//   const handleMainCategoryChange = (e) => {
//       const value = e.target.value;
//       setSelectedMainCategory(value);
//       if (!value) {
//           setMainCategoryError('Please select a category');
//       } else {
//           setMainCategoryError(''); // Clear error if valid
//       }
//   };

//   const handleSubmit = async (e) => {
//       e.preventDefault();

//       // Check for validation before submitting
//       if (!categoryTitle) {
//           setCategoryTitleError('Main Category  is required');
//       }
      
//       if (!selectedMainCategory) {
//           setMainCategoryError('Please select a  category');
//           return;  // Prevent form submission if main category is not selected
//       }

//       const token = localStorage.getItem('token');
//       try {
//           const response = await axiosInstance.post(
//               '/add-category', 
//               {
//                   name: categoryTitle,
//                   maincategoriesData: selectedMainCategory,
//               }, 
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,  
//                   'Content-Type': 'application/json',  
//                 },
//               }
//           );
//           if (response.status === 200) {

//               MySwal.fire({
//           title: 'Main Category Added!',
//           text: `Main Category "${categoryTitle}" was successfully added.`,
//           icon: 'success',
//           confirmButtonClass: 'btn btn-sm btn-primary',
//           buttonsStyling: false,
//           showCloseButton: true,
//           closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
//           customClass: {
//             closeButton: 'btn btn-sm btn-icon btn-danger',
//           },
//         });
//         clearForm();
//           }
//       } catch (err) {
//           console.error('Error adding category:', err);
          
//       }
//   };

//     return (
//         <div className="row align-items-center justify-content-center mt-5">
//             <div className="col-xxl-4 col-md-5">
//                 <div className="panel">
//                     <div className="panel-header">
//                         <h5>Add Main Category</h5>
//                     </div>
//                     <div className="panel-body">
//                         <form onSubmit={handleSubmit}>
//                             <div className="row g-3">
//                                 <div className="col-12 mt-4">
//                                     <label className="form-label">Category</label>
//                                     <select
//                                         className="form-control form-control-sm"
//                                         value={selectedMainCategory}
//                                         onChange={handleMainCategoryChange}
//                                     >
//                                         <option value="">Select</option>
//                                         {maincategoriesData.map((category) => (
//                                             <option key={category._id} value={category._id}>
//                                                 {category.mainCategoryName}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {mainCategoryError && <p style={{fontSize:'12px'}} className="text-danger">{mainCategoryError}</p>}
//                                 </div>
//                                 <div className="col-12 mt-4">
//                                     <label className="form-label">Main Category</label>
//                                     <input
//                                         type="text"
//                                         className="form-control form-control-sm"
//                                         id="categoryTitle"
//                                         value={categoryTitle}
//                                         onChange={handleCategoryTitleChange}
//                                     />
//                                     {categoryTitleError && <p style={{fontSize:'12px'}} className="text-danger">{categoryTitleError}</p>}
//                                 </div>
                                
//                                 <div className="col-12 d-flex justify-content-end">
//                                     <div className="btn-box">
//                                         <button type="submit" className="btn btn-sm btn-primary">
//                                             Save Category
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddMainCategory;



import React, { useCallback, useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig'; 
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AddMainCategory = () => {
    const [showThumbnail, setShowThumbnail] = useState(false);
    const [maincategoriesData, setMaincategoriesData] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [categoryTitleError, setCategoryTitleError] = useState('');
    const [mainCategoryError, setMainCategoryError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    

  const clearForm = () => {
    setCategoryTitle('');
    setSelectedMainCategory('');
    setSelectedFiles([]);
    setPreviewImages([]);
    setError('');
  };

    const handleShowThumbnail = () => {
        setShowThumbnail(!showThumbnail);
    };

    const onDropSingle = useCallback((acceptedFiles) => {
        // Handle the single file upload
        console.log(acceptedFiles);
    }, []);

    const { getRootProps: getSingleRootProps, getInputProps: getSingleInputProps, isDragActive: isSingleDragActive } = useDropzone({ onDrop: onDropSingle });

    // Fetch main categories from the backend
    useEffect(() => {
      const fetchCategories = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        try {
            const response = await axiosInstance.get('/get-maincategory', {
                headers: {
                    Authorization: `Bearer ${token}`,  // JWT token for Authorization
                    'Content-Type': 'application/json',  // Set the content type
                },
            });
            setMaincategoriesData(response.data); // Update the state with fetched categories
        } catch (err) {
            console.error('Error fetching main categories:', err);
        }
    };

      fetchCategories();
  }, []);
  
  // Validation for categoryTitle while typing
  const handleCategoryTitleChange = (e) => {
      const value = e.target.value;
      setCategoryTitle(value);
      if (!value) {
          setCategoryTitleError('Main Category title is required');
      } else {
          setCategoryTitleError(''); // Clear error if valid
      }
  };

  // Validation for selectedMainCategory while selecting
  const handleMainCategoryChange = (e) => {
      const value = e.target.value;
      setSelectedMainCategory(value);
      if (!value) {
          setMainCategoryError('Please select a category');
      } else {
          setMainCategoryError(''); // Clear error if valid
      }
  };

  const handleSubmit = async (e) => {
      const validationErrors = {};
      e.preventDefault();
     
      if (!categoryTitle) validationErrors.categoryTitle = 'Main Category name is required';
      if (!selectedMainCategory) validationErrors.selectedMainCategory = 'Category is required';

    
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', categoryTitle);
      formData.append('maincategoriesData', selectedMainCategory);

      selectedFiles.forEach(file => {
          formData.append('images', file);
      });
      try {
          const response = await axiosInstance.post(
              '/add-category',formData,
             
              {
                headers: {
                  Authorization: `Bearer ${token}`,  
                  'Content-Type': 'multipart/form-data' 
                },
              }
          );
          if (response.status === 200) {

              MySwal.fire({
          title: 'Main Category Added!',
          text: `Main Category "${categoryTitle}" was successfully added.`,
          icon: 'success',
          confirmButtonClass: 'btn btn-sm btn-primary',
          buttonsStyling: false,
          showCloseButton: true,
          closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
          customClass: {
            closeButton: 'btn btn-sm btn-icon btn-danger',
          },
        });
        clearForm();
          }
      } catch (err) {
          console.error('Error adding category:', err);
          
      }
  };
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles);

    const previews = acceptedFiles.map(file =>
        Object.assign(file, {
            preview: URL.createObjectURL(file),
        })
    );
    setPreviewImages(previews);
}, []);

const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
});


    return (
        <div className="row align-items-center justify-content-center mt-5">
            <div className="col-xxl-4 col-md-5">
                <div className="panel">
                    <div className="panel-header">
                        <h5>Add Main Category</h5>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12 mt-4">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-control form-control-sm"
                                        value={selectedMainCategory}
                                        onChange={handleMainCategoryChange}
                                    >
                                        <option value="">Select</option>
                                        {maincategoriesData.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.mainCategoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {mainCategoryError && <p style={{fontSize:'12px'}} className="text-danger">{mainCategoryError}</p>}
                                </div>
                                <div className="col-12 mt-4">
                                    <label className="form-label">Main Category</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="categoryTitle"
                                        value={categoryTitle}
                                        onChange={handleCategoryTitleChange}
                                    />
                                    {categoryTitleError && <p style={{fontSize:'12px'}} className="text-danger">{categoryTitleError}</p>}
                                </div>

                                <div className="col-12 mt-4">
                                    <label className="form-label">Upload Images</label>
                                    <div
                                        {...getRootProps({
                                            className: 'dropzone',
                                            style: {
                                                border: '2px dashed #cccccc',
                                                padding: '20px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                            },
                                        })}
                                    >
                                        <input {...getInputProps()} />
                                        <p>Drag & drop images here, or click to select files</p>
                                    </div>

                                    {/* Preview uploaded images */}
                                    <div className="mt-3">
                                        {previewImages.length > 0 && (
                                            <div className="image-previews">
                                                {previewImages.map((file, index) => (
                                                    <img
                                                        key={index}
                                                        src={file.preview}
                                                        alt="preview"
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            marginRight: '10px',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="col-12 d-flex justify-content-end">
                                    <div className="btn-box">
                                        <button type="submit" className="btn btn-sm btn-primary">
                                            Save Category
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMainCategory;

