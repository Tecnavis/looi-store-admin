import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import FooterCopyright from "../../components/footer/FooterCopyright";
import FooterNewsletter from "../../components/footer/FooterNewsletter";


const FooterOne = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu
}) => {
  return (
    <footer className={clsx("footer-area", backgroundColorClass, spaceTopClass, spaceBottomClass, extraFooterClass, spaceLeftClass, spaceRightClass)}>
      <div className={`${containerClass ? containerClass : "container"}`}>
        <div className="row">
          <div
            className={`${sideMenu ? "col-xl-1 col-sm-4" : "col-lg-1 col-sm-4"
              }`}
          >
            <FooterCopyright
              footerLogo="/assets/img/logo/logo.png"
              spaceBottomClass="mb-30"
            />
          </div>
          <div
            className={`${sideMenu ? "col-xl-2 col-sm-4" : "col-lg-2 col-sm-4"
              }`}
          >
            <div className="footer-widget mb-30 ml-30">
              <div className="footer-title">
                <h3>ABOUT US</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/about"}>About us</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "#/"}>
                      Store location
                    </Link>
                  </li>
                  <li>
                    {/* <Link to={process.env.PUBLIC_URL + "/contact"}>
                      Contact Us
                    </Link> */}
                    <a href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/contact_us" target="_blank" rel="noopener noreferrer">
                    Contact Us
                    </a>
                  </li>

                </ul>
              </div>
            </div>
          </div>
          <div
            className={`${sideMenu ? "col-xl-3 col-sm-4" : "col-lg-3 col-sm-4"
              }`}
          >
            <div className={`footer-widget mb-30 `}>
              <div className="footer-title">
                <h3>IMPORTANT LINKS</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    {/* <Link to={process.env.PUBLIC_URL + "/privacy"}>Privacy Policy</Link> */}
                    <a href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/privacy" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    {/* <Link to={process.env.PUBLIC_URL + "/terms"}>
                      Terms and Conditions</Link> */}
                      <a href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/terms" target="_blank" rel="noopener noreferrer">
                      Terms and Conditions
                    </a>
                  </li>
                  <li>
                    {/* <Link to={process.env.PUBLIC_URL + "/cancellation"}>Cancellation and Refund</Link> */}
                    <a href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/refund" target="_blank" rel="noopener noreferrer">
                    Cancellation and Refund
                    </a>
                  </li>
                  <li>
                    {/* <Link to={process.env.PUBLIC_URL + "/shipping"}>Shipping and Delivery</Link> */}
                    <a href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/shipping" target="_blank" rel="noopener noreferrer">
                    Shipping and Delivery
                    </a>

                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`${sideMenu ? "col-xl-3 col-sm-4" : "col-lg-2 col-sm-6"
              }`}
          >
            <div
              className={`${sideMenu
                  ? "footer-widget mb-30 ml-145"
                  : "footer-widget mb-30 ml-75"
                }`}
            >
              <div className="footer-title">
                <h3>FOLLOW US</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <a
                      href="//www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="//www.twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="//www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="//www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Youtube
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`${sideMenu ? "col-xl-3 col-sm-8" : "col-lg-4 col-sm-6"
              }`}
          >
            {/* footer newsletter */}
            <FooterNewsletter
              spaceBottomClass="mb-30"
              spaceLeftClass="ml-70"
              sideMenu={sideMenu}
            />
          </div>
        </div>
        <hr/>
        <div className="footer-bottom">
          <div className="copyright" style={{ textAlign: "center" }}>
            <p>
              Copyright © 2025{" "}
              <a href="https://www.looi.in/" target="_blank" rel="noopener noreferrer">
                Looi
              </a>
              . All Rights Reserved
            </p>
          </div>
        </div>
        <br/>
      </div>
      
      
    </footer>
  );
};

FooterOne.propTypes = {
  backgroundColorClass: PropTypes.string,
  containerClass: PropTypes.string,
  extraFooterClass: PropTypes.string,
  sideMenu: PropTypes.bool,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string
};

export default FooterOne;
