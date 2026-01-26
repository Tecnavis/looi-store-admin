import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import axiosInstance from "../../../config/axiosconfig";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMainCategories();
    fetchCategories();
    fetchSubcategories();
  }, []);

const fetchMainCategories = async () => {
  try {
    const response = await axiosInstance.get("/get-maincategory");

    const data = response.data;
    const list = Array.isArray(data)
      ? data
      : data?.maincategories || data?.mainCategories || data?.data || [];

    setMainCategories(Array.isArray(list) ? list : []);
  } catch (error) {
    console.error("Error fetching main categories:", error);
    setMainCategories([]);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get("/get-category");

    const data = response.data;
    const list = Array.isArray(data) ? data : data?.categories || data?.data || [];

    setCategories(Array.isArray(list) ? list : []);
  } catch (error) {
    console.error("Error fetching categories:", error);
    setCategories([]);
  }
};

const fetchSubcategories = async () => {
  try {
    const response = await axiosInstance.get("/get-subcategory");

    const data = response.data;
    const list = Array.isArray(data)
      ? data
      : data?.subcategories || data?.subCategories || data?.data || [];

    setSubcategories(Array.isArray(list) ? list : []);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    setSubcategories([]);
  }
};


 const getCategoriesByMainCategory = (mainCategoryId) => {
  return (Array.isArray(categories) ? categories : []).filter(
    (category) => category.maincategoriesData?._id === mainCategoryId
  );
};

const getSubcategoriesByCategory = (categoryId) => {
  return (Array.isArray(subcategories) ? subcategories : []).filter(
    (subcategory) => subcategory.category?._id === categoryId
  );
};

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate(process.env.PUBLIC_URL + "/login-register"); // Redirect to login/register page
  };
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        {/* Home Link */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>{t("home")}</Link>
        </li>

        {/* Main Categories */}
        {mainCategories.map((mainCategory) => (
          <li key={mainCategory._id} className="menu-item-has-children">
            <Link to="#">{mainCategory.mainCategoryName}</Link>
            <ul className="sub-menu">
              {getCategoriesByMainCategory(mainCategory._id).map((category) => (
                <li key={category._id} className="menu-item-has-children">
                  <Link to="#">{category.name}</Link>
                  <ul className="sub-menu">
                    {getSubcategoriesByCategory(category._id).map(
                      (subcategory) => (
                        <li key={subcategory._id}>
                          <Link
                            to={
                              process.env.PUBLIC_URL +
                              `/shop-grid-full-width/${subcategory._id}`
                            }
                          >
                            {subcategory.subcategoryname}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}

        {/* Contact Us Link */}
        <li>
          <Link to={process.env.PUBLIC_URL + "/cart"}>{t("Wishlist")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/wishlist"}>{t("Cart")}</Link>
        </li>
        {/* {token && (
          <li>
            <Link to={process.env.PUBLIC_URL + "/my-account"}>My ORDERS</Link>
          </li>
        )}
        {token && (
          <li>
            <Link to={process.env.PUBLIC_URL + "/my-account"}>My ACCOUNT</Link>
          </li>
        )} */}
        {token && (
        <li className="menu-item-has-children">
          <Link to="#">PROFILE</Link>
          <ul className="sub-menu">
          <li>
            <Link to={process.env.PUBLIC_URL + "/my-account"}>My ORDERS</Link>
          </li>
            <li>
            <Link to={process.env.PUBLIC_URL + "/addressbook"}>ADDRESS BOOK</Link>
          </li>
          </ul>
        </li>
        )}
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {t("contact_us")}
          </Link>
        </li>
        <li>
          {token ? (
            <Link to="#" onClick={handleLogout}>
              Logout
            </Link>
          ) : (
            <Link to={process.env.PUBLIC_URL + "/login-register"}>Login</Link>
          )}
        </li>
        {/* //about us */}
        <li className="menu-item-has-children">
          <Link to="#">ABOUT US</Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/about"}>About us</Link>
            </li>
            <li>
              <a
                href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/contact_us"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </li>
        {/* ///more */}
        <li className="menu-item-has-children">
          <Link to="#">MORE</Link>
          <ul className="sub-menu">
            <li>
              {/* <Link to={process.env.PUBLIC_URL + "/privacy"}>Privacy Policy</Link> */}
              <a
                href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              {/* <Link to={process.env.PUBLIC_URL + "/terms"}>
                      Terms and Conditions</Link> */}
              <a
                href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>
            </li>
            <li>
              {/* <Link to={process.env.PUBLIC_URL + "/cancellation"}>Cancellation and Refund</Link> */}
              <a
                href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/refund"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cancellation and Refund
              </a>
            </li>
            <li>
              {/* <Link to={process.env.PUBLIC_URL + "/shipping"}>Shipping and Delivery</Link> */}
              <a
                href="https://merchant.razorpay.com/policy/PFsg8WPM8WLN4t/shipping"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shipping and Delivery
              </a>
            </li>
          </ul>
        </li>
        {/* follow us */}
        <li className="menu-item-has-children">
          <Link to="#">FOLLOW US</Link>
          <ul className="sub-menu">
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
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
