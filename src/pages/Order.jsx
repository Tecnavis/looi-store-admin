import React, { useEffect, useState } from 'react'
import Footer from '../components/footer/Footer'
import OrderHeader from '../components/header/OrderHeader'
import HeaderBtn from '../components/header/HeaderBtn'
import OrderTableFilter from '../components/filter/OrderTableFilter'
import OrderListTable from '../components/tables/OrderListTable'
import { Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../../axiosConfig'; // adjust path if needed

const OrderMainContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axiosInstance.get('/getOrders');
                // API returns { success, count, orders }
                const fetchedOrders = response.data?.orders || response.data || [];
                setOrders(fetchedOrders);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to load orders. Please refresh and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
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

    if (error) {
        return (
            <div className="main-content p-4">
                <Alert variant="danger">{error}</Alert>
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
                            {/* Pass fetched orders down to the table */}
                            <OrderListTable orders={orders} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderMainContent;
