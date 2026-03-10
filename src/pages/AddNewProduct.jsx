import React, { useState } from "react";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import AddNewBreadcrumb from "../components/breadcrumb/AddNewBreadcrumb";
import NewProductTitle from "../components/add-new-product/NewProductTitle";
import ProductDescription from "../components/add-new-product/ProductDescription";
import ProductData from "../components/add-new-product/ProductData";
import SeoData from "../components/add-new-product/SeoData";
import PublishedProduct from "../components/add-new-product/PublishedProduct";
import CategorySection from "../components/add-new-product/CategorySection";
import ProductTags from "../components/add-new-product/ProductTags";

import axiosInstance from "../axiosConfig";

const AddNewProduct = () => {

const [product,setProduct] = useState({

name:"",
description:"",
price:"",
oldPrice:"",

hsn:"",
sku:"",

length:"",
width:"",
height:"",
weight:"",

maincategory:"",
subcategory:"",

coverImage:null,

sizes:[]

})

const handleChange = (e)=>{

setProduct({

...product,
[e.target.name]:e.target.value

})

}

const handleImageChange = (file)=>{

setProduct({

...product,
coverImage:file

})

}

const handleSubmit = async()=>{

try{

const formData = new FormData()

Object.keys(product).forEach(key=>{

if(key==="sizes"){

formData.append("sizes",JSON.stringify(product.sizes))

}else{

formData.append(key,product[key])

}

})

await axiosInstance.post("/products/add",formData,{
headers:{
"Content-Type":"multipart/form-data"
}
})

alert("Product added successfully")

}catch(err){

console.log(err)

alert("Product creation failed")

}

}

return (

<div className="main-content">

<AddNewBreadcrumb link={"/allProduct"} title={"Add New Product"} />

<div className="row g-4">

<div className="col-xxl-9 col-lg-8">

<NewProductTitle
product={product}
handleChange={handleChange}
/>

<ProductDescription
product={product}
handleChange={handleChange}
/>

<ProductData
product={product}
handleChange={handleChange}
handleImageChange={handleImageChange}
/>

<SeoData />

</div>

<div className="col-xxl-3 col-lg-4 add-product-sidebar">

<div className="mb-30 w-100">

<button
onClick={handleSubmit}
className="btn btn-primary d-block"
>

Save Product

</button>

</div>

<PublishedProduct/>

<CategorySection
product={product}
handleChange={handleChange}
/>

<ProductTags/>

</div>

</div>

<Footer/>

</div>

)

}

export default AddNewProduct