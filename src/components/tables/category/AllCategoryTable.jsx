import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosConfig";
import EditCategoryModal from "./EditCategory";

const AllCategoryTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ token + headers handled in axiosConfig interceptor
        const response = await axiosInstance.get("/get-category");

        // ✅ support both formats:
        // 1) response.data = []
        // 2) response.data = { success:true, categories:[] }
        const list = response?.data?.categories || response?.data || [];

        if (Array.isArray(list)) {
          setProducts(list);
        } else {
          setProducts([]);
          setError("No categories found");
        }
      } catch (err) {
        console.log("CATEGORY FETCH ERROR FULL:", err);

        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.err ||
          err?.response?.data?.error ||
          err?.message ||
          "Unknown error";

        setError("Error fetching categories: " + msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditButtonClick = (category) => {
    setCurrentCategory(category);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setCurrentCategory(null);
  };

  const handleEdit = (id, updatedName) => {
    setProducts((prev) =>
      prev.map((category) =>
        category._id === id ? { ...category, name: updatedName } : category
      )
    );
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-sm btn-danger",
      cancelButtonClass: "btn btn-sm btn-secondary",
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      // ✅ token handled automatically
      await axiosInstance.delete(`/delete-category/${id}`);

      setProducts((prev) => prev.filter((category) => category._id !== id));

      Swal.fire({
        text: "Category deleted successfully!",
        icon: "success",
        confirmButtonClass: "btn btn-sm btn-primary",
        buttonsStyling: false,
        showCloseButton: true,
        closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
        customClass: {
          closeButton: "btn btn-sm btn-icon btn-danger",
        },
      });
    } catch (err) {
      console.error("Error deleting category:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.err ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";

      Swal.fire({
        text: "Error deleting category: " + msg,
        icon: "error",
        confirmButtonClass: "btn btn-sm btn-primary",
        buttonsStyling: false,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = products.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(products.length / dataPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped mt-5"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllProduct"
                  />
                </div>
              </th>
              <th>Main Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No categories have been added yet.
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

                  <td>{data.name || "N/A"}</td>

                  <td>
                    <div className="btn-box">
                      <button onClick={() => handleEditButtonClick(data)}>
                        <i className="fa-light fa-pen"></i>
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

      {/* Pagination if needed */}
      {/* <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} /> */}

      {currentCategory && (
        <EditCategoryModal
          show={modalShow}
          handleClose={handleCloseModal}
          category={currentCategory}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default AllCategoryTable;
