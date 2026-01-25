import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../../axiosConfig";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Spinner } from "react-bootstrap";

const MySwal = withReactContent(Swal);

const AddCategory = () => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const validateCategoryTitle = (title) => {
    if (!title) return "Category name is required";
    return "";
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCategoryTitle(value);
    setError(validateCategoryTitle(value));
  };

  // ✅ Dropzone file handler
  const onDropSingle = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setCategoryImage(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const {
    getRootProps: getSingleRootProps,
    getInputProps: getSingleInputProps,
    isDragActive: isSingleDragActive,
  } = useDropzone({
    onDrop: onDropSingle,
    multiple: false,
    accept: { "image/*": [] },
  });

  const clearForm = () => {
    setCategoryTitle("");
    setCategoryImage(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateCategoryTitle(categoryTitle);
    if (validationError) {
      setError(validationError);
      return;
    }

    // ✅ Image required because backend expects upload.array('images', 1)
    if (!categoryImage) {
      setError("Category image is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("categoryName", categoryTitle); // ✅ use your controller field name
      formData.append("images", categoryImage); // ✅ MUST be "images"

      const response = await axiosInstance.post("/api/add-category", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        MySwal.fire({
          title: "Category Added!",
          text: `Category "${categoryTitle}" was successfully added.`,
          icon: "success",
        });

        clearForm();
      }
    } catch (err) {
      console.error("Error while adding category:", err);

      if (err.response) {
        if (err.response.status === 409 || err.response.status === 406) {
          setError("Category already exists");
        } else if (err.response.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError(err.response.data?.message || "Error adding category");
        }
      } else {
        setError("Network error: Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
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
                    value={categoryTitle}
                  />
                </div>

                {/* ✅ Image Upload */}
                <div className="col-12">
                  <label className="form-label">Category Image</label>

                  <div
                    {...getSingleRootProps()}
                    className="border p-3 rounded"
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      background: "#f8f9fa",
                    }}
                  >
                    <input {...getSingleInputProps()} />
                    {isSingleDragActive ? (
                      <p>Drop the image here...</p>
                    ) : categoryImage ? (
                      <p>
                        ✅ Selected: <b>{categoryImage.name}</b>
                      </p>
                    ) : (
                      <p>Drag & drop image here, or click to select</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="col-12">
                    <p style={{ fontSize: "12px" }} className="text-danger">
                      {error}
                    </p>
                  </div>
                )}

                <div className="col-12 d-flex justify-content-end">
                  <button className="btn btn-sm btn-primary">
                    Save Category
                  </button>
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
