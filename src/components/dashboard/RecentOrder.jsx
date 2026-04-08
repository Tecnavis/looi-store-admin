import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosConfig';

const RecentOrder = () => {
    const [orderList, setOrderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        const fetchOrderList = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/getOrders', {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                setOrderList(response.data.orders);
            } catch (err) {
                console.log('Error fetching order list', err);
            }
        };
        fetchOrderList();
    }, []);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderList.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orderList.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
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
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">No orders found.</td>
                                    </tr>
                                ) : currentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.orderId}</td>
                                        <td>{order.user?.email}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>₹{order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        {/* <td>
                                            <div className="btn-box">
                                                <button title="View"><i className="fa-light fa-eye"></i></button>
                                                <button title="Edit"><i className="fa-light fa-pen"></i></button>
                                                <button title="Delete"><i className="fa-light fa-trash"></i></button>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </OverlayScrollbarsComponent>

                    {orderList.length > 0 && (
                        <div className="table-bottom-control">
                            <div className="dataTables_info">
                                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orderList.length)} of {orderList.length}
                            </div>
                            <div className="dataTables_paginate paging_simple_numbers">
                                <button
                                    className={`btn btn-primary previous ${currentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fa-light fa-angle-left"></i>
                                </button>
                                <span>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`btn btn-primary ${currentPage === i + 1 ? 'current' : ''}`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </span>
                                <button
                                    className={`btn btn-primary next ${currentPage === totalPages ? 'disabled' : ''}`}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fa-light fa-angle-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentOrder;
