
// import React, { useState, useEffect, useRef } from 'react';
// import axiosInstance from '../../../axiosConfig';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);
// const AddProduct = () => {
//   const [availableSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);
//   const [formData, setFormData] = useState({
//     // productId:'',
//     name: '',
//     oldPrice: '',
//     price: '',
//     sizes: [],
//     description: '',
//     countryOfOrigin: '',
//     manufacturer: '',
//     packedBy: '',
//     commodity: '',
   
//     currentColor: "",
//     maincategory: '',
//     subcategory: '',
//     coverImage: '',
//   });

//   const [mainCategories, setMainCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState({});
//   const [currentSize, setCurrentSize] = useState('');
//   const [currentColor, setCurrentColor] = useState('');
//   const [currentStock, setCurrentStock] = useState();
//   const [currentImages, setCurrentImages] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [coverImage, setCoverImage] = useState(null);
//   const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const imageInputRef = useRef();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const categoriesResponse = await axiosInstance.get('/get-subcategory', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setSubCategories(categoriesResponse.data);

//         const mainCategoriesResponse = await axiosInstance.get('/get-category', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setMainCategories(mainCategoriesResponse.data);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//         setError((prev) => ({ ...prev, fetch: 'Error fetching categories' }));
//       }
//     };
//     fetchCategories();

//   }, []);

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;

