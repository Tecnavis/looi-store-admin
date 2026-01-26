

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import HeaderTop from "../../components/header/HeaderTop";
import logo from "../../assets/images/logo/looii.jpg";
import './headerstyle.css'
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";

const HeaderOne = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
  iconWhiteClass 
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const { cartCount,fetchCartData } = useCart();
  const { searchProducts } = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { wishlistCount,fetchWishlistData } = useContext(WishlistContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlistData();
      fetchCartData();
    }
  }, [localStorage.getItem('token')]);
  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };


  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
    setIsSearchOpen(prev => !prev);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts(searchTerm);
    navigate('/search-results', { state: { searchTerm } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleLogout = () => {
   
    localStorage.removeItem('token');
    window.location.reload();

    fetchWishlistData();
    fetchCartData();
    navigate(process.env.PUBLIC_URL + "/login-register"); // Corrected the route
  };
  const token = localStorage.getItem('token'); 

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
    setIsSearchOpen(false); // Ensure search dropdown closes
  };
  return (
    <header
      className={clsx(
        "header-area clearfix",
        headerBgClass,
        headerPositionClass
      )}
    >
      {/* Header Top */}
      <div
        className={clsx(
          "header-top-area",
          headerPaddingClass,
          top === "visible" ? "d-none d-lg-block" : "d-none",
          borderStyle === "fluid-border" && "border-none"
        )}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <HeaderTop borderStyle={borderStyle} />
        </div>
      </div>

      {/* Main Header */}
      <div
        className={clsx(
          headerPaddingClass,
          "sticky-bar header-res-padding clearfix",
          scroll > headerTop && "stick"
        )}
        style={{ backgroundColor: "#007fff" }}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row align-items-center">
            {/* Logo Column */}
            <div
              className="col-xl-2 col-lg-2 col-md-6 col-4"
              style={{ height: "80px" }}
            >
              <div
                className="logo-container "
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Logo imageUrl={logo} className="header-logo mb-3" />
              </div>
            </div>

            {/* Navigation Column */}
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              <NavMenu />
            </div>

            {/* Icon Group Column */}
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              <div className={clsx("header-right-wrap", iconWhiteClass)}>
                {/* <IconGroup /> */}
 {/* //profile */}
 <div
  className="same-style mobile-off-canvas d-none d-lg-block"
  style={{ marginLeft: "4px" }}
>
                  <button
                    className="account-setting-active"
                    onClick={handleProfileClick} // Updated
                  >
                    <i className="pe-7s-user-female " />
                  </button>
                  <div
                    className={`account-dropdown ${
                      isProfileOpen ? "active" : ""
                    }`}
                  >
                    <ul>
                      {!token ? (
                        <>
                          {/* Show login and register when no token */}
                          <li>
                            <Link
                              to={process.env.PUBLIC_URL + "/login-register"}
                            >
                              Login
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={process.env.PUBLIC_URL + "/login-register"}
                            >
                              Register
                            </Link>
                          </li>
                        </>
                      ) : (
                        <>
                          {/* Show my account and logout if token exists */}
                          <li>
                            <Link to={process.env.PUBLIC_URL + "/my-account"}>
                              My Account
                            </Link>
                          </li>
                          <li>
                            <Link to={process.env.PUBLIC_URL + "/addressbook"}>
                              Address Book
                            </Link>
                          </li>
                          <li>
                            <Link to="#" onClick={handleLogout}>
                              Logout
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <div
                  className="same-style header-search"
                  style={{ marginLeft: "0px" }}
                >
                  <button className="search-active" onClick={handleClick}>
                    <i className="pe-7s-search" />
                  </button>
                  <div
                    className={`search-content ${isSearchOpen ? "active" : ""}`}
                  >
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <button type="submit" className="button-search">
                        <i className="pe-7s-search" />
                      </button>
                    </form>
                  </div>
                </div>
                <div
                  className="same-style header-wishlist"
                  style={{ marginLeft: "0px" }}
                >
                  <Link to={process.env.PUBLIC_URL + "/wishlist"}>
                    <i className="pe-7s-like" />
                    <span className="count-style">{wishlistCount}</span>
                  </Link>
                </div>
                <div
                  className="same-style cart-wrap  d-lg-block"
                  style={{ marginRight: "0px" }}
                >
                  <Link
                    className="icon-cart"
                    to={process.env.PUBLIC_URL + "/cart"}
                  >
                    <i className="pe-7s-shopbag" />
                    <span className="count-style">{cartCount}</span>
                  </Link>
                </div>
               
               {/* //menu */}
                <div
                  className="same-style mobile-off-canvas d-block d-lg-none"
                  style={{ marginLeft: "12px" }}
                >
                  <button
                    className="mobile-aside-button"
                    onClick={() => triggerMobileMenu()}
                  >
                    <i className="pe-7s-menu" />
                  </button>
                </div>
              </div>
              {/* //moble icon */}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string
};

export default HeaderOne;