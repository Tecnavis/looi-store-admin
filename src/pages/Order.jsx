import React, { useEffect, useState } from 'react'
import Footer from '../components/footer/Footer'
import OrderHeader from '../components/header/OrderHeader'
import HeaderBtn from '../components/header/HeaderBtn'
import OrderTableFilter from '../components/filter/OrderTableFilter'
import OrderListTable from '../components/tables/OrderListTable'
import { Spinner } from 'react-bootstrap'; 


const OrderMainContent = () => {
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
                   <OrderHeader/>
                    <div className="panel-body">
                        {/* <HeaderBtn/> */}
                        {/* <OrderTableFilter/> */}
                        <OrderListTable/>
                    </div>
                </div>
            </div>
        </div>
       
    </div>
  )
}

export default OrderMainContent