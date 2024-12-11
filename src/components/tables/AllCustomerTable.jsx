import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axiosInstance from '../../../axiosConfig';
import * as XLSX from 'xlsx';
const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(15);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get('/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCustomers(response.data.users);
      } catch (err) {
        console.log('Error fetching customers', err);
      }
    };
    fetchCustomers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.put(`/update-user/${selectedUser._id}`, selectedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCustomers((prevData) =>
        prevData.map((data) => (data._id === response.data.user._id ? response.data.user : data))
      );
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.log('Error updating user', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith('address')) {
      const [_, index, field] = name.split('.');
      setSelectedUser((prev) => {
        const updatedAddress = [...(prev.address || [])];
        updatedAddress[index] = {
          ...updatedAddress[index],
          [field]: value,
        };
        return { ...prev, address: updatedAddress };
      });
    } else {
      setSelectedUser((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCustomers((prevData) => prevData.filter((data) => data._id !== id));
    } catch (err) {
      console.log('Error deleting user', err);
    }
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = customers.slice(indexOfFirstData, indexOfLastData);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(customers.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const displayData = (data) => (data ? data : 'Nil');
  const handleDownload = () => {
    const formattedData = customers.map((customer) => ({
      FullName: customer.fullName || 'Nil',
      Username: customer.username || 'Nil',
      Email: customer.email || 'Nil',
      PhoneNumber: customer.address?.[0]?.phoneNumber || 'Nil',
      CityDistrict: customer.address?.[0]?.cityDistrict || 'Nil',
      PostalCode: customer.address?.[0]?.postalCode || 'Nil',
      StreetArea: customer.address?.[0]?.streetArea || 'Nil',
      HouseBuilding: customer.address?.[0]?.houseBuilding || 'Nil',
      Landmark: customer.address?.[0]?.landmark || 'Nil',
      DateRegistered: new Date(customer.createdAt).toLocaleDateString() || 'Nil',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'Customers.xlsx');
  };

  return (
    <>
      <OverlayScrollbarsComponent>
        <div className='d-flex justify-content-between align-items-center'>
        <button className="btn btn-sm btn-success" onClick={handleDownload}>Download</button>
        </div>
        <br/>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
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
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>City/District</th>
              <th>Postal Code</th>
              <th>Street/Area</th>
              <th>House/Building</th>
              <th>Landmark</th>
              <th>Date Registered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((data) => (
              <tr key={data._id}>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </td>
                <td>
                  <Link to="#">{displayData(data.fullName)}</Link>
                </td>
                <td>{displayData(data.username)}</td>
                <td>{displayData(data.email)}</td>
                <td>{displayData(data.address?.[0]?.phoneNumber)}</td>
                <td>{displayData(data.address?.[0]?.cityDistrict)}</td>
                <td>{displayData(data.address?.[0]?.postalCode)}</td>
                <td>{displayData(data.address?.[0]?.streetArea)}</td>
                <td>{displayData(data.address?.[0]?.houseBuilding)}</td>
                <td>{displayData(data.address?.[0]?.landmark)}</td>
                <td>
                  {displayData(new Date(data.createdAt).toLocaleDateString())}
                </td>
                <td>
                  <div>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleEdit(data)}
                    >
                      <i className="fa-light fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleDelete(data._id)}
                    >
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
      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleUpdate}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={selectedUser.fullName || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={selectedUser.username || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedUser.email || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="address.0.phoneNumber"
                  value={selectedUser?.address?.[0]?.phoneNumber || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>City/District</Form.Label>
                <Form.Control
                  type="text"
                  name="address.0.cityDistrict"
                  value={selectedUser?.address?.[0]?.cityDistrict || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  name="address.0.postalCode"
                  value={selectedUser?.address?.[0]?.postalCode || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Street/Area</Form.Label>
                <Form.Control
                  type="text"
                  name="address.0.streetArea"
                  value={selectedUser?.address?.[0]?.streetArea || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>House/Building</Form.Label>
                <Form.Control
                  type="text"
                  name="address.0.houseBuilding"
                  value={selectedUser?.address?.[0]?.houseBuilding || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Landmark</Form.Label>
                <Form.Control
                  type="text"
                  name="address.0.landmark"
                  value={selectedUser?.address?.[0]?.landmark || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <br/>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AllCustomerTable;

