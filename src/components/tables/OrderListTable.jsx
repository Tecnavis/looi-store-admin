import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import axiosInstance from "../../../axiosConfig";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const API_URL = process.env.REACT_APP_API_URL;

const OrderListTable = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(15);
  const [orderList, setOrderList] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState({});

  const token = localStorage.getItem("token");

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/getOrders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderList(response.data.orders || []);

    } catch (err) {
      console.log("Error fetching order list", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- EDIT ORDER ---------------- */

  const openEditModal = (order) => {
    setEditOrder({
      ...order,
      orderDate: order.orderDate?.substring(0,10),
      cancellationDate: order.cancellationDate?.substring(0,10)
    });

    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditOrder((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateOrder = async () => {
    try {

      await axiosInstance.put(
        `${API_URL}/update-order/${editOrder._id}`,
        editOrder,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Order updated successfully", "success");

      setShowEditModal(false);
      fetchOrders();

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  /* ---------------- DELETE ORDER ---------------- */

  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: "Delete order?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes delete it"
    });

    if (!result.isConfirmed) return;

    try {

      await axiosInstance.delete(`${API_URL}/delete-order/${id}`);

      setOrderList(prev => prev.filter(order => order._id !== id));

      Swal.fire("Deleted!", "Order removed", "success");

    } catch (error) {

      Swal.fire("Error", "Failed to delete order", "error");

    }

  };

  /* ---------------- VIEW DETAILS ---------------- */

  const handleViewDetails = async (orderId) => {

    try {

      const response = await axiosInstance.get(`${API_URL}/getOrders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderDetails(response.data.order);
      setShowDetailsModal(true);

    } catch (err) {

      Swal.fire("Error", "Failed to fetch order details", "error");

    }

  };

  /* ---------------- PAGINATION ---------------- */

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = orderList.slice(indexOfFirstData, indexOfLastData);

  const totalPages = Math.ceil(orderList.length / dataPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const paginate = (num) => setCurrentPage(num);

  /* ---------------- EXPORT EXCEL ---------------- */

  const handleDownloadExcel = () => {

    const formattedData = orderList.map(order => ({
      "Order ID": order.orderId,
      Customer: order.user?.email || "N/A",
      "Order Status": order.orderStatus,
      Product: order.orderItems?.map(i => `${i.quantity} x ${i.productName}`).join(", "),
      Price: `₹${order.totalAmount}`,
      "Payment Method": order.paymentMethod,
      "Payment Status": order.paymentStatus,
      "Order Date": new Date(order.orderDate).toLocaleDateString()
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Order_List.xlsx");
  };

  /* ---------------- EMPTY STATE ---------------- */

  if (!orderList.length)
    return (
      <div className="text-center mt-5">
        <h4>No orders found</h4>
      </div>
    );

  /* ---------------- UI ---------------- */

  return (
    <>
      <OverlayScrollbarsComponent>

        <div className="d-flex justify-content-between align-items-center">

          <button
            className="btn btn-success btn-sm"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </button>

        </div>

        <br/>

        <Table className="table table-striped">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Product</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Payment Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {currentData.map(order => (

              <tr key={order._id}>

                <td>
                  <Link to={`/invoices/${order.orderId}`}>
                    {order.orderId}
                  </Link>
                </td>

                <td>{order.user?.email}</td>

                <td>
                  <span className="text-danger">
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  {order.orderItems?.map(i => i.productName).join(", ")}
                </td>

                <td>₹{order.totalAmount}</td>

                <td>{order.paymentMethod}</td>

                <td>
                  <span className="text-success">
                    {order.paymentStatus}
                  </span>
                </td>

                <td>
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>

                <td>

                  <div className="btn-box">

                    <button onClick={() => handleViewDetails(order._id)}>
                      <i className="fa-light fa-eye"></i>
                    </button>

                    <button onClick={() => openEditModal(order)}>
                      <i className="fa-light fa-pen"></i>
                    </button>

                    <button onClick={() => handleDelete(order._id)}>
                      <i className="fa-light fa-trash"></i>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </Table>

      </OverlayScrollbarsComponent>

      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />

    </>
  );

};

export default OrderListTable;