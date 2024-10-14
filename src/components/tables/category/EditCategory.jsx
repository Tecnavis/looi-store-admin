import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../../axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

const EditCategory = ({ show, handleClose, category, onEdit }) => {
    const [name, setName] = useState(category.name || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.put(`/update-categoryid/${category._id}`, { name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            onEdit(category._id, name); 
            MySwal.fire({
                
                text: `Main Category Updated  successfully`,
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
                <Modal.Title>Edit Main Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formCategoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

export default EditCategory;
