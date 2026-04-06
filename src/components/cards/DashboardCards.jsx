import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

const DashboardCards = () => {
    const [totalCustomers, setTotalCustomers] = useState('');
    const [orderCount, setOrderCount] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        const fetchCustomers = async () => {
            try {
                const response = await axiosInstance.get('/total-users', { headers });
                setTotalCustomers(response.data);
            } catch (err) { console.log('Error fetching customers', err); }
        };

        const fetchOrderCount = async () => {
            try {
                const response = await axiosInstance.get('/getordercount', { headers });
                setOrderCount(response.data);
            } catch (err) { console.log('Error fetching order count', err); }
        };

        const fetchProductCount = async () => {
            try {
                const response = await axiosInstance.get('/get-allproduct', { headers });
                setTotalProducts(response.data.products?.length || 0);
            } catch (err) { console.log('Error fetching products', err); }
        };

        fetchOrderCount();
        fetchCustomers();
        fetchProductCount();
    }, []);

    return (
        <div className="row mb-30">
            {/* Orders */}
            <div className="col-lg-4 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3><CountUp end={orderCount.totalOrderCount || 0} /></h3>
                        <p>Orders</p>
                        <Link to="/order" style={{ fontSize: '12px', color: '#037fe0' }}>View all orders</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-bag-shopping"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers */}
            <div className="col-lg-4 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3><CountUp end={totalCustomers.userCount || 0} /></h3>
                        <p>Customers</p>
                        <Link to="/allCustomer" style={{ fontSize: '12px', color: '#037fe0' }}>View all customers</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-user"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Products */}
            <div className="col-lg-4 col-6 col-xs-12">
                <div className="dashboard-top-box rounded-bottom panel-bg">
                    <div className="left">
                        <h3><CountUp end={totalProducts} /></h3>
                        <p>Products</p>
                        <Link to="/allproducts" style={{ fontSize: '12px', color: '#037fe0' }}>View all products</Link>
                    </div>
                    <div className="right">
                        <div className="part-icon rounded">
                            <span><i className="fa-light fa-box-open"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
