import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer/Footer'
import AllCategoryHeader from '../../components/header/AllCategoryHeader'
import AllProductTableFilter from '../../components/filter/AllProductTableFilter'
import AllCategoryTable from '../../components/tables/category/AllCategoryTable'
import HeaderBtn from '../../components/header/HeaderBtn'
import AllMainCategoryTable from '../../components/tables/category/AllMainCategoryTable'
import AllSubCategoryTable from '../../components/tables/category/AllSubCategoryTable'
import AllCategoryCard from '../../components/tables/category/AllCategoryCard'
import { Spinner } from 'react-bootstrap'; 


const AllProductMainContent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call or other setup tasks
    setTimeout(() => {
      setLoading(false);  // Set loading to false once setup is done
    }, 1000);  // Example delay, replace with actual data fetch or setup logic if needed
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
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