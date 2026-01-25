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
  const [mainCategories, setMainCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ Load main categories (backend has /get-maincategory)
  useEffect(() => {
    const loadMainCategories = async () => {
      try {
        const res = await axiosInstance.get("/get-maincategory");
        setMainCategories(res.data || []);
      } catch (err) {
        console.error("Main category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMainCategories();
  }, []);

  const validateForm = () => {
    if (!categoryTitle.trim()) return "Category name is required";
    if (!mainCategoryId) return "Main Category is required";
        return "";
  };

  const handleChange = (e) => {
    setCategoryTitle(e.target.value);
    setError("");
  };

  const handleMainCategoryChange = (e) => {
    setMainCategoryId(e.target.value);
    setError("");
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
    maxFiles: 1,
  });

  const clearForm = () => {
    setCategoryTitle("");
    setCategoryImage(null);
    setMainCategoryId("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setBtnLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      // ✅ send common name keys (safe)
      formData.append("categoryName", categoryTitle.trim());
      formData.append("name", categoryTitle.trim());
      formData.append("title", categoryTitle.trim());
      formData.append("category", categoryTitle.trim());

      // ✅ send mainCategoryId (MOST IMPORTANT for backend)
      formData.append("mainCategoryId", mainCategoryId);

      // ✅ file key must match backend: upload.array('images',1)
      if (categoryImage) {
      formData.append("images", categoryImage);
    }

     const response = await axiosInstance.post("/api/add-category", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
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

      // ✅ Show backend error message
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Error adding category";

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 406 || err.response?.status === 409) {
        setError("Category already exists");
      } else {
        setError(msg);
      }
    } finally {
      setBtnLoading(false);
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
                {/* ✅ Main Category Dropdown */}
                <div className="col-12">
                  <label className="form-label">Main Category</label>
                  <select
                    className="form-control form-control-sm"
                    value={mainCategoryId}
                    onChange={handleMainCategoryChange}
                  >
                    <option value="">-- Select Main Category --</option>
                    {mainCategories.map((mc) => (
                      <option key={mc?._id} value={mc?._id}>
                        {mc?.mainCategoryName || mc?.name || "Main Category"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Category Name */}
                <div className="col-12">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={categoryTitle}
                    onChange={handleChange}
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
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={btnLoading}
                  >
                    {btnLoading ? "Saving..." : "Save Category"}
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
