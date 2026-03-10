import React, { useState } from "react";
import ProductDataTab from "./ProductDataTab";

const ProductData = ({ product, handleChange, handleImageChange }) => {

  const [productDataBtn, setProductDataBtn] = useState(false);

  const handleProductDataBtn = () => {
    setProductDataBtn(!productDataBtn);
  };

  return (
    <div className="panel mb-30">
      <div className="panel-header">
        <h5>Product Data</h5>

        <div className="panel-header-right">
          <div className="form-check d-flex gap-4">

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="generalProductData"
              />
              <label className="form-check-label" htmlFor="generalProductData">
                General
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="DownloadableProductData"
              />
              <label className="form-check-label" htmlFor="DownloadableProductData">
                Downloadable
              </label>
            </div>

          </div>
        </div>

        <div className="btn-box d-flex gap-2">
          <button className="btn btn-sm btn-icon btn-outline-primary">
            <i className="fa-light fa-arrows-rotate"></i>
          </button>

          <button
            className="btn btn-sm btn-icon btn-outline-primary panel-close"
            onClick={handleProductDataBtn}
          >
            <i className="fa-light fa-angle-up"></i>
          </button>
        </div>
      </div>

      <div className={`panel-body ${productDataBtn ? "d-none" : ""}`}>

        {/* PRODUCT PRICE */}
        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
          />
        </div>

        {/* OLD PRICE */}
        <div className="mb-3">
          <label>Old Price</label>
          <input
            type="number"
            name="oldPrice"
            className="form-control"
            value={product.oldPrice}
            onChange={handleChange}
          />
        </div>

        {/* SKU */}
        <div className="mb-3">
          <label>SKU</label>
          <input
            type="text"
            name="sku"
            className="form-control"
            value={product.sku}
            onChange={handleChange}
          />
        </div>

        {/* HSN */}
        <div className="mb-3">
          <label>HSN</label>
          <input
            type="text"
            name="hsn"
            className="form-control"
            value={product.hsn}
            onChange={handleChange}
          />
        </div>

        {/* IMAGE */}
        <div className="mb-3">
          <label>Cover Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
        </div>

        <ProductDataTab />

      </div>
    </div>
  );
};

export default ProductData;