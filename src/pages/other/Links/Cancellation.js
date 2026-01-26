import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";


const Cancellation = () => {
    let { pathname } = useLocation();

    return (
        <Fragment>
            
            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb
                    pages={[
                        { label: "Cancellation and Refund", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div className="main-div">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 mt-4 mb-5">
                                <p>Damaged or Defective Products: If you receive a damaged or defective product, please contact us within 15 days of receiving your order. We will provide a prepaid return label for the item and issue a full refund or send a replacement, whichever you prefer.</p>
                                <p>Incorrect Orders: If you receive an incorrect product due to our error, please contact us within 15 days of receiving your order. We will provide a prepaid return label for the item and issue a full refund or send the correct item, whichever you prefer.</p>
                                <p>Change of Mind: If you change your mind about a purchase, you may return the item(s) in unused condition within 15 days of receiving your order. Please note that return shipping costs will be the responsibility of the customer. Once we receive the returned item(s), we will issue a refund for the purchase price, excluding any shipping fees.</p>
                                <p>Refund Process: Refunds will be issued to the original method of payment within 15 days after we receive the returned item(s) and verify their condition.</p>
                                <p>Exceptions: Certain items may not be eligible for returns or refunds due to hygiene reasons or other restrictions. These items will be clearly marked as non-returnable on their product pages.</p>


                            </div>
                            <div class="col-lg-6 mt-4 mb-5">
                                <p>How to Request a Refund: To request a refund, please contact our customer service team at [contact email or phone number]. Please include your order number and reason for the return in your message.</p>
                                <p>Cancellation Policy: Orders can be canceled for a full refund if they have not yet been shipped. Once an order has been shipped, it cannot be canceled, but it may be eligible for return as outlined above.</p>
                            </div>

                        </div>
                    </div>
                </div>


            </LayoutOne>
        </Fragment>
    );
};

export default Cancellation;
