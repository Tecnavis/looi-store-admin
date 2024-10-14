
// import React, { useCallback, useState, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axiosInstance from '../../../axiosConfig';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content'; 

// const MySwal = withReactContent(Swal);

// const AddSubCategory = () => {
//     const [showThumbnail, setShowThumbnail] = useState(false);
//     const [categories, setCategories] = useState([]); 
//     const [mainCategories, setMainCategories] = useState([]);  // For the 'Main Category' dropdown
//     const [categoryTitle, setCategoryTitle] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [selectedMainCategory, setSelectedMainCategory] = useState('');
//     const [errors, setErrors] = useState({}); // Store error messages

//     // Handle thumbnail visibility
//     const handleShowThumbnail = () => {
//         setShowThumbnail(!showThumbnail);
//     };

//     // File upload handler
//     const onDropSingle = useCallback((acceptedFiles) => {
//         console.log(acceptedFiles);
//     }, []);
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onDropSingle });

//     // Fetch categories and main categories from the backend
//     useEffect(() => {
//         const fetchCategories = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const categoriesResponse = await axiosInstance.get('/get-maincategory', {
//                     headers: {
//                         Authorization: `Bearer ${token}`, 
//                         'Content-Type': 'application/json', 
//                     },
//                 });
//                 setCategories(categoriesResponse.data);
                
//                 const mainCategoriesResponse = await axiosInstance.get('/get-category', {
//                     headers: {
//                         Authorization: `Bearer ${token}`, 
//                         'Content-Type': 'application/json', 
//                     },
//                 });
//                 setMainCategories(mainCategoriesResponse.data);
//             } catch (err) {
//                 console.error('Error fetching categories:', err);
//             }
//         };

//         fetchCategories();
//     }, []);

//     // Validate a single field
//     const validateField = (name, value) => {
//         let errorMessage = '';
//         if (name === 'categoryTitle' && !value) {
//             errorMessage = 'Subcategory name is required';
//         }
//         if (name === 'selectedCategory' && !value) {
//             errorMessage = 'Category is required';
//         }
//         if (name === 'selectedMainCategory' && !value) {
//             errorMessage = 'Main category is required';
//         }
//         setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: errorMessage
//         }));
//     };

