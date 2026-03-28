import React, { useEffect, useState } from 'react'
import OrderHeader from '../components/header/OrderHeader'
import OrderListTable from '../components/tables/OrderListTable'
import { Spinner } from 'react-bootstrap';

const OrderMainContent = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
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
                        <OrderHeader />
                        <div className="panel-body">
                            <OrderListTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderMainContent;