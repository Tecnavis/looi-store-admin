import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";


const Shipping = () => {
    let { pathname } = useLocation();

    return (
        <Fragment>

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb
                    pages={[
                        { label: "Shipping and Delivery Policy", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div className="main-div">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 mt-4 mb-5">
                                <p>Order Processing Time: Your order will be processed and shipped within 5 to 7 business days after payment is received. Please ensure that your payment is completed promptly to avoid any delays.
                                    . Please note that orders placed on weekends or holidays will be processed on the next business day.</p>
                                <p>Shipping Methods: We offer several shipping methods to accommodate your needs, including standard shipping, expedited shipping, and express shipping. Shipping options and delivery times will vary depending on your location and the shipping method selected at checkout.</p>
                                <p>Shipping Rates: Shipping rates are calculated based on the weight of your order and your shipping address. You can view the shipping costs for your order during the checkout process before making a payment.</p>
                                <p>Shipping Restrictions: Some items may be subject to shipping restrictions due to size, weight, or other factors. These restrictions will be clearly indicated on the product page. Additionally, we do not ship to P.O. boxes or APO/FPO addresses at this time.</p>
                                <p>Order Tracking: Once your order has been shipped, you will receive a shipping confirmation email containing a tracking number. You can use this tracking number to monitor the status of your shipment and estimate the delivery date.</p>
                            </div>
                            <div class="col-lg-6 mt-4 mb-5">
                                <p>Delivery Timeframes: Delivery times will vary depending on your location and the shipping method selected. Standard shipping typically takes 15 business days, while expedited and express shipping options offer faster delivery times.</p>
                                <p>International Shipping: We offer international shipping to select countries. Please note that international orders may be subject to customs clearance procedures, which can cause delays beyond our estimated delivery times. Import duties, taxes, and fees may also apply and are the responsibility of the recipient.</p>
                                <p>Undeliverable Packages: In the event that a package is returned to us as undeliverable due to an incorrect address provided by the customer or refusal of delivery, we will attempt to contact you to arrange reshipment. Additional shipping charges may apply for reshipment of undeliverable packages</p>

                            </div>
                        </div>
                    </div>
                </div>


            </LayoutOne>
        </Fragment>
    );
};

export default Shipping;
