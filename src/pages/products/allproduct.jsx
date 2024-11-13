import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer/Footer'
import AllProductHeader from '../../components/header/AllProductHeader'
import AllProductTableFilter from '../../components/filter/AllProductTableFilter'
import AllProductTable from '../../components/tables/AllProductTable'
import HeaderBtn from '../../components/header/HeaderBtn'
import { Spinner } from 'react-bootstrap'; 


const AllProductMainContent = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate an API call or other setup tasks
        setTimeout(() => {
            setIsLoading(false);  // Set loading to false once setup is done
        }, 1000);  // Example delay, replace with actual data fetch or setup logic if needed
    }, []);

    if (isLoading) {
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
                    <AllProductHeader/>
                    <div className="panel-body">
                        {/* <HeaderBtn/> */}
                        {/* <AllProductTableFilter/> */}
                        <AllProductTable/>
                    </div>
                </div>
            </div>
        </div>

        {/* <Footer/> */}
    </div>
  )
}

export default AllProductMainContent