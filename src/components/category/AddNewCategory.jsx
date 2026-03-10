import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../axiosConfig";

const AddNewCategory = () => {

  const [categoryName,setCategoryName] = useState("")
  const [mainCategory,setMainCategory] = useState("")
  const [description,setDescription] = useState("")
  const [thumbnail,setThumbnail] = useState(null)

  const [mainCategories,setMainCategories] = useState([])

  const [showThumbnail,setShowThumbnail] = useState(false)

  const handleShowThumbnail = ()=>{
    setShowThumbnail(!showThumbnail)
  }

  /*
  LOAD MAIN CATEGORIES
  */
  useEffect(()=>{

    axiosInstance.get("/main-category")
    .then(res=>{
      setMainCategories(res.data)
    })

  },[])


  const onDropSingle = useCallback((acceptedFiles)=>{
    setThumbnail(acceptedFiles[0])
  },[])

  const {getRootProps,getInputProps,isDragActive} = useDropzone({
    onDrop:onDropSingle
  })


  /*
  SUBMIT CATEGORY
  */
  const handleSubmit = async(e)=>{

    e.preventDefault()

    if(!mainCategory){
      alert("Please select main category")
      return
    }

    const formData = new FormData()

    formData.append("name",categoryName)
    formData.append("maincategoriesData",mainCategory)
    formData.append("description",description)

    if(thumbnail){
      formData.append("images",thumbnail)
    }

    await axiosInstance.post("/add-category",formData)

    alert("Category added successfully")

    setCategoryName("")
    setDescription("")
    setThumbnail(null)

  }


  return (

<div className="col-xxl-4 col-md-5">

<div className="panel">

<div className="panel-header">
<h5>Add New Category</h5>
</div>

<form onSubmit={handleSubmit}>

<div className="panel-body">

<div className="row g-3">

<div className="col-sm-12">

<label>Main Category</label>

<select
className="form-control"
value={mainCategory}
onChange={(e)=>setMainCategory(e.target.value)}
>

<option value="">Select Main Category</option>

{mainCategories.map((cat)=>(
<option key={cat._id} value={cat._id}>
{cat.name}
</option>
))}

</select>

</div>


<div className="col-12">

<label>Category Name</label>

<input
type="text"
className="form-control"
value={categoryName}
onChange={(e)=>setCategoryName(e.target.value)}
required
/>

</div>


<div className="col-12">

<label>Description</label>

<textarea
className="form-control"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

</div>


<div className="col-12">

<label onClick={handleShowThumbnail}>
Add Category Image
</label>

<div {...getRootProps()}
className={showThumbnail?"":"d-none"}>

<input {...getInputProps()} />

<div className="upload-button">

{isDragActive ? "Drop Image" : "Upload Image"}

</div>

</div>

{thumbnail && (
<p>{thumbnail.name}</p>
)}

</div>


<div className="col-12 text-end">

<button className="btn btn-primary">
Save Category
</button>

</div>

</div>

</div>

</form>

</div>

</div>

)

}

export default AddNewCategory