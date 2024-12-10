import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axiosInstance from '../../../axiosConfig';
import Swal from 'sweetalert2';

const OrderListTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(15);
    const [orderList, setOrderList] = useState([]);

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
        
    // Pagination logic
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = orderList.slice(indexOfFirstData, indexOfLastData);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate total number of pages
    const totalPages = Math.ceil(orderList.length / dataPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
//delete order by id
const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
        try {
            await axiosInstance.delete(`/delete-order/${id}`);
            setOrderList(orderList.filter(order => order._id !== id));
            await Swal.fire(
                'Deleted!',
                'Your order has been deleted.',
                'success'
            );
        } catch (error) {
            console.error('Error deleting order:', error);
            await Swal.fire(
                'Error',
                'An error occurred while deleting the order.',
                'error'
            );
        }
    }    
};
    if (orderList.length === 0)
        return (
            <div className="text-center mt-5">
                <h4>No orders found</h4>
            </div>
            )
    return (
        <>
            <OverlayScrollbarsComponent>
                <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
                    <thead>
                        <tr>
                            <th className="no-sort">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="markAllProduct"/>
                                </div>
                            </th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Order Status</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Payment Method</th>
                            <th>Payment Status</th>
                            <th>Order Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"/>
                                    </div>
                                </td>
                                <td><Link to={`/invoices/${order.orderId}`}>{order.orderId}</Link></td>
                                <td>{order.user?.email}</td>
                                <td><span className="text-danger">{order.orderStatus}</span></td>
                                <td>{order.orderItems.map(item => item.quantity).join(', ')}</td>
                                <td>${order.totalAmount}</td>
                                <td>{order.paymentMethod}</td>
                                <td><span className={`badge ${order.paymentStatus === 'Pending' ? 'badge-warning' : 'badge-success'}`}>{order.paymentStatus}</span></td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>
                                    <div className="btn-box">
                                        <button><i className="fa-light fa-eye"></i></button>
                                        <button><i className="fa-light fa-pen"></i></button>
                                        <button onClick={() => handleDelete(order._id)}><i className="fa-light fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </OverlayScrollbarsComponent>
            <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers}/>
        </>
    );
};

export default OrderListTable;
