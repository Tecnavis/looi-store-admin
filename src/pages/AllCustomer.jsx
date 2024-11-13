import React, { useEffect, useState } from 'react'
import Footer from '../components/footer/Footer'
import AllCustomerHeader from '../components/header/AllCustomerHeader'
import HeaderBtn from '../components/header/HeaderBtn'
import AllCustomerTableFilter from '../components/filter/AllCustomerTableFilter'
import AllCustomerTable from '../components/tables/AllCustomerTable'
import { Spinner } from 'react-bootstrap'; 


const AllCustomer = () => {

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
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    <AllCustomerHeader/>
                    <div className="panel-body">
                        {/* <HeaderBtn/> */}
                        {/* <AllCustomerTableFilter/> */}
                        <AllCustomerTable/>
                    </div>
                </div>
            </div>
        </div>

     
    </div>
  )
}

export default AllCustomer