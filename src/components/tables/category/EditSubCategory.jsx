import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

const EditSubCategory = ({ show, handleClose, subCategory, onEdit }) => {
    const [name, setName] = useState(subCategory.subcategoryname || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Sub category name is required');
            return;
        }
        setError('');
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
            MySwal.fire({ text: err.response?.data?.message || 'Failed to update subcategory', icon: 'error' });
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
                        <Form.Label>Sub Category Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                            isInvalid={!!error}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
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
