// import { Fragment } from "react"; 
// import { useLocation } from "react-router-dom"; 
// import Accordion from "react-bootstrap/Accordion";
// import SEO from "../../components/seo";
// import LayoutOne from "../../layouts/LayoutOne";
// import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

// const MyAccount = () => {
//   let { pathname } = useLocation();

//   return (
//     <Fragment>
//       <SEO
//         titleTemplate="My Account"
//         description="My Account page of flone react minimalist eCommerce template."
//       />
//       <LayoutOne headerTop="visible">


//         <div className="myaccount-area pb-80 pt-100">
//           <div className="container">
//             <div className="row">
//               <div className="ms-auto me-auto col-lg-9">
//                 <div className="myaccount-wrapper">
//                   <Accordion defaultActiveKey="0">
//                     {/* <Accordion.Item eventKey="0" className="single-my-account mb-20">
//                       <Accordion.Header className="panel-heading">
//                         <span>1 .</span> Edit your account information{" "}
//                       </Accordion.Header>
//                       <Accordion.Body>
//                           <div className="myaccount-info-wrapper">
//                             <div className="account-info-wrapper">
//                               <h4>My Account Information</h4>
//                               <h5>Your Personal Details</h5>
//                             </div>
//                             <div className="row">
//                               <div className="col-lg-6 col-md-6">
//                                 <div className="billing-info">
//                                   <label>First Name</label>
//                                   <input type="text" />
//                                 </div>
//                               </div>
//                               <div className="col-lg-6 col-md-6">
//                                 <div className="billing-info">
//                                   <label>Last Name</label>
//                                   <input type="text" />
//                                 </div>
//                               </div>
//                               <div className="col-lg-12 col-md-12">
//                                 <div className="billing-info">
//                                   <label>Email Address</label>
//                                   <input type="email" />
//                                 </div>
//                               </div>
//                               <div className="col-lg-6 col-md-6">
//                                 <div className="billing-info">
//                                   <label>Telephone</label>
//                                   <input type="text" />
//                                 </div>
//                               </div>
//                               <div className="col-lg-6 col-md-6">
//                                 <div className="billing-info">
//                                   <label>Fax</label>
//                                   <input type="text" />
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="billing-back-btn">
//                               <div className="billing-btn">
//                                 <button type="submit">Continue</button>
//                               </div>
//                             </div>
//                           </div>
//                       </Accordion.Body>
//                     </Accordion.Item>


//                     <Accordion.Item eventKey="1" className="single-my-account mb-20">
//                       <Accordion.Header className="panel-heading">
//                           <span>2 .</span> Change your password
//                       </Accordion.Header>
//                       <Accordion.Body>
//                           <div className="myaccount-info-wrapper">
//                             <div className="account-info-wrapper">
//                               <h4>Change Password</h4>
//                               <h5>Your Password</h5>
//                             </div>
//                             <div className="row">
//                               <div className="col-lg-12 col-md-12">
//                                 <div className="billing-info">
//                                   <label>Password</label>
//                                   <input type="password" />
//                                 </div>
//                               </div>
//                               <div className="col-lg-12 col-md-12">
//                                 <div className="billing-info">
//                                   <label>Password Confirm</label>
//                                   <input type="password" />
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="billing-back-btn">
//                               <div className="billing-btn">
//                                 <button type="submit">Continue</button>
//                               </div>
//                             </div>
//                           </div>
//                       </Accordion.Body>
//                     </Accordion.Item>

//                     <Accordion.Item eventKey="2" className="single-my-account mb-20">
//                       <Accordion.Header className="panel-heading">
//                           <span>3 .</span> Modify your address book entries
//                       </Accordion.Header>
//                       <Accordion.Body>
//                           <div className="myaccount-info-wrapper">
//                             <div className="account-info-wrapper">
//                               <h4>Address Book Entries</h4>
//                             </div>
//                             <div className="entries-wrapper">
//                               <div className="row">
//                                 <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
//                                   <div className="entries-info text-center">
//                                     <p>John Doe</p>
//                                     <p>Paul Park </p>
//                                     <p>Lorem ipsum dolor set amet</p>
//                                     <p>NYC</p>
//                                     <p>New York</p>
//                                   </div>
//                                 </div>
//                                 <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
//                                   <div className="entries-edit-delete text-center">
//                                     <button className="edit">Edit</button>
//                                     <button>Delete</button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="billing-back-btn">
//                               <div className="billing-btn">
//                                 <button type="submit">Continue</button>
//                               </div>
//                             </div>
//                           </div>
//                       </Accordion.Body>
//                     </Accordion.Item> */}
//                      <Accordion.Item eventKey="1" className="single-my-account mb-20">
//                       <Accordion.Header className="panel-heading">
//                           <span>1 .</span> My Orders
//                       </Accordion.Header>
//                       <Accordion.Body>
//                           <div className="myaccount-info-wrapper">

//                             <div className="w-100">

//                                <p className="w-100">View Orders</p>

//                             </div>
//                           </div>
//                       </Accordion.Body>
//                     </Accordion.Item>

//                   </Accordion>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </LayoutOne>
//     </Fragment>
//   );
// };

// export default MyAccount;



import { Fragment, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import axiosInstance from '../../config/axiosconfig';

const MyAccount = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(`/user/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
           // Sort orders by creation date in ascending order
           const sortedOrders = response.data.orders.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders)
          // setOrders(response.data.orders); 
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Navigate to specific order details
  const handleViewOrder = (orderId) => {
    navigate(`/myorders/${orderId}`);
  };
  
  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> My Orders
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          {loading ? (
                            <p>Loading orders...</p>
                          ) : error ? (
                            <p className="text-danger">{error}</p>
                          ) : orders.length === 0 ? (
                            <p>No orders found.</p>
                          ) : (
                            <div className="orders-list">
                              {orders.map((order) => (
                                <div
                                  key={order._id}
                                  className="order-item mb-3 p-3"
                                  style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleViewOrder(order._id)}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6>Order ID: {order._id}</h6>
                                      {order.orderItems.map((item, index) => (
                                        <p key={index} className="mb-0">Product Name: {item.productName}</p>
                                      ))}
                                      <p className="mb-0">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                      <p className="mb-0">Status: {order.orderStatus}</p>
                                    </div>
                                    <div>
                                      <p className="mb-0">Total: ₹{order.totalAmount}</p>
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: '#000',
                                          color: '#fff',
                                          marginTop: '10px'
                                        }}
                                      >
                                        View Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;