import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";

const CategorySection = ({ product, handleChange }) => {

  const [categoryBtn, setCategoryBtn] = useState(false);
  const [addNewCat, setAddNewCat] = useState(false);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryBtn = () => {
    setCategoryBtn(!categoryBtn);
  };

  const handleAddNewCat = () => {
    setAddNewCat(!addNewCat);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories/all");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log(err);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/categories/add", {
        name: newCategory,
      });

      setNewCategory("");
      loadCategories();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="panel mb-30">

      <div className="panel-header">
        <h5>Category</h5>

        <div className="btn-box d-flex gap-2">
          <button className="btn btn-sm btn-icon btn-outline-primary">
            <i className="fa-light fa-arrows-rotate"></i>
          </button>

          <button
            className="btn btn-sm btn-icon btn-outline-primary panel-close"
            onClick={handleCategoryBtn}
          >
            <i className="fa-light fa-angle-up"></i>
          </button>
        </div>
      </div>

      <div className={`panel-body ${categoryBtn ? "d-none" : ""}`}>

        <select
          name="maincategory"
          className="form-control"
          value={product.maincategory}
          onChange={handleChange}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

      </div>

      <div className="border-top"></div>

      <div className={`panel-body ${categoryBtn ? "d-none" : ""}`}>

        <div className="d-flex justify-content-end">

          <button
            className="btn-flush add-category-btn"
            onClick={handleAddNewCat}
          >
            <i className={`fa-light ${addNewCat ? "fa-minus" : "fa-plus"}`}></i>
            Add new category
          </button>

        </div>

        <div className={`add-new-category-panel ${addNewCat ? "" : "d-none"}`}>

          <form onSubmit={createCategory}>

            <input
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-primary">
                Create Category
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default CategorySection;