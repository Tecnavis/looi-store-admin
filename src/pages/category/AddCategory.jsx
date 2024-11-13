import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Spinner } from 'react-bootstrap'; 

const MySwal = withReactContent(Swal);

const AddCategory = () => {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [error, setError] = useState('');
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call or other setup tasks
    setTimeout(() => {
      setLoading(false);  // Set loading to false once setup is done
    }, 1000);  // Example delay, replace with actual data fetch or setup logic if needed
  }, []);

  const handleShowThumbnail = () => {
    setShowThumbnail(!showThumbnail);
  };

  const validateCategoryTitle = (title) => {
    if (!title) {
      return 'Category name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(title)) {
      return 'Category name can only contain letters and spaces';
    }
    return '';
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCategoryTitle(value);
    const validationError = validateCategoryTitle(value);
    setError(validationError);
  };

  const onDropSingle = useCallback((acceptedFiles) => {
    // Handle the single file upload
    console.log(acceptedFiles);
  }, []);

  const { getRootProps: getSingleRootProps, getInputProps: getSingleInputProps, isDragActive: isSingleDragActive } = useDropzone({ onDrop: onDropSingle });

  const clearForm = () => {
    setCategoryTitle('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page

    // Validate the category title one more time before submission
    const validationError = validateCategoryTitle(categoryTitle);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');  // Assuming you store JWT in localStorage
      const response = await axiosInstance.post(
        '/main-category', 
        { mainCategoryName: categoryTitle },  // Request body
        { 
          headers: {
            Authorization: `Bearer ${token}`,  // Add JWT token here
            'Content-Type': 'application/json',  // You can add other headers if needed
          },
        }
      );
      
      if (response.status === 200) {
        MySwal.fire({
          title: 'Category Added!',
          text: `Category "${categoryTitle}" was successfully added.`,
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
      console.error('Error while adding category:', err);
      if (err.response) {
        // Check for specific error status code
        if (err.response.status === 409) { // Conflict status for existing category
          setError('Category already exists');
        } else {
          setError('An error occurred while adding the category');
        }
      } else {
        setError('Network error: Please try again later.');
      }
    }
  };
  // Display loader while loading is true
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="row align-items-center justify-content-center mt-5">
      <div className="col-xxl-4 col-md-5">
        <div className="panel">
          <div className="panel-header">
            <h5>Add New Category</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Category Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    id="categoryTitle" 
                    onChange={handleChange} 
                    value={categoryTitle} // Ensure controlled component
                  />
                  {error && <p style={{fontSize:'12px'}} className="text-danger">{error}</p>}
                </div>
                
                <div className="col-12 d-flex justify-content-end">
                  <div className="btn-box">
                    <button className="btn btn-sm btn-primary">Save Category</button>
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

export default AddCategory;
