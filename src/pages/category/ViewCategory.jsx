import React from 'react'
import Footer from '../../components/footer/Footer'
import AllCategoryHeader from '../../components/header/AllCategoryHeader'
import AllProductTableFilter from '../../components/filter/AllProductTableFilter'
import AllCategoryTable from '../../components/tables/category/AllCategoryTable'
import HeaderBtn from '../../components/header/HeaderBtn'
import AllMainCategoryTable from '../../components/tables/category/AllMainCategoryTable'
import AllSubCategoryTable from '../../components/tables/category/AllSubCategoryTable'
import AllCategoryCard from '../../components/tables/category/AllCategoryCard'


const AllProductMainContent = () => {
  return (
    <div className="main-content">
        <div className="row g-4">
            <div className="col-12">
                <div className="panel">
                   <AllCategoryHeader/>
                   <AllCategoryCard/>
                    <div className="panel-body">

                    <AllMainCategoryTable/>
                     <AllCategoryTable/>
                     <AllSubCategoryTable/>
                    
                    </div>
                </div>
            </div>
        </div>
{/* 
        <Footer/> */}
    </div>
  )
}

export default AllProductMainContent