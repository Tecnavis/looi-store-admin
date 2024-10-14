import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

const EditMainCategory = ({ show, handleClose, category, onEdit }) => {
    const [mainCategoryName, setMainCategoryName] = useState(category.mainCategoryName || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={mainCategoryName}
                            onChange={(e) => setMainCategoryName(e.target.value)}
                            required
                        />
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
