
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AllBannerTable from '../../components/tables/banner/AllBannerTable';
import { Spinner } from 'react-bootstrap'; 

const MySwal = withReactContent(Swal);

const AddBanner = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axiosInstance.get('/get-maincategory');
        if (Array.isArray(response.data)) {
          setMainCategories(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching main categories', error);
      }
    };
    setTimeout(() => {
      setLoading(false);  // Set loading to false once setup is done
    }, 1000);

    fetchMainCategories();
  }, []);

  const onDropMultiple = useCallback(async (acceptedFiles) => {
    setValidationError('');
    
    if (!selectedCategory) {
      setValidationError('Please select a category before uploading banners');
      return;
    }

    const formData = new FormData();

    acceptedFiles.forEach(file => {
      formData.append('banners', file);
    });

    // Send as 'category' to match the backend expectation
    formData.append('category', selectedCategory);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axiosInstance.post('/add-banner', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        MySwal.fire({
          title: 'Banner Added!',
          text: 'Banner was successfully added.',
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
    } catch (error) {
      console.error('Error uploading banners', error);
      setUploadStatus(error.response?.data?.message || 'Failed to upload banners');
    }
  }, [selectedCategory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropMultiple,
    multiple: true,
  });

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
    <div className="col-12 mt-5">
      <div className="panel">
        <div className="panel-header">
          <h5>Banner Uploader</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            <div className="col-lg-12 col-md-5">
              <label htmlFor="main-category" className="form-label">Select Main Category</label>
              <select
                id="main-category"
                className={`form-select ${validationError ? 'is-invalid' : ''}`}
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setValidationError('');
                }}
              >
                <option value="">Select a category</option>
                {mainCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.mainCategoryName}
                  </option>
                ))}
              </select>
              {validationError && (
                <div className="invalid-feedback">
                  {validationError}
                </div>
              )}
            </div>

            <div className="col-lg-12 col-md-5">
              <div className="div justify-content-center align-items-center">
                <div className="card">
                  <div className="card-header">Dropzone</div>
                  <div className={`card-body ${isDragActive ? 'dropzone-active' : ''}`} {...getRootProps()}>
                    <form action="/file-upload" className="dropzone dz-component" id="file-manager-upload">
                      <input {...getInputProps()} />
                      <div className="dz-default dz-message">
                        <button className="dz-button" type="button">
                          <i className="fa-light fa-cloud-arrow-up"></i>
                          <span>{isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {uploadStatus && (
                  <div className="alert alert-danger mt-2">
                    {uploadStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AllBannerTable />
    </div>
  );
};

export default AddBanner;