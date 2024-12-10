import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import axiosInstance from "../../../axiosConfig";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";

const OrderListTable = () => {
  const styles = {
    section: {
      marginBottom: "16px",
      display: "flex",
    },
    label: {
      fontWeight: "600",
      color: "#333",
      marginBottom: "8px",
    },
    detail: {
      fontSize: "1rem",
      color: "#555",
      marginBottom: "8px",
      fontWeight: "500",
    },
    itemList: {
      listStyleType: "none",
      paddingLeft: "0",
      margin: "0",
    },
    item: {
      fontSize: "1rem",
      color: "#444",
      marginBottom: "4px",
    },
    closeButton: {
      fontWeight: "500",
    },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(15);
  const [orderList, setOrderList] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState({});

  const openEditModal = (order) => {
    setEditOrder(order);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };
  // Update order
  const handleUpdateOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.put(`/update-order/${editOrder._id}`, editOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderList((prev) =>
        prev.map((order) => (order._id === editOrder._id ? editOrder : order))
      );
      setShowEditModal(false);
      Swal.fire("Success", "Order updated successfully", "success");
    } catch (err) {
      console.error("Error updating order:", err);
      Swal.fire("Error", "Failed to update order", "error");
    }
  };
  // Fetch order list
  useEffect(() => {
    const fetchOrderList = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axiosInstance.get("/getOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setOrderList(response.data.orders);
      } catch (err) {
        console.log("Error fetching order list", err);
      }
    };
    fetchOrderList();
  }, []);
  // View order details
  const handleViewDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/getOrders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOrderDetails(response.data.order);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
      Swal.fire("Error", "Failed to fetch order details", "error");
    }
  };

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
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/delete-order/${id}`);
        setOrderList(orderList.filter((order) => order._id !== id));
        await Swal.fire("Deleted!", "Your order has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        await Swal.fire(
          "Error",
          "An error occurred while deleting the order.",
          "error"
        );
      }
    }
  };
  if (orderList.length === 0)
    return (
      <div className="text-center mt-5">
        <h4>No orders found</h4>
      </div>
    );
  //download order details as excel
  const handleDownloadExcel = () => {
    const formattedData = orderList.map((order) => ({
      "Order ID": order.orderId,
      Customer: order.user?.email || "N/A",
      "Order Status": order.orderStatus,
      Product: order.orderItems
        .map((item) => `${item.quantity} x ${item.productName}`)
        .join(", "),
      Price: `₹${order.totalAmount}`,
      "Payment Method": order.paymentMethod,
      "Payment Status": order.paymentStatus,
      "Order Date": new Date(order.orderDate).toLocaleDateString(),
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Order_List.xlsx");
  };

  return (
    <>
      <OverlayScrollbarsComponent>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-sm btn-success"
            onClick={handleDownloadExcel}
          >
            Download as Excel
          </button>{" "}
        </div>
        <br />
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllProduct"
                  />
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
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </td>
                <td>
                  <Link to={`/invoices/${order.orderId}`}>{order.orderId}</Link>
                </td>
                <td>{order.user?.email}</td>
                <td>
                  <span className="text-danger">{order.orderStatus}</span>
                </td>
                <td>
                  {order.orderItems.map((item) => item.quantity).join(", ")}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span className="text-success">{order.paymentStatus}</span>
                </td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
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
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Order Status</Form.Label>
              <Form.Select
                name="orderStatus"
                value={editOrder.orderStatus}
                onChange={handleEditChange}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={editOrder.totalAmount}
                onChange={handleEditChange}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                type="text"
                name="paymentMethod"
                value={editOrder.paymentMethod}
                onChange={handleEditChange}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Payment Status</Form.Label>
              <Form.Select
                name="paymentStatus"
                value={editOrder.paymentStatus}
                onChange={handleEditChange}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </Form.Select>
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Order Date</Form.Label>
              <Form.Control
                type="date"
                name="orderDate"
                value={editOrder.orderDate}
                onChange={handleEditChange}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Cancellation Date</Form.Label>
              <Form.Control
                type="date"
                name="cancellationDate"
                value={editOrder.cancellationDate}
                onChange={handleEditChange}
              />
            </Form.Group>
            <br />
            {/* Add other fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateOrder}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ///view */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails ? (
            <div
              style={{ fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}
            >
              <div style={styles.section}>
                <p style={styles.label}>Order ID:</p>
                <p style={styles.detail}>{orderDetails.orderId}</p>
              </div>
              <div style={styles.section}>
                <p style={styles.label}>Order Status:</p>
                <p style={styles.detail}>{orderDetails.orderStatus}</p>
              </div>
              <div style={styles.section}>
                <p style={styles.label}>Payment Status:</p>
                <p style={styles.detail}>{orderDetails.paymentStatus}</p>
              </div>
              <div style={styles.section}>
                <p style={styles.label}>Order Date:</p>
                <p style={styles.detail}>
                  {new Date(orderDetails.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div style={styles.section}>
                <p style={styles.label}>Order Items:</p>
                <ul style={styles.itemList}>
                  {orderDetails.orderItems.map((item) => (
                    <li key={item._id} style={styles.item}>
                      {item.productName} - {item.quantity} x ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={styles.section}>
                <p style={styles.label}>Total Amount:</p>
                <p style={styles.detail}>₹{orderDetails.totalAmount}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
            style={styles.closeButton}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderListTable;
