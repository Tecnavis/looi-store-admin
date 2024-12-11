import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig'; 
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';

const InvoicePage = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(`/invoice/${orderId}`);
        setInvoiceData(response.data);
      } catch (err) {
        setError('Error fetching invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const downloadInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/invoice/${orderId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError('Error downloading invoice');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <h3>Invoice for Order ID: {orderId}</h3>
      {invoiceData && (
        <Card>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Order Details</h5>
                <p><strong>Order ID:</strong> {orderId}</p>
              </Col>
              <div className="mt-3">
        <Button variant="primary" onClick={downloadInvoice}>
          Download Invoice
        </Button>
      </div>
              
            </Row>
            
          </Card.Body>
        </Card>
      )}
     
    </div>
  );
};

export default InvoicePage;
