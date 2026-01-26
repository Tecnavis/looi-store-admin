// import React, { useState, useEffect, Fragment } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Card, Container, Form, Spinner } from 'react-bootstrap';
// import Logo from '../../../src/assets/images/logo/LOOInew.png';
// import axiosInstance from '../../config/axiosconfig';
// import LayoutOne from "../../layouts/LayoutOne";
// import CheckoutHeader from "../../components/checkout-header/CheckOutHeader";
// import cogoToast from 'cogo-toast';


// const Payment = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [paymentMode, setPaymentMode] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [scriptLoaded, setScriptLoaded] = useState(false);

//     const { cartItems, billingDetails, selectedAddress } = location.state || {};
//     const userId = localStorage.getItem('userId');
//     const userEmail = localStorage.getItem("email");
//     const user = JSON.parse(localStorage.getItem("user")) || null;

//     // const userEmail = user?.email || null; // Safely access email

//     // Load Razorpay script
//     useEffect(() => {
//         const loadRazorpayScript = () => {
//             return new Promise((resolve) => {
//                 const script = document.createElement('script');
//                 script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//                 script.async = true;
//                 script.onload = () => {
//                     resolve(true);
//                 };
//                 script.onerror = () => {
//                     resolve(false);
//                 };
//                 document.body.appendChild(script);
//             });
//         };

//         const loadScript = async () => {
//             const result = await loadRazorpayScript();
//             setScriptLoaded(result);
//         };

//         loadScript();
//     }, []);

//     // Validate required data
//     if (!cartItems || !billingDetails || !selectedAddress) {
//         return (
//             <Container className="mt-5">
//                 <Card className="p-4">
//                     <div className="text-center">
//                         <h4>Error: Missing required information</h4>
//                         <p>Please go back and complete your delivery details.</p>
//                     </div>
//                 </Card>
//             </Container>
//         );
//     }

//     const handlePaymentChange = (event) => {
//         setPaymentMode(event.target.value);
//     };

