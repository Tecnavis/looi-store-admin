import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

const EditMainCategory = ({ show, handleClose, category, onEdit }) => {
    const [mainCategoryName, setMainCategoryName] = useState(category.mainCategoryName || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mainCategoryName.trim()) {
            setError('Category name is required');
            return;
        }
        setError('');
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.put(`/update-maincategoryid/${category._id}`, { mainCategoryName }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            onEdit(category._id, mainCategoryName);
           
              
                MySwal.fire({
                
                    text: `Category Updated  successfully`,
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
            console.error('Error updating category:', err);
            MySwal.fire({ text: err.response?.data?.message || 'Failed to update category', icon: 'error' });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formMainCategoryName">
                        <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            value={mainCategoryName}
                            onChange={(e) => { setMainCategoryName(e.target.value); if (error) setError(''); }}
                            isInvalid={!!error}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className='mt-3'>
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditMainCategory;
