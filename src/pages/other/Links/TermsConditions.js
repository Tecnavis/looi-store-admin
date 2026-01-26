import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";


const TermsConditions = () => {
    let { pathname } = useLocation();

    return (
        <Fragment>
           
            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb
                    pages={[
                        { label: "Terms and Conditions", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />
                <div className="main-div">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 mt-4 mb-5">
                               <p>The terms and conditions of an e-commerce platform typically outline the rules, responsibilities, rights, and liabilities of both the platform operator and its users (buyers and sellers). While the specifics can vary depending on the platform and jurisdiction, here are some common elements you might find in the terms and conditions of an e-commerce website.</p>

                               <p>1. Acceptance of Terms: Users are required to agree to the terms and conditions before using the platform. This section outlines that by using the website or its services, users agree to abide by these terms.</p>
                               <p>2. User Accounts: Information about user registration, including account creation, username, password, and security measures. It may also include details on account termination or suspension for violations.</p>
                               <p>3. Payment Terms: Explanation of payment methods accepted, currency, pricing, taxes, and any applicable fees or charges.
                               </p>
                               <p>4. Privacy Policy: Explanation of how user information is collected, used, and protected. This section typically covers data collection practices, cookies, third-party services, and compliance with data protection laws.
                               </p>
                               <p>5. Returns and Refunds: Policies regarding returns, exchanges, refunds, and warranties. This may include conditions for returning products, refund processing times, and any restocking fees.</p>

                            </div>
                            <div class="col-lg-6 mt-4 mb-5">
                                <p>6. User Responsibilities: Expectations for user behavior, including prohibitions on illegal activities, abusive behavior, spamming, and unauthorized use of the platform.</p>
                                <p>7. Liability Limitations: Disclaimers of liability for damages, losses, or disruptions resulting from the use of the platform, including limitations on the platform's liability for the actions of third-party sellers or service providers.</p>
                                <p>8. Modification of Terms: Reservations of the right to modify the terms and conditions at any time, with notification to users of changes.</p>
                                <p>9. Contact Information: Contact details for the platform operator, including customer support and legal contact information.</p>
                                <p>10. Shipping and Delivery: Information regarding shipping options, delivery times, shipping costs, tracking, and any restrictions on delivery locations.</p>
                            </div>
                            
                        </div>
                    </div>
                </div>


            </LayoutOne>
        </Fragment>
    );
};

export default TermsConditions;
