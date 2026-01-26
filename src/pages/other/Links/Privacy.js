import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";


const Privacy = () => {
    let { pathname } = useLocation();

    return (
        <Fragment>
            
            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb
                    pages={[
                        { label: "Privacy policy", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div className="main-div">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6 mt-4 mb-5">
                               <p>1. The privacy policy of an e-commerce platform outlines how the platform collects, uses, stores, and protects users' personal information. Below are some common elements you might find in the privacy policy of an e-commerce website.</p>
                               <p>2. Information Collection: Explanation of the types of personal information collected from users, such as name, address, email, phone number, payment details, and browsing behavior.</p>
                               <p>3. Purpose of Data Collection: Description of why the platform collects users' personal information, such as to process orders, provide customer support, improve services, and personalize user experiences.</p>
                               <p>4. Data Usage: Details on how the platform uses the collected data, including for marketing purposes, analytics, communication with users, and compliance with legal obligations.</p>
                               <p>5. User Control: Explanation of users' rights and options regarding their personal information, such as the ability to access, correct, or delete their data, as well as opt-out of certain data collection or marketing activities.</p>


                            </div>
                            <div class="col-lg-6 mt-4 mb-5">
                               <p>6. Security Measures: Assurance of the platform's commitment to implementing appropriate security measures to protect users' personal information from unauthorized access, disclosure, alteration, or destruction.</p>
                               <p>7. Data Retention: Explanation of how long the platform retains users' personal information and the criteria used to determine retention periods.</p>
                               <p>8. Children's Privacy: Statement regarding the platform's policy on collecting and processing personal information from children under the age of 13 or the applicable age of consent, in compliance with relevant laws and regulations.</p>
                               <p>9. Policy Changes: Notification of any changes to the privacy policy and the effective date of such changes, along with instructions on how users can review the updated policy.</p>
                            </div>
                            
                        </div>
                    </div>
                </div>


            </LayoutOne>
        </Fragment>
    );
};

export default Privacy;
