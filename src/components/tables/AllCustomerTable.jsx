
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axiosInstance from '../../../axiosConfig';

const AllCustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(15);

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
        setCustomers(response.data.users); // Assuming the API returns 'users'
      } catch (err) {
        console.log('Error fetching customers', err);
      }
    };

    fetchCustomers();
  }, []);

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = customers.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(customers.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to safely display data or 'Nil'
  const displayData = (data) => (data ? data : 'Nil');

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="markAllProduct" />
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
                <td>{displayData(new Date(data.createdAt).toLocaleDateString())}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers} />
    </>
  );
};

export default AllCustomerTable;

