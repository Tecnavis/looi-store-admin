import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../config/axiosconfig';

const EditAddressModal = ({ show, handleClose, address, userId, refreshAddresses }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    houseBuilding: '',
    streetArea: '',
    landmark: '',
    postalCode: '',
    cityDistrict: '',
    phoneNumber: ''
  });

  
  // Initialize form data when the modal opens
  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName,
        lastName: address.lastName,
        houseBuilding: address.houseBuilding,
        streetArea: address.streetArea,
        landmark: address.landmark,
        postalCode: address.postalCode,
        cityDistrict: address.cityDistrict,
        phoneNumber: address.phoneNumber
      });
    }
  }, [address]);
  

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit form to edit address
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/update-user/${userId}/address/${address._id}`,
        formData
      );
      if (response.status === 200) {
        alert('Address updated successfully');
        handleClose(); // Close the modal
        refreshAddresses(); // Refresh the address list after update
      }
    } catch (error) {
      // console.error('Error updating address:', error.response.data.message);
    }
  };

  return (
   
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
        <Modal.Title>Edit Address</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Form>
            <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
              type="text"
              name="houseBuilding"
              value={formData.houseBuilding}
              onChange={handleChange}
              required
            />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
              type="text"
              name="streetArea"
              value={formData.streetArea}
              onChange={handleChange}
              required
            />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
              type="text"
              name="cityDistrict"
              value={formData.cityDistrict}
              onChange={handleChange}
              required
            />
            </Form.Group>
            <Form.Group className="mb-3">
               <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Cancel
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
            Save
        </Button>
    </Modal.Footer>
</Modal>
  );
};

export default EditAddressModal;