//   //   if (name === 'currentSize') {
//   //     setCurrentSize(value);
//   //   } else {
//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       [name]: value,
//   //     }));
//   //   }
//   // };
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'currentSize') {
//       setCurrentSize(value);
//     } else if (name === 'subcategory') {
//       // Handle subcategory selection
//       const selectedSubcategory = subCategories.find(sub => sub._id === value);

//       if (selectedSubcategory) {
//         // Set the category data
//         setSelectedCategory(selectedSubcategory.category);

//         // Update formData
//         setFormData(prev => ({
//           ...prev,
//           subcategory: value,
//           maincategory: selectedSubcategory.category.maincategoriesData
//         }));
//       } else {
//         setSelectedCategory(null);
//         setFormData(prev => ({
//           ...prev,
//           subcategory: value,
//           maincategory: ''
//         }));
//       }
//     } else {
//       // Handle all other form fields
//       setFormData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
  

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     setCoverImage(file);
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setCurrentImages(files);
//   };

//   const handleAddSize = () => {
//     if (currentSize && currentColor && currentStock > 0 && currentImages.length > 0) {
//       console.log('Adding size/color. Current images:', currentImages);
//       setFormData((prev) => {
//         const existingSizeIndex = prev.sizes.findIndex(s => s.size === currentSize);
//         const newData = existingSizeIndex !== -1
//           ? {
//             ...prev,
//             sizes: prev.sizes.map((size, index) =>
//               index === existingSizeIndex
//                 ? {
//                   ...size,
//                   colors: [
//                     ...size.colors,
//                     {
//                       color: currentColor,
//                       stock: currentStock,
//                       images: [...currentImages]
//                     }
//                   ]
//                 }
//                 : size
//             )
//           }
//           : {
//             ...prev,
//             sizes: [
//               ...prev.sizes,
//               {
//                 size: currentSize,
//                 colors: [{
//                   color: currentColor,
//                   stock: currentStock,
//                   images: [...currentImages]
//                 }]
//               }
//             ]
//           };
//         console.log('New form data:', JSON.stringify(newData, null, 2));
//         return newData;
//       });
//       setCurrentSize('');
//       setCurrentColor('');
//       setCurrentStock('');
//       setCurrentImages([]);
//       if (imageInputRef.current) {
//         imageInputRef.current.value = null;
//       }
//     } else {
//       setError({ size: 'Please fill all fields for size, color, stock, and upload at least one image.' });
//     }
//   };

//   const clearForm = () => {
//     setFormData({
//       // productId: '',
//       name: '',
//       oldPrice: '',
//       price: '',
//       sizes: [],
//       description: '',
//       countryOfOrigin: '',
//       manufacturer: '',
//       packedBy: '',
//       commodity: '',
//       maincategory: '',
//       subcategory: '',
//       // coverImage: null,
//     });
//     setCurrentSize('');
//     setCurrentColor('');
//     setCurrentStock('');
//     setCurrentImages([]);
//     setCoverImage(null);
//     setColors([]);

//     if (imageInputRef.current) {
//       imageInputRef.current.value = null;
//     }

//     setError({});

//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError({});

//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const formDataToSend = new FormData();



//       // Append basic product information
//       Object.keys(formData).forEach(key => {
//         if (key !== 'sizes') {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       // Append the cover image
//       if (coverImage) {
//         formDataToSend.append('coverImage', coverImage);
//       }

//       // In handleSubmit method
//       formDataToSend.append('dimensions', JSON.stringify(formData.dimensions));

//       // Log the sizes data before processing
//       console.log('Sizes data before processing:', JSON.stringify(formData.sizes, null, 2));

//       // Append sizes as JSON string (without images)
//       const sizesData = formData.sizes.map(size => ({
//         size: size.size,
//         colors: size.colors.map(color => ({
//           color: color.color,
//           stock: color.stock,
//           imageCount: color.images.length  // Send image count instead of names
//         }))
//       }));
//       formDataToSend.append('sizes', JSON.stringify(sizesData));

//       // Append all images with modified names
//       let imageIndex = 0;
//       formData.sizes.forEach((size) => {
//         size.colors.forEach((color) => {
//           console.log(`Processing size ${size.size}, color ${color.color}. Images:`, color.images);
//           color.images.forEach((image) => {
//             const modifiedName = `size_${size.size}_color_${color.color}_image_${imageIndex}`;
//             formDataToSend.append('productImages', image, modifiedName);
//             console.log(`Appended image: ${modifiedName}`);
//             imageIndex++;
//           });
//         });
//       });

//       // Log the FormData contents
//       for (let [key, value] of formDataToSend.entries()) {
//         console.log(key, value);
//       }

//       const response = await axiosInstance.post('/add-product', formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         MySwal.fire({
//           title: 'Product Added!',
//           text: `Product "${formData.name}" was successfully added.`,
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
//       }


//     } catch (err) {
//       console.error('Error adding product:', err);
//       setError({ submit: 'Failed to add product: ' + (err.response?.data?.message || err.message) });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h1 className="mb-4">Add Product</h1>
//       <form onSubmit={handleSubmit}>

//         <div className="top-div p-5" style={{ border: '1px solid grey', borderRadius: '10px' }}>

//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Product Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               {error.name && <div className="text-danger">{error.name}</div>}
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Country of Origin</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="countryOfOrigin"
//                 value={formData.countryOfOrigin}
//                 onChange={handleChange}
//               />
//               {error.countryOfOrigin && <div className="text-danger">{error.countryOfOrigin}</div>}
//             </div>
//             <div className="col-md-6 mb-3 ">
//               <label className="form-label">Old Price</label>
//               <input
//                 type="number"
//                 className="form-control w-100"
//                 name="oldPrice"
//                 value={formData.oldPrice}
//                 onChange={handleChange}
//               />
//               {error.oldPrice && <div className="text-danger">{error.oldPrice}</div>}
//             </div>
//             <div className="col-md-6 mb-3 ">
//               <label className="form-label ">New Price</label>
//               <input
//                 type="number"
//                 className="form-control w-100"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//               />
//               {error.price && <div className="text-danger">{error.price}</div>}
//             </div>
//             {/* <div className="col-md-6 mb-3 ">
//               <label className="form-label ">Hsn</label>
//               <input
//                 type="number"
//                 className="form-control w-100"
//                 name="hsn"
//                 value={formData.hsn}
//                 onChange={handleChange}
//               />
//               {error.hsn && <div className="text-danger">{error.hsn}</div>}
//             </div>
//             <div className="col-md-6 mb-3 ">
//               <label className="form-label ">Sku</label>
//               <input
//                 type="number"
//                 className="form-control w-100"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//               />
//               {error.sku && <div className="text-danger">{error.sku}</div>}
//             </div>

//             <input name="height" placeholder="Height" value={formData.dimensions.height} onChange={handleDimensionChange} required />
//             <input name="width" placeholder="Width" value={formData.dimensions.width} onChange={handleDimensionChange} required />
//             <input name="length" placeholder="Length" value={formData.dimensions.length} onChange={handleDimensionChange} required />
//             <input name="weight" placeholder="Weight" value={formData.dimensions.weight} onChange={handleDimensionChange} required /> */}
//           </div>


//           {/* <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Sub Category</label>
//               <select
//                 className="form-select"
//                 name="subcategory"
//                 value={formData.subcategory}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Sub Category</option>
//                 {subCategories.map((subcategory) => (
//                   <option key={subcategory._id} value={subcategory._id}>{subcategory.subcategoryname}</option>
//                 ))}
//               </select>
//               {error.subcategory && <div className="text-danger">{error.subcategory}</div>}
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Main Category</label>
//               <select
//                 className="form-select"
//                 name="maincategory"
//                 value={formData.maincategory}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Main Category</option>
//                 {mainCategories.map((category) => (
//                   <option key={category._id} value={category._id}>{category.name}</option>
//                 ))}
//               </select>
//               {error.maincategory && <div className="text-danger">{error.maincategory}</div>}
//             </div>


//           </div> */}
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Sub Category</label>
//               <select
//                 className="form-select"
//                 name="subcategory"
//                 value={formData.subcategory}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Sub Category</option>
//                 {subCategories.map((subcategory) => (
//                   <option key={subcategory._id} value={subcategory._id}>
//                     {subcategory.subcategoryname}
//                   </option>
//                 ))}
//               </select>
//               {error.subcategory && <div className="text-danger">{error.subcategory}</div>}
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Main Category</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={selectedCategory ? selectedCategory.name : ''}
//                 disabled
//               />
//               {/* Hidden input to store the actual maincategory value */}
//               <input
//                 type="hidden"
//                 name="maincategory"
//                 value={formData.maincategory}
//               />
//               {error.maincategory && <div className="text-danger">{error.maincategory}</div>}
//             </div>
//           </div>

//           <div className="row">

//             <div className="col-md-6 mb-3">
//               <label className="form-label">Manufacturer</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="manufacturer"
//                 value={formData.manufacturer}
//                 onChange={handleChange}
//               />
//               {error.manufacturer && <div className="text-danger">{error.manufacturer}</div>}
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Packed By</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="packedBy"
//                 value={formData.packedBy}
//                 onChange={handleChange}
//               />
//               {error.packedBy && <div className="text-danger">{error.packedBy}</div>}
//             </div>

//           </div>

//           <div className="row">

//             <div className="col-md-6 mb-3">
//               <label className="form-label">Commodity</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="commodity"
//                 value={formData.commodity}
//                 onChange={handleChange}
//               />
//               {error.commodity && <div className="text-danger">{error.commodity}</div>}
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Cover Image</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 name="coverImage"
//                 onChange={handleCoverImageChange}
//                 ref={imageInputRef}
//               />
//             </div>
//           </div>

//           <div className="row align-items-center">
//             {/* Color Input and Button */}


//             {/* Description Textarea */}
//             <div className="col-md-6">
//               <label className="form-label">Description</label>
//               <textarea
//                 className="form-control"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//               {error.description && <div className="text-danger">{error.description}</div>}
//             </div>

//             <div className="col-md-6 mt-3 d-flex">
//               <div className="me-2 flex-grow-1">
//                 <label className="form-label">Add Color</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={currentColor}
//                   onChange={(e) => setCurrentColor(e.target.value)}
//                 />
//               </div>
//               <div className="mt-auto">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={() => {
//                     if (currentColor && !colors.includes(currentColor)) {
//                       setColors([...colors, currentColor]); // Add the new color
//                       setCurrentColor(''); // Clear the input after adding
//                     }
//                   }}
//                 >
//                   Add Color
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>

//         <div className="mb-3 mt-5">
//           <div className="top-div p-5" style={{ border: '1px solid grey', borderRadius: '10px' }}>

//             <h5 className='text-center'>Add Size, Color, Stock, and Images</h5>
//             <div className="row mt-4">
//               <div className="col-md-3 mb-2">
//                 {/* <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Size"
//                 value={currentSize}
//                 onChange={(e) => setCurrentSize(e.target.value)}
//               /> */}
//                 <select
//                   className="form-select"
//                   name="currentSize"
//                   value={currentSize}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Size</option>
//                   {availableSizes.map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* <div className="col-md-3 mb-2">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Color"
//                 value={currentColor}
//                 onChange={(e) => setCurrentColor(e.target.value)}
//               />

//             </div> */}
//               <div className="col-md-2 mb-2">
//                 {/* <label className="form-label">Select Color</label> */}
//                 <select
//                   className="form-control"
//                   value={currentColor}
//                   onChange={(e) => setCurrentColor(e.target.value)}
//                   disabled={!colors.length}
//                 >
//                   <option value="">Select a color</option>
//                   {colors.map((color, index) => (
//                     <option key={index} value={color}>{color}</option>
//                   ))}
//                 </select>
//               </div>


//               <div className="col-md-2 mb-2">
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="Stock"
//                   value={currentStock}
//                   onChange={(e) => setCurrentStock(parseInt(e.target.value))}
//                 />
//               </div>
//               <div className="col-md-4 mb-2">
//                 <input
//                   type="file"
//                   className="form-control"
//                   multiple
//                   accept=".jpg, .jpeg, .png" // Specify allowed file types
//                   ref={imageInputRef}
//                   onChange={handleFileChange}
//                 />

//               </div>
//             </div>
//             <div className="div text-center mt-4"><button type="button" className="btn btn-secondary " onClick={handleAddSize}>Add Size/Color</button>
//             </div>
//             {error.size && <div className="text-danger mt-2">{error.size}</div>}
//           </div>


//           <div className="mb-3 mt-2">
//             <h5>Added Sizes/Colors:</h5>
//             {formData.sizes.length > 0 ? (
//               formData.sizes.map((size, sizeIndex) => (
//                 <div key={sizeIndex} className="size-section mb-2 p-2 border border-primary rounded">
//                   <strong>Size:</strong> {size.size}
//                   <div className="color-section mt-1">
//                     {size.colors.map((color, colorIndex) => (
//                       <div key={colorIndex} className="color-item p-2 mb-2 border border-secondary rounded">
//                         <strong>Color:</strong> {color.color},
//                         <strong> Stock:</strong> {color.stock},
//                         <strong> Images:</strong> {color.images.length}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div>No sizes or colors added yet.</div>
//             )}
//             {error.sizes && <div className="text-danger">{error.sizes}</div>}
//           </div>

//           <div className="div m-4 text-center "> <button type="submit" className="btn btn-primary " disabled={loading}>
//             {loading ? 'Adding Product...' : 'Add Product'}
//           </button></div>

//           {error.submit && <div className="text-danger mt-2">{error.submit}</div>}
//         </div>
//       </form>
//     </div>


//   );
// };

// export default AddProduct;



// modifued add ksu,hsn

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
    maincategory: '',
    subcategory: '',
  });

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [currentSize, setCurrentSize] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentStock, setCurrentStock] = useState();
  const [currentImages, setCurrentImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const imageInputRef = useRef();

  // 🔥 Cloudinary Upload
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://looi-store-server-izvs.onrender.com/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) throw new Error("Upload failed");

    return data.url;
  };

  const uploadMultipleImages = async (images) => {
    return await Promise.all(images.map(img => uploadImageToCloudinary(img)));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');

      const res = await axiosInstance.get('/get-subcategory', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubCategories(res.data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'currentSize') {
      setCurrentSize(value);
    } else if (name === 'subcategory') {
      const selected = subCategories.find(sub => sub._id === value);

      setSelectedCategory(selected?.category || null);

      setFormData(prev => ({
        ...prev,
        subcategory: value,
        maincategory: selected?.category?.maincategoriesData || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setCurrentImages(Array.from(e.target.files));
  };

  const handleAddSize = () => {
    if (!currentSize || !currentColor || !currentStock || !currentImages.length) {
      return setError({ size: "Fill all fields" });
    }

    setFormData(prev => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          size: currentSize,
          colors: [{
            color: currentColor,
            stock: currentStock,
            images: [...currentImages]
          }]
        }
      ]
    }));

    setCurrentSize('');
    setCurrentColor('');
    setCurrentStock('');
    setCurrentImages([]);
    imageInputRef.current.value = null;
  };

  const clearForm = () => {
    setFormData({ name: '', price: '', sizes: [] });
    setCoverImage(null);
  };

  // ✅ FINAL SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      let coverImageUrl = "";
      if (coverImage) {
        coverImageUrl = await uploadImageToCloudinary(coverImage);
      }

      const updatedSizes = [];

      for (let size of formData.sizes) {
        const updatedColors = [];

        for (let color of size.colors) {
          const urls = await uploadMultipleImages(color.images);

          updatedColors.push({
            color: color.color,
            stock: color.stock,
            images: urls,
          });
        }

        updatedSizes.push({ size: size.size, colors: updatedColors });
      }

      const productData = {
        ...formData,
        coverImage: coverImageUrl,
        sizes: updatedSizes,
      };

      await axiosInstance.post('/add-product', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      MySwal.fire("Success", "Product Added", "success");
      clearForm();

    } catch (err) {
      console.error(err);
      setError({ submit: "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mt-4">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Product Name" />
        <input name="price" onChange={handleChange} placeholder="Price" />

        <input type="file" onChange={handleCoverImageChange} />

        <select onChange={(e) => setCurrentColor(e.target.value)}>
          <option>Select Color</option>
          {colors.map((c, i) => <option key={i}>{c}</option>)}
        </select>

        <input type="file" multiple ref={imageInputRef} onChange={handleFileChange} />

        <button type="button" onClick={handleAddSize}>Add Size</button>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;