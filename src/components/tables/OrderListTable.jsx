import React, { useEffect, useRef, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import axiosInstance from "../../../axiosConfig";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

// LOOI logo embedded as base64 (from public/assets/images/LOOI.png)
const LOOI_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABDgAAAICCAYAAAAqIX1+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MTRGQjRDRjkxRDgxMUVGQTE5MEMyM0NDMkEyNTQyMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MTRGQjREMDkxRDgxMUVGQTE5MEMyM0NDMkEyNTQyMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYxNEZCNENEOTFEODExRUZBMTkwQzIzQ0MyQTI1NDIxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYxNEZCNENFOTFEODExRUZBMTkwQzIzQ0MyQTI1NDIxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HAI0agAAKABJREFUeNrs3QfY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AAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRPwQEAAAAUT8EBAAAAFE/BAQAAABRP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";


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
        <meta charset="utf-8"><title>Shipping Label — ${order.orderId}</title>
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

  // ── Print Invoice (proper GST invoice for admin) ───────────────────────────
  const handlePrintInvoice = (order) => {
    const TAX_RATE = 5;
    const totalAmount = Number(order.totalAmount) || 0;
    const subtotalExclTax = totalAmount / (1 + TAX_RATE / 100);
    const totalTaxAmount = totalAmount - subtotalExclTax;
    const cgst = totalTaxAmount / 2;
    const sgst = totalTaxAmount / 2;
    const a = order.shippingAddress || {};
    const customerName = [a.firstName, a.lastName].filter(Boolean).join(' ') || order.user?.name || 'N/A';
    const addressLine = [a.houseBuilding, a.streetArea, a.landmark, a.cityDistrict, a.state, a.postalCode].filter(Boolean).join(', ');

    const itemRowsHtml = (order.orderItems || []).map((item, i) => {
      const qty = Number(item.quantity) || 1;
      const lineTotal = Number(item.price) || 0;
      const taxRate = Number(item.taxRate || TAX_RATE);
      const unitExclTax = (lineTotal / qty) / (1 + taxRate / 100);
      const lineTaxAmt = lineTotal - (unitExclTax * qty);
      return `<tr style="background:${i % 2 === 0 ? '#f9f9f9' : '#fff'}">
        <td style="padding:7px 10px;border:1px solid #ddd;">${i + 1}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;">${item.productName}${item.size ? ` <small style="color:#888">(${item.size}${item.color ? '/' + item.color : ''})</small>` : ''}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:center;">${item.hsn || '—'}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:center;">${qty}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;">₹${unitExclTax.toFixed(2)}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:center;">${taxRate}%</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;">₹${lineTaxAmt.toFixed(2)}</td>
        <td style="padding:7px 10px;border:1px solid #ddd;text-align:right;font-weight:600;">₹${lineTotal.toFixed(2)}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Invoice — ${order.orderId}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:Arial,sans-serif;font-size:12px;color:#222;padding:20px;}
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
        .brand{font-size:24px;font-weight:900;letter-spacing:2px;}
        .inv-title{font-size:20px;font-weight:700;text-align:right;}
        .inv-meta{font-size:12px;color:#555;text-align:right;margin-top:4px;}
        hr{border:none;border-top:2px solid #000;margin:12px 0;}
        .section{display:flex;justify-content:space-between;margin-bottom:16px;}
        .block{width:48%;}
        .block-title{font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
        table{width:100%;border-collapse:collapse;margin-bottom:16px;}
        thead tr{background:#1a1a2e;color:#fff;}
        th{padding:8px 10px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;}
        .totals{width:300px;margin-left:auto;border:1px solid #ddd;}
        .totals td{padding:7px 12px;border-bottom:1px solid #eee;font-size:12px;}
        .totals .grand td{font-weight:700;font-size:14px;background:#1a1a2e;color:#fff;}
        .footer{margin-top:24px;padding-top:12px;border-top:1px solid #ccc;text-align:center;font-size:11px;color:#888;}
        @media print{body{padding:10px;} .no-print{display:none;}}
      </style></head>
    <body>
      <div class="header">
        <div>
          <div class="brand">LOOI</div>
          <div style="font-size:11px;color:#666;margin-top:4px;">www.looi.in | support@looi.in</div>
        </div>
        <div>
          <div class="inv-title">TAX INVOICE</div>
          <div class="inv-meta">Invoice No: ${order.orderId}</div>
          <div class="inv-meta">Date: ${new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN')}</div>
        </div>
      </div>
      <hr>
      <div class="section">
        <div class="block">
          <div class="block-title">Bill To / Ship To</div>
          <strong>${customerName}</strong><br>
          ${addressLine || 'N/A'}<br>
          ${a.phoneNumber ? 'Ph: ' + a.phoneNumber : ''}
        </div>
        <div class="block" style="text-align:right;">
          <div class="block-title">Payment</div>
          Method: <strong>${order.paymentMethod || 'N/A'}</strong><br>
          Status: <strong>${order.paymentStatus || 'Pending'}</strong><br>
          Order Status: <strong>${order.orderStatus || 'Pending'}</strong>
        </div>
      </div>
      <table>
        <thead><tr>
          <th>#</th><th>Product</th><th>HSN</th><th style="text-align:center">Qty</th>
          <th style="text-align:right">Unit (excl.)</th><th style="text-align:center">GST%</th>
          <th style="text-align:right">GST Amt</th><th style="text-align:right">Total</th>
        </tr></thead>
        <tbody>${itemRowsHtml}</tbody>
      </table>
      <table class="totals">
        <tr><td>Subtotal (excl. tax)</td><td style="text-align:right">₹${subtotalExclTax.toFixed(2)}</td></tr>
        <tr><td>CGST (2.5%)</td><td style="text-align:right">₹${cgst.toFixed(2)}</td></tr>
        <tr><td>SGST (2.5%)</td><td style="text-align:right">₹${sgst.toFixed(2)}</td></tr>
        <tr class="grand"><td>GRAND TOTAL</td><td style="text-align:right">₹${totalAmount.toFixed(2)}</td></tr>
      </table>
      <div class="footer">
        This is a computer-generated invoice. No signature required.<br>
        Thank you for your business with LOOI Store!
      </div>
      <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script>
    </body></html>`;

    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(html);
    w.document.close();
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
                      <button title="Print Shipping Label" onClick={() => handlePrint(order)}>
                        <i className="fa-light fa-print"></i>
                      </button>
                      <button title="Print GST Invoice" onClick={() => handlePrintInvoice(order)}>
                        <i className="fa-light fa-file-invoice"></i>
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
                <img src={LOOI_LOGO} alt="LOOI" style={{height:"38px",objectFit:"contain",display:"block"}} />
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
