import React, { useEffect, useRef, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import axiosInstance from "../../../axiosConfig";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

// ── Status badge colours ─────────────────────────────────────────────────────
const STATUS_COLOR = {
  Pending:    { background: "#FFF7ED", color: "#C2410C" },
  Processing: { background: "#EFF6FF", color: "#1D4ED8" },
  Shipped:    { background: "#F0FDF4", color: "#15803D" },
  Delivered:  { background: "#DCFCE7", color: "#166534" },
  Cancelled:  { background: "#FEF2F2", color: "#B91C1C" },
};
const PAY_COLOR = {
  Paid:    { background: "#ECFDF5", color: "#065F46" },
  Pending: { background: "#FFFBEB", color: "#92400E" },
  Failed:  { background: "#FEF2F2", color: "#991B1B" },
};

const Badge = ({ value, map }) => {
  const style = map[value] || { background: "#F1F5F9", color: "#475569" };
  return (
    <span style={{ ...style, padding: "3px 10px", borderRadius: 6, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>
      {value}
    </span>
  );
};

const OrderListTable = () => {
  const printRef = useRef();

  const [currentPage, setCurrentPage]         = useState(1);
  const [dataPerPage]                          = useState(15);
  const [orderList, setOrderList]             = useState([]);
  const [isFetching, setIsFetching]           = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails]       = useState(null);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [editOrder, setEditOrder]             = useState({});
  const [printOrder, setPrintOrder]           = useState(null);

  // ── Fetch orders ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrderList = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axiosInstance.get("/getOrders", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setOrderList(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching order list", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrderList();
  }, []);

  // ── Edit helpers ───────────────────────────────────────────────────────────
  const openEditModal = (order) => { setEditOrder(order); setShowEditModal(true); };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.put(`/update-order/${editOrder._id}`, editOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderList((prev) => prev.map((o) => (o._id === editOrder._id ? editOrder : o)));
      setShowEditModal(false);
      Swal.fire("Success", "Order updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  // ── View details ───────────────────────────────────────────────────────────
  const handleViewDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/getOrders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails(response.data.order);
      setShowDetailsModal(true);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch order details", "error");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?", text: "This cannot be undone!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/delete-order/${id}`);
        setOrderList(orderList.filter((o) => o._id !== id));
        Swal.fire("Deleted!", "Order has been deleted.", "success");
      } catch {
        Swal.fire("Error", "Failed to delete order.", "error");
      }
    }
  };

  // ── Print label ────────────────────────────────────────────────────────────
  const handlePrint = (order) => {
    setPrintOrder(order);
    setTimeout(() => {
      const content = printRef.current?.innerHTML;
      if (!content) return;
      const w = window.open("", "_blank", "width=900,height=700");
      w.document.write(`<!DOCTYPE html><html><head>
        <title>Shipping Label — ${order.orderId}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{font-family:'Courier New',monospace;background:#fff;padding:10mm;}
          .label{width:105mm;border:2px solid #000;padding:7mm;margin:0 auto;}
          .brand{font-size:24pt;font-weight:900;letter-spacing:-1px;}
          .divider{border-top:2px solid #000;margin:4mm 0;}
          .dashed{border-top:2px dashed #000;margin:4mm 0;}
          .label-sm{font-size:7pt;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:2mm;}
          .name{font-size:13pt;font-weight:700;}
          .addr{font-size:9pt;line-height:1.7;}
          table{width:100%;border-collapse:collapse;font-size:8pt;}
          th{background:#000;color:#fff;padding:2mm;text-align:left;}
          td{border:1px solid #ccc;padding:1.5mm 2mm;}
          .footer{display:flex;justify-content:space-between;align-items:center;margin-top:3mm;}
          .amount{font-size:16pt;font-weight:900;}
          .pay-badge{border:2px solid #000;padding:1mm 3mm;font-size:8pt;font-weight:700;}
          .barcode{text-align:center;font-size:7pt;letter-spacing:5px;margin:3mm 0;}
          @media print{body{padding:0;}.label{border:2px solid #000;}}
        </style></head><body>${content}
        <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script>
        </body></html>`);
      w.document.close();
    }, 120);
  };

  // ── Excel export ───────────────────────────────────────────────────────────
  const handleDownloadExcel = () => {
    const formattedData = orderList.map((order) => {
      const a = order.shippingAddress || {};
      return {
        "Order ID":       order.orderId,
        "Customer Name":  [a.firstName, a.lastName].filter(Boolean).join(" ") || order.user?.name || "N/A",
        "Customer Email": order.user?.email || order.email || "N/A",
        "Phone":          a.phoneNumber || "N/A",
        "Address":        [a.houseBuilding, a.streetArea, a.landmark, a.cityDistrict, a.state, a.postalCode].filter(Boolean).join(", "),
        "Order Status":   order.orderStatus,
        "Items":          (order.orderItems || []).map((i) => `${i.quantity}x ${i.productName} (${i.size||''} ${i.color||''})`).join(" | "),
        "Total":          `Rs.${order.totalAmount}`,
        "Payment Method": order.paymentMethod,
        "Payment Status": order.paymentStatus,
        "Order Date":     new Date(order.orderDate).toLocaleDateString(),
      };
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formattedData), "Orders");
    XLSX.writeFile(wb, "LOOI_Order_List.xlsx");
  };

  // ── Pagination ─────────────────────────────────────────────────────────────
  const indexOfLastData  = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData      = orderList.slice(indexOfFirstData, indexOfLastData);
  const totalPages       = Math.ceil(orderList.length / dataPerPage);
  const pageNumbers      = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isFetching) return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (orderList.length === 0) return <div className="text-center mt-5"><h4>No orders found</h4></div>;

  // ── Address helper ─────────────────────────────────────────────────────────
  const fullAddress = (a) => a
    ? [a.houseBuilding, a.streetArea, a.landmark, a.cityDistrict, a.state, a.postalCode, a.country].filter(Boolean).join(", ")
    : "—";

  return (
    <>
      <OverlayScrollbarsComponent>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-sm btn-success" onClick={handleDownloadExcel}>
            ⬇ Download Excel
          </button>
        </div>

        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
          <thead>
            <tr>
              <th><div className="form-check"><input className="form-check-input" type="checkbox" /></div></th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((order) => {
              const a = order.shippingAddress || {};
              const name = [a.firstName, a.lastName].filter(Boolean).join(" ") || order.user?.name || "—";
              return (
                <tr key={order._id}>
                  <td><div className="form-check"><input className="form-check-input" type="checkbox" /></div></td>

                  <td><Link to={`/invoices/${order.orderId}`} style={{ fontWeight: 700 }}>{order.orderId}</Link></td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{order.user?.email || order.email || "—"}</div>
                    {a.phoneNumber && <div style={{ fontSize: 12, color: "#64748B" }}>📞 {a.phoneNumber}</div>}
                  </td>

                  <td style={{ maxWidth: 200, fontSize: 12, color: "#475569" }}>
                    {fullAddress(a)}
                  </td>

                  <td style={{ minWidth: 160 }}>
                    {(order.orderItems || []).map((item, i) => (
                      <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>
                        <strong>{item.productName}</strong> ×{item.quantity}
                        {(item.size || item.color) && (
                          <span style={{ color: "#94A3B8" }}> ({[item.size, item.color].filter(Boolean).join(", ")})</span>
                        )}
                        <span style={{ float: "right", color: "#475569" }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </td>

                  <td style={{ fontWeight: 800 }}>₹{order.totalAmount?.toLocaleString("en-IN")}</td>

                  <td>
                    <div><Badge value={order.paymentStatus} map={PAY_COLOR} /></div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{order.paymentMethod}</div>
                  </td>

                  <td><Badge value={order.orderStatus} map={STATUS_COLOR} /></td>

                  <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(order.orderDate).toLocaleDateString("en-IN")}
                  </td>

                  <td>
                    <div className="btn-box" style={{ display: "flex", gap: 4 }}>
                      <button title="View Details" onClick={() => handleViewDetails(order._id)}>
                        <i className="fa-light fa-eye"></i>
                      </button>
                      <button title="Print Label" onClick={() => handlePrint(order)}>
                        <i className="fa-light fa-print"></i>
                      </button>
                      <button title="Edit" onClick={() => openEditModal(order)}>
                        <i className="fa-light fa-pen"></i>
                      </button>
                      <button title="Delete" onClick={() => handleDelete(order._id)}>
                        <i className="fa-light fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>

      <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} pageNumbers={pageNumbers} />

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Order</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Order Status</Form.Label>
              <Form.Select name="orderStatus" value={editOrder.orderStatus} onChange={handleEditChange}>
                {["Pending","Processing","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select name="paymentStatus" value={editOrder.paymentStatus} onChange={handleEditChange}>
                {["Pending","Paid","Failed"].map(s => <option key={s}>{s}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Amount (₹)</Form.Label>
              <Form.Control type="number" name="totalAmount" value={editOrder.totalAmount} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control type="text" name="paymentMethod" value={editOrder.paymentMethod} onChange={handleEditChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateOrder}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* ── View Details Modal ────────────────────────────────────────────── */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Order Details — {orderDetails?.orderId}</Modal.Title></Modal.Header>
        <Modal.Body>
          {orderDetails ? (
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {/* Summary row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  ["Order ID",       orderDetails.orderId],
                  ["Order Status",   <Badge value={orderDetails.orderStatus} map={STATUS_COLOR} />],
                  ["Payment Status", <Badge value={orderDetails.paymentStatus} map={PAY_COLOR} />],
                  ["Payment Method", orderDetails.paymentMethod],
                  ["Total Amount",   `₹${orderDetails.totalAmount?.toLocaleString("en-IN")}`],
                  ["Order Date",     new Date(orderDetails.orderDate).toLocaleString("en-IN")],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Shipping address */}
              <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Shipping Address</div>
                {(() => {
                  const a = orderDetails.shippingAddress || {};
                  const nm = [a.firstName, a.lastName].filter(Boolean).join(" ");
                  return (
                    <>
                      {nm && <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{nm}</div>}
                      {a.phoneNumber && <div style={{ fontSize: 13, color: "#475569", marginBottom: 4 }}>📞 {a.phoneNumber}</div>}
                      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                        {[a.houseBuilding, a.streetArea, a.landmark].filter(Boolean).join(", ")}<br/>
                        {[a.cityDistrict, a.state, a.postalCode].filter(Boolean).join(", ")}<br/>
                        {a.country}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Order items table */}
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Items Ordered</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9" }}>
                    {["Product", "Size", "Color", "Qty", "Unit Price", "Total"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, fontSize: 11, color: "#64748B", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(orderDetails.orderItems || []).map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{item.productName}</td>
                      <td style={{ padding: "10px 12px", color: "#475569" }}>{item.size || "—"}</td>
                      <td style={{ padding: "10px 12px", color: "#475569" }}>{item.color || "—"}</td>
                      <td style={{ padding: "10px 12px" }}>{item.quantity}</td>
                      <td style={{ padding: "10px 12px", color: "#475569" }}>₹{item.price}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid #E2E8F0" }}>
                    <td colSpan={5} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#64748B" }}>Grand Total</td>
                    <td style={{ padding: "10px 12px", fontWeight: 900, fontSize: 16 }}>₹{orderDetails.totalAmount?.toLocaleString("en-IN")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : <p>Loading...</p>}
        </Modal.Body>
        <Modal.Footer>
          {orderDetails && (
            <Button variant="dark" onClick={() => handlePrint(orderDetails)}>
              🖨 Print Shipping Label
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Hidden print template ─────────────────────────────────────────── */}
      {printOrder && (
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <div className="label">
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #000", paddingBottom: "3mm", marginBottom: "4mm" }}>
                <div className="brand">LOOI</div>
                <div style={{ textAlign: "right", fontSize: 8 }}>
                  <div style={{ fontWeight: 700 }}>{printOrder.orderId}</div>
                  <div style={{ color: "#555" }}>{new Date(printOrder.orderDate).toLocaleDateString("en-IN")}</div>
                </div>
              </div>

              {/* Ship To */}
              <div style={{ marginBottom: "4mm" }}>
                <div className="label-sm">Ship To</div>
                {(() => {
                  const a = printOrder.shippingAddress || {};
                  const nm = [a.firstName, a.lastName].filter(Boolean).join(" ") || "—";
                  return (
                    <>
                      <div className="name">{nm}</div>
                      {a.phoneNumber && <div style={{ fontSize: 9, margin: "1mm 0" }}>📞 {a.phoneNumber}</div>}
                      <div className="addr">
                        {[a.houseBuilding, a.streetArea, a.landmark].filter(Boolean).join(", ")}<br/>
                        {[a.cityDistrict, a.state, a.postalCode].filter(Boolean).join(", ")}<br/>
                        {a.country || "India"}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="divider" />

              {/* Items */}
              <div style={{ marginBottom: "3mm" }}>
                <div className="label-sm">Items</div>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th><th>Size</th><th>Color</th><th style={{ textAlign: "right" }}>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(printOrder.orderItems || []).map((it, i) => (
                      <tr key={i}>
                        <td>{it.productName}</td>
                        <td>{it.size || "—"}</td>
                        <td>{it.color || "—"}</td>
                        <td style={{ textAlign: "right" }}>{it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Barcode-style ID */}
              <div className="barcode">||| {printOrder.orderId} |||</div>

              {/* Footer */}
              <div className="dashed" />
              <div className="footer">
                <div>
                  <div style={{ fontSize: 7, color: "#888", marginBottom: 2 }}>Payment</div>
                  <div className="pay-badge">{printOrder.paymentMethod} · {printOrder.paymentStatus}</div>
                </div>
                <div className="amount">₹{printOrder.totalAmount?.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderListTable;