//     const handlePlaceOrder = async () => {
//         if (!paymentMode) {
//             alert('Please select a payment method.');
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const orderData = {
//                 user: userId,
//                 email: userEmail,
//                 orderItems: cartItems.map(item => ({
//                     productId:item.id,
//                     // product_id: item.id,
//                     productName: item.productName,
//                     quantity: item.quantity,
//                     price: item.price,
//                     color: item.color,
//                     size: item.size,
//                     hsn: item.hsn,
//                     sku: item.sku,
//                     length: item.length,
//                     width: item.width,
//                     height: item.height,
//                     weight: item.weight,
                    
//                 })),
//                 shippingAddress: {
//                     firstName: selectedAddress.firstName,
//                     lastName: selectedAddress.lastName,
//                     houseBuilding: selectedAddress.houseBuilding,
//                     streetArea: selectedAddress.streetArea,
//                     landmark: selectedAddress.landmark,
//                     postalCode: selectedAddress.postalCode,
//                     cityDistrict: selectedAddress.cityDistrict,
//                     phoneNumber: selectedAddress.phoneNumber
//                 },
//                 paymentMethod: 'COD',
//                 paymentStatus: 'Pending',
//                 totalAmount: billingDetails.cartTotal
//             };

//             const response = await axiosInstance.post('/postOrder', orderData);
//             const orderId = response.data.order._id;
//             console.log('Order placed:', response.data);
//             cogoToast.success('Order placed successfully!');
//             navigate(`/myorders/${orderId}`);
//         } catch (error) {
//             console.error('Error placing order:', error);
//             alert('Failed to place order. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleRazorpayPayment = async (e) => {
//         e.preventDefault();

//         if (!scriptLoaded) {
//             alert('Payment gateway is not loaded yet. Please try again in a moment.');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const amount = billingDetails.cartTotal * 100;

//             // Create Razorpay order
//             const orderResponse = await axiosInstance.post('/order', {
//                 amount,
//                 currency: 'INR',
//                 receipt: userId
//             });

//             if (!orderResponse.data || !orderResponse.data.id) {
//                 throw new Error('Failed to create order');
//             }

//             const options = {
//                 key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//                 amount,
//                 currency: 'INR',
//                 name: "LOOI",
//                 description: "Payment for your order",
//                 image: Logo,
//                 order_id: orderResponse.data.id,
//                 handler: async function (response) {
                   
//                     // Inside the handler function
//                     const validationResponse = await axiosInstance.post('/verify-payment', {
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature
//                     });

//                     // Confirm the response structure and handle cases where validation fails
//                     if (validationResponse.data && validationResponse.data.success) {
//                         const orderData = {
//                             user: userId,
//                             email: userEmail,
//                             orderItems: cartItems.map(item => ({
//                                 // product_id: item.id,
//                                 productId:item.id,
//                                 productName: item.productName,
//                                 quantity: item.quantity,
//                                 price: item.price,
//                                 color: item.color,
//                                 size: item.size,
//                                 hsn: item.hsn,
//                                 sku: item.sku,
//                                 length: item.length,
//                                 width: item.width,
//                                 height: item.height,
//                                 weight: item.weight,
                                   
//                             })),
//                             shippingAddress: {
//                                 firstName: selectedAddress.firstName,
//                                 lastName: selectedAddress.lastName,
//                                 houseBuilding: selectedAddress.houseBuilding,
//                                 streetArea: selectedAddress.streetArea,
//                                 landmark: selectedAddress.landmark,
//                                 postalCode: selectedAddress.postalCode,
//                                 cityDistrict: selectedAddress.cityDistrict,
//                                 phoneNumber: selectedAddress.phoneNumber
//                             },
//                             paymentMethod: 'Razorpay',
//                             paymentStatus: 'Paid',
//                             totalAmount: billingDetails.cartTotal,
//                             razorpayOrderId: response.razorpay_order_id,
//                             razorpayPaymentId: response.razorpay_payment_id
//                         };
//                         console.log('Order data:', orderData);

//                         const orderResponse = await axiosInstance.post('/postOrder', orderData);
//                         const orderId = orderResponse.data.order._id; // Ensure order ID is returned correctly

//                         cogoToast.success('Payment successful, order placed!');
//                         navigate(`/myorders/${orderId}`);
//                     } else {
//                         console.error('Validation failed:', validationResponse.data);
//                         alert('Payment verification failed. Please contact support.');
//                     }

//                 },
//                 prefill: {
//                     name: user?.username || '',
//                     // email: user?.email || '',
//                     email: userEmail,

//                     contact: user?.phonenumber || ''
//                 },
//                 theme: {
//                     color: "#3399cc"
//                 }
//             };

//             const razorpayInstance = new window.Razorpay(options);
//             razorpayInstance.on('payment.failed', function (response) {
//                 alert('Payment failed. Please try again.');
//                 console.error('Payment failed:', response.error);
//             });
//             razorpayInstance.open();

//         } catch (error) {
//             console.error('Error initiating Razorpay payment:', error);
//             alert('Failed to initiate payment. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Fragment>
//             <LayoutOne headerTop="visible">
//                 <>
//                     <CheckoutHeader currentStep="payment" />
//                     <hr />
//                 </>
//                 <Container className="mt-5 mb-5">
//                     <Card className="p-4 shadow">
//                         <h3 className="text-center mb-4">Choose Payment Mode</h3>

//                         <Form>
//                             <div className="mb-4">
//                                 <h3>Order Summary</h3>
//                                 <p><b>Total Amount:</b> ₹{billingDetails.cartTotal}</p>
//                                 <p><b>Shipping Address:</b> {selectedAddress.firstName} {selectedAddress.lastName}</p>
//                                 <p>{selectedAddress.houseBuilding}, {selectedAddress.streetArea}</p>
//                                 <p>{selectedAddress.cityDistrict}, {selectedAddress.postalCode}</p>
//                             </div>

//                             <Form.Check
//                                 type="radio"
//                                 id="payOnDelivery"
//                                 name="payment"
//                                 label="Pay on Delivery"
//                                 value="payOnDelivery"
//                                 checked={paymentMode === 'payOnDelivery'}
//                                 onChange={handlePaymentChange}
//                                 className="mb-3"
//                             />

//                             <Form.Check
//                                 type="radio"
//                                 id="razorPay"
//                                 name="payment"
//                                 label="Pay Online with Razorpay"
//                                 value="razorPay"
//                                 checked={paymentMode === 'razorPay'}
//                                 onChange={handlePaymentChange}
//                                 className="mb-4"
//                                 disabled={!scriptLoaded}
//                             />

//                             <div className="d-grid gap-2">
//                                 {isLoading ? (
//                                     <div className="text-center">
//                                         <Spinner animation="border" variant="primary" />
//                                     </div>
//                                 ) : (
//                                     <>
//                                         {paymentMode === 'payOnDelivery' && (
//                                             <button
//                                                 className="btn btn-primary"
//                                                 type="button"
//                                                 onClick={handlePlaceOrder}
//                                             >
//                                                 Place Order
//                                             </button>
//                                         )}

//                                         {paymentMode === 'razorPay' && (
//                                             <button
//                                                 className="btn btn-primary"
//                                                 type="button"
//                                                 onClick={handleRazorpayPayment}
//                                                 disabled={!scriptLoaded}
//                                             >
//                                                 Pay Now
//                                             </button>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         </Form>
//                     </Card>
//                 </Container>
//             </LayoutOne>

//         </Fragment>
//     );
// };

// export default Payment;



import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Container, Form, Spinner, Row, Col, Alert, Badge } from 'react-bootstrap';
import Logo from '../../../src/assets/images/logo/LOOInew.png';
import axiosInstance from '../../config/axiosconfig';
import LayoutOne from "../../layouts/LayoutOne";
import CheckoutHeader from "../../components/checkout-header/CheckOutHeader";
import cogoToast from 'cogo-toast';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMode, setPaymentMode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);

    const { cartItems, billingDetails, selectedAddress } = location.state || {};
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem("email");
    const user = JSON.parse(localStorage.getItem("user")) || null;

    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        const loadScript = async () => {
            const result = await loadRazorpayScript();
            setScriptLoaded(result);
        };

        loadScript();
    }, []);

    if (!cartItems || !billingDetails || !selectedAddress) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Missing Information</Alert.Heading>
                    <p>Please go back and complete your delivery details.</p>
                </Alert>
            </Container>
        );
    }

    const handlePaymentChange = (event) => {
        setPaymentMode(event.target.value);
    };

    const handlePlaceOrder = async () => {
        if (!paymentMode) {
            cogoToast.error('Please select a payment method.');
            return;
        }
        setIsLoading(true);
        try {
            const orderData = {
                user: userId,
                email: userEmail,
                orderItems: cartItems.map(item => ({
                    productId: item.id,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    color: item.color,
                    size: item.size,
                    hsn: item.hsn,
                    sku: item.sku,
                    length: item.length,
                    width: item.width,
                    height: item.height,
                    weight: item.weight,
                })),
                shippingAddress: {
                    firstName: selectedAddress.firstName,
                    lastName: selectedAddress.lastName,
                    houseBuilding: selectedAddress.houseBuilding,
                    streetArea: selectedAddress.streetArea,
                    landmark: selectedAddress.landmark,
                    postalCode: selectedAddress.postalCode,
                    cityDistrict: selectedAddress.cityDistrict,
                    country: selectedAddress.country,
                    state: selectedAddress.state,
                    phoneNumber: selectedAddress.phoneNumber
                },
                paymentMethod: 'COD',
                paymentStatus: 'Pending',
                totalAmount: billingDetails.cartTotal
            };

            const response = await axiosInstance.post('/postOrder', orderData);
            const orderId = response.data.order._id;
            cogoToast.success('Order placed successfully!');
            navigate(`/myorders/${orderId}`);
        } catch (error) {
            console.error('Error placing order:', error);
            cogoToast.error('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRazorpayPayment = async (e) => {
        e.preventDefault();

        if (!scriptLoaded) {
            cogoToast.error('Payment gateway is loading. Please try again in a moment.');
            return;
        }

        setIsLoading(true);
        try {
            const amount = billingDetails.cartTotal * 100;

            const orderResponse = await axiosInstance.post('/order', {
                amount,
                currency: 'INR',
                receipt: userId
            });

            if (!orderResponse.data || !orderResponse.data.id) {
                throw new Error('Failed to create order');
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount,
                currency: 'INR',
                name: "LOOI",
                description: "Payment for your order",
                image: Logo,
                order_id: orderResponse.data.id,
                handler: async function (response) {
                    try {
                        const validationResponse = await axiosInstance.post('/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (validationResponse.data?.success) {
                            const orderData = {
                                user: userId,
                                email: userEmail,
                                orderItems: cartItems.map(item => ({
                                    productId: item.id,
                                    productName: item.productName,
                                    quantity: item.quantity,
                                    price: item.price,
                                    color: item.color,
                                    size: item.size,
                                    hsn: item.hsn,
                                    sku: item.sku,
                                    length: item.length,
                                    width: item.width,
                                    height: item.height,
                                    weight: item.weight,
                                })),
                                shippingAddress: {
                                    firstName: selectedAddress.firstName,
                                    lastName: selectedAddress.lastName,
                                    houseBuilding: selectedAddress.houseBuilding,
                                    streetArea: selectedAddress.streetArea,
                                    landmark: selectedAddress.landmark,
                                    postalCode: selectedAddress.postalCode,
                                    cityDistrict: selectedAddress.cityDistrict,
                                    country: selectedAddress.country,
                                    state: selectedAddress.state,
                                    phoneNumber: selectedAddress.phoneNumber
                                },
                                paymentMethod: 'Razorpay',
                                paymentStatus: 'Paid',
                                totalAmount: billingDetails.cartTotal,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id
                            };

                            const orderResponse = await axiosInstance.post('/postOrder', orderData);
                            const orderId = orderResponse.data.order._id;

                            cogoToast.success('Payment successful, order placed!');
                            navigate(`/myorders/${orderId}`);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        cogoToast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.username || '',
                    email: userEmail,
                    contact: user?.phonenumber || ''
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on('payment.failed', function (response) {
                cogoToast.error('Payment failed. Please try again.');
            });
            razorpayInstance.open();

        } catch (error) {
            console.error('Error initiating Razorpay payment:', error);
            cogoToast.error('Failed to initiate payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Fragment>
            <LayoutOne headerTop="visible">
                <CheckoutHeader currentStep="payment" />
                <hr className="mb-4" />
                
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <Card className="shadow-lg border-0 rounded-3">
                                <Card.Header className="bg-primary text-white p-4">
                                    <h3 className="text-center mb-0 text-white" >Complete Your Payment</h3>
                                </Card.Header>

                                <Card.Body className="p-4">
                                    <div className="mb-4">
                                        <button 
                                            className="btn btn-link p-0 text-decoration-none"
                                            onClick={() => setShowOrderSummary(!showOrderSummary)}
                                        >
                                            <h5 className="d-flex align-items-center">
                                                <i className={`bi bi-chevron-${showOrderSummary ? 'up' : 'down'} me-2`}></i>
                                                Order Summary
                                                <Badge bg="secondary" className="ms-2">₹{billingDetails.cartTotal}</Badge>
                                            </h5>
                                        </button>

                                        {showOrderSummary && (
                                            <div className="mt-3 p-3 bg-light rounded">
                                                <p className="mb-2"><strong>Shipping to:</strong></p>
                                                <p className="mb-1">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                                <p className="mb-1">{selectedAddress.houseBuilding}, {selectedAddress.streetArea}</p>
                                                <p className="mb-1">{selectedAddress.cityDistrict}, {selectedAddress.postalCode}</p>
                                                <p className="mb-0">Phone: {selectedAddress.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="payment-options">
                                        <h5 className="mb-3">Select Payment Method</h5>
                                        
                                        <div className="payment-option mb-3">
                                            <Form.Check
                                                type="radio"
                                                id="payOnDelivery"
                                                name="payment"
                                                className="payment-radio"
                                            >
                                                <Form.Check.Input 
                                                    type="radio"
                                                    value="payOnDelivery"
                                                    checked={paymentMode === 'payOnDelivery'}
                                                    onChange={handlePaymentChange}
                                                />
                                                <Form.Check.Label className="d-flex align-items-center">
                                                    <i className="bi bi-cash-coin me-2 text-success"></i>
                                                    Pay on Delivery
                                                </Form.Check.Label>
                                            </Form.Check>
                                        </div>

                                        <div className="payment-option mb-4">
                                            <Form.Check
                                                type="radio"
                                                id="razorPay"
                                                name="payment"
                                                className="payment-radio"
                                            >
                                                <Form.Check.Input 
                                                    type="radio"
                                                    value="razorPay"
                                                    checked={paymentMode === 'razorPay'}
                                                    onChange={handlePaymentChange}
                                                    disabled={!scriptLoaded}
                                                />
                                                <Form.Check.Label className="d-flex align-items-center">
                                                    <i className="bi bi-credit-card me-2 text-primary"></i>
                                                    Pay Online with Razorpay
                                                    {!scriptLoaded && <span className="ms-2 text-muted">(Loading...)</span>}
                                                </Form.Check.Label>
                                            </Form.Check>
                                        </div>

                                        {isLoading ? (
                                            <div className="text-center py-3">
                                                <Spinner animation="border" variant="primary" />
                                                <p className="mt-2 text-muted">Processing your payment...</p>
                                            </div>
                                        ) : (
                                            <div className="d-grid gap-2">
                                                {paymentMode === 'payOnDelivery' && (
                                                    <button
                                                        className="btn btn-primary btn-lg"
                                                        type="button"
                                                        onClick={handlePlaceOrder}
                                                    >
                                                        Place Order
                                                    </button>
                                                )}

                                                {paymentMode === 'razorPay' && (
                                                    <button
                                                        className="btn btn-primary btn-lg"
                                                        type="button"
                                                        onClick={handleRazorpayPayment}
                                                        disabled={!scriptLoaded}
                                                    >
                                                        Pay Now ₹{billingDetails.cartTotal}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </LayoutOne>
        </Fragment>
    );
};

export default Payment;