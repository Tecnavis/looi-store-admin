import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

const EditSubCategory = ({ show, handleClose, subCategory, onEdit }) => {
    const [name, setName] = useState(subCategory.subcategoryname || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.put(`/update-subcategoryid/${subCategory._id}`, { subcategoryname: name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            onEdit(subCategory._id, name);
            MySwal.fire({
                
                text: `Sub Category Updated  successfully`,
                icon: 'success',
                confirmButtonClass: 'btn btn-sm btn-primary',
                buttonsStyling: false,
                showCloseButton: true,
                closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
                customClass: {
                  closeButton: 'btn btn-sm btn-icon btn-danger',
                },
              });
            handleClose();
        } catch (err) {
            console.error('Error updating subcategory:', err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Sub Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formSubCategoryName">
                        <Form.Label>Sub Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditSubCategory;
