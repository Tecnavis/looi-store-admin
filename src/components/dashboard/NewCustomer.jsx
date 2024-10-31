import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosConfig';

const NewCustomer = () => {
    const [customers, setCustomers] = useState([]);

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

    return (
        <div className="col-xxl-4 col-md-6">
            <div className="panel">
                <div className="panel-header">
                    <h5>New Customers</h5>
                </div>
                <div className="panel-body">
                    <table className="table table-borderless new-customer-table">
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer._id}>
                                    <td>
                                        <div className="new-customer">
                                            {/* <div className="part-img">
                                                <img src="assets/images/avatar.png" alt="Customer Avatar" />
                                            </div> */}
                                            <div className="part-txt">
                                                <p className="customer-name">{customer.fullName}</p>
                                                <span>{customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{customer.orderCount || 0} Orders</td>
                                    <td>${customer.totalSpent || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NewCustomer;
