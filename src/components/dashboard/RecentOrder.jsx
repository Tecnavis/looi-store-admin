import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

const RecentOrder = () => {
    const [orderList, setOrderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10; // Number of orders per page

    useEffect(() => {
        const fetchOrderList = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/getOrders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setOrderList(response.data.orders);
            } catch (err) {
                console.log('Error fetching order list', err);
            }
        };
        fetchOrderList();
    }, []);

    // Calculate pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderList.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orderList.length / ordersPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="col-xxl-12">
            <div className="panel recent-order">
                <div className="panel-header">
                    <h5>Recent Orders</h5>
                    <div id="tableSearch"></div>
                </div>
                <div className="panel-body">
                    <OverlayScrollbarsComponent>
                        <table className="table table-dashed recent-order-table dataTable no-footer" id="myTable">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Order Date</th>
                                    <th>Payment Method</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.orderId}</td>
                                        <td>{order.user?.email}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-info'}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-box">
                                                <button><i className="fa-light fa-eye"></i></button>
                                                <button><i className="fa-light fa-pen"></i></button>
                                                <button><i className="fa-light fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </OverlayScrollbarsComponent>
                    <div className="table-bottom-control">
                        <div className="dataTables_info">
                            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orderList.length)} of {orderList.length}
                        </div>
                        <div className="dataTables_paginate paging_simple_numbers">
                            <Link
                                className={`btn btn-primary previous ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <i className="fa-light fa-angle-left"></i>
                            </Link>
                            <span>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Link
                                        key={index}
                                        className={`btn btn-primary ${currentPage === index + 1 ? 'current' : ''}`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </Link>
                                ))}
                            </span>
                            <Link
                                className={`btn btn-primary next ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <i className="fa-light fa-angle-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentOrder;
