import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AllAdBannerTable from '../../components/tables/banner/AllAdBannerTable';
import AllPrintTable from '../../components/tables/banner/AllPrintTable';
const MySwal = withReactContent(Swal);

const AddPrints = () => {
  const [uploadStatus, setUploadStatus] = useState('');

  const onDropMultiple = useCallback(async (acceptedFiles) => {
    const formData = new FormData();

    acceptedFiles.forEach(file => {
      formData.append('banners', file);
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axiosInstance.post('/add-print', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
     
      if (response.status === 200) {
        MySwal.fire({
          title: 'Print Added!',
          text: 'Print was successfully added.',
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
      window.location.reload();
    } catch (error) {
      console.error('Error uploading prints', error);
      setUploadStatus(error.response?.data?.message || 'Failed to upload prints');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropMultiple,
    multiple: true,
  });

  return (
    <div className="col-12 mt-5">
      <div className="panel">
        <div className="panel-header">
          <h5>Add Prints</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
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
    <AllPrintTable/>
    </div>
  );
};

export default AddPrints;