//     // Handle field value changes and trigger validation
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'categoryTitle') {
//             setCategoryTitle(value);
//         } else if (name === 'selectedCategory') {
//             setSelectedCategory(value);
//         } else if (name === 'selectedMainCategory') {
//             setSelectedMainCategory(value);
//         }
//         validateField(name, value); // Validate as user types
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationErrors = {};
//         if (!categoryTitle) validationErrors.categoryTitle = 'Subcategory name is required';
//         if (!selectedCategory) validationErrors.selectedCategory = 'Category is required';
//         if (!selectedMainCategory) validationErrors.selectedMainCategory = 'Main category is required';

//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         const token = localStorage.getItem('token');
//         try {
//             const response = await axiosInstance.post('/add-subcategory', {
//                 subcategoryname: categoryTitle,
//                 category: selectedCategory,
//                 maincategory: selectedMainCategory,
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,  // Add JWT token here
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.status === 200) {
//                 MySwal.fire({
//                     title: 'Sub Category Added!',
//                     text: `Sub Category "${categoryTitle}" was successfully added.`,
//                     icon: 'success',
//                     confirmButtonClass: 'btn btn-sm btn-primary',
//                     buttonsStyling: false,
//                     showCloseButton: true,
//                     closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
//                     customClass: {
//                       closeButton: 'btn btn-sm btn-icon btn-danger',
//                     },
//                   });
                
//                 setCategoryTitle('');
//                 setSelectedCategory('');
//                 setSelectedMainCategory('');
//                 setErrors({}); // Clear errors on successful submission
//             }
//         } catch (err) {
//             console.error('Error adding subcategory:', err);
//             alert('An error occurred while adding the subcategory');
//         }
//     };

//     return (
//         <div className="row align-items-center justify-content-center mt-5">
//             <div className="col-xxl-4 col-md-5">
//                 <div className="panel">
//                     <div className="panel-header">
//                         <h5>Add New Sub Category</h5>
//                     </div>
//                     <div className="panel-body">
//                         <form onSubmit={handleSubmit}>
//                             <div className="row g-3">
//                                 {/* Category Dropdown */}
//                                 <div className="col-12">
//                                     <label className="form-label">Category</label>
//                                     <select 
//                                         className="form-control form-control-sm" 
//                                         name="selectedCategory"
//                                         value={selectedCategory}
//                                         onChange={handleChange}
//                                     >
//                                         <option value="">Select</option>
//                                         {categories.map((category) => (
//                                             <option key={category._id} value={category._id}>
//                                                 {category.mainCategoryName}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {errors.selectedCategory && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.selectedCategory}</p>}
//                                 </div>

//                                 {/* Main Category Dropdown */}
//                                 <div className="col-12 mt-4">
//                                     <label className="form-label">Main Category</label>
//                                     <select 
//                                         className="form-control form-control-sm" 
//                                         name="selectedMainCategory"
//                                         value={selectedMainCategory}
//                                         onChange={handleChange}
//                                     >
//                                         <option value="">Select</option>
//                                         {mainCategories.map((mainCategory) => (
//                                             <option key={mainCategory._id} value={mainCategory._id}>
//                                                 {mainCategory.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {errors.selectedMainCategory && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.selectedMainCategory}</p>}
//                                 </div>

//                                 {/* Subcategory Name Input */}
//                                 <div className="col-12 mt-4">
//                                     <label className="form-label">Sub Category Name</label>
//                                     <input 
//                                         type="text" 
//                                         className="form-control form-control-sm" 
//                                         name="categoryTitle"
//                                         value={categoryTitle}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.categoryTitle && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.categoryTitle}</p>}
//                                 </div>

//                                 {/* Submit Button */}
//                                 <div className="col-12 d-flex justify-content-end">
//                                     <div className="btn-box">
//                                         <button type="submit" className="btn btn-sm btn-primary">Save Subcategory</button>
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

// export default AddSubCategory;


import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

const AddSubCategory = () => {
    const [categories, setCategories] = useState([]); // Categories like "Top wear"
    const [categoryTitle, setCategoryTitle] = useState(''); // For the new subcategory name
    const [selectedCategory, setSelectedCategory] = useState(''); // Selected category ID
    const [selectedMainCategory, setSelectedMainCategory] = useState(''); // Selected main category ID
    const [availableMainCategories, setAvailableMainCategories] = useState([]); // Main categories for the selected category
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            try {
                const categoriesResponse = await axiosInstance.get('/get-category', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                // Transform the data to be more usable
                const transformedCategories = categoriesResponse.data.map(category => ({
                    _id: category._id,
                    name: category.name,
                    mainCategory: category.maincategoriesData
                }));
                
                setCategories(transformedCategories);
                console.log('Transformed Categories:', transformedCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'selectedCategory') {
            setSelectedCategory(value);
            setSelectedMainCategory(''); // Reset main category when category changes
            
            // Find the selected category and its main category
            const selectedCat = categories.find(cat => cat._id === value);
            if (selectedCat && selectedCat.mainCategory) {
                setAvailableMainCategories([selectedCat.mainCategory]);
            } else {
                setAvailableMainCategories([]);
            }
            
            console.log('Selected Category:', selectedCat);
            console.log('Available Main Categories:', selectedCat ? [selectedCat.mainCategory] : []);
        } else if (name === 'selectedMainCategory') {
            setSelectedMainCategory(value);
        } else if (name === 'categoryTitle') {
            setCategoryTitle(value);
        }
        
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMessage = '';
        if (name === 'categoryTitle' && !value) {
            errorMessage = 'Subcategory name is required';
        }
        if (name === 'selectedCategory' && !value) {
            errorMessage = 'Category is required';
        }
        if (name === 'selectedMainCategory' && !value) {
            errorMessage = 'Main category is required';
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMessage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!categoryTitle) validationErrors.categoryTitle = 'Subcategory name is required';
        if (!selectedCategory) validationErrors.selectedCategory = 'Category is required';
        if (!selectedMainCategory) validationErrors.selectedMainCategory = 'Main category is required';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.post('/add-subcategory', {
                subcategoryname: categoryTitle,
                category: selectedCategory,
                maincategory: selectedMainCategory,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                MySwal.fire({
                    title: 'Sub Category Added!',
                    text: `Sub Category "${categoryTitle}" was successfully added.`,
                    icon: 'success',
                    confirmButtonClass: 'btn btn-sm btn-primary',
                    buttonsStyling: false,
                    showCloseButton: true,
                    closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
                    customClass: {
                      closeButton: 'btn btn-sm btn-icon btn-danger',
                    },
                });
                
                setCategoryTitle('');
                setSelectedCategory('');
                setSelectedMainCategory('');
                setErrors({});
            }
        } catch (err) {
            console.error('Error adding subcategory:', err);
            alert('An error occurred while adding the subcategory');
        }
    };

    return (
        <div className="row align-items-center justify-content-center mt-5">
            <div className="col-xxl-4 col-md-5">
                <div className="panel">
                    <div className="panel-header">
                        <h5>Add New Sub Category</h5>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Category Dropdown */}
                                <div className="col-12">
                                    <label className="form-label">Category</label>
                                    <select 
                                        className="form-control form-control-sm" 
                                        name="selectedCategory"
                                        value={selectedCategory}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.selectedCategory && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.selectedCategory}</p>}
                                </div>

                                {/* Main Category Dropdown */}
                                <div className="col-12 mt-4">
                                    <label className="form-label">Main Category</label>
                                    <select 
                                        className="form-control form-control-sm" 
                                        name="selectedMainCategory"
                                        value={selectedMainCategory}
                                        onChange={handleChange}
                                        disabled={!selectedCategory}
                                    >
                                        <option value="">Select Main Category</option>
                                        {availableMainCategories.map((mainCategory) => (
                                            <option key={mainCategory._id} value={mainCategory._id}>
                                                {mainCategory.mainCategoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.selectedMainCategory && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.selectedMainCategory}</p>}
                                </div>

                                {/* Subcategory Name Input */}
                                <div className="col-12 mt-4">
                                    <label className="form-label">Sub Category Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        name="categoryTitle"
                                        value={categoryTitle}
                                        onChange={handleChange}
                                    />
                                    {errors.categoryTitle && <p className="text-danger" style={{ fontSize: '12px' }}>{errors.categoryTitle}</p>}
                                </div>

                                <div className="col-12 d-flex justify-content-end">
                                    <div className="btn-box">
                                        <button type="submit" className="btn btn-sm btn-primary">Save Subcategory</button>
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

export default AddSubCategory;




