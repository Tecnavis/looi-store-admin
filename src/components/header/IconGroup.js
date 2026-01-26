
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { WishlistContext } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";



const IconGroup = ({ iconWhiteClass }) => {
  const navigate = useNavigate();
  const { wishlistCount,fetchWishlistData } = useContext(WishlistContext);
  const { cartCount,fetchCartData } = useCart();
  const { searchProducts } = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch latest counts when component mounts or token changes
      fetchWishlistData();
      fetchCartData();
    }
  }, [localStorage.getItem('token')]);

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


  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
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
    <div className={clsx("header-right-wrap", iconWhiteClass)}>
      
     
      {/* Profile Dropdown */}
     
      
      <div className="same-style account-setting" style={{marginLeft: "8px"}}>
        <button
          className="account-setting-active"
          onClick={handleProfileClick} // Updated
        >
          <i className="pe-7s-user-female " />
        </button>
        <div className={`account-dropdown ${isProfileOpen ? "active" : ""}`}>
          <ul>
            {!token ? (
              <>
                {/* Show login and register when no token */}
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Show my account and logout if token exists */}
                <li >
                  <Link to={process.env.PUBLIC_URL + "/my-account"}>
                    My Account
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
      
      <div className="same-style header-wishlist" style={{marginLeft: "8px"}}>
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistCount}
          </span>
        </Link>
      </div>
      
      <div className="same-style cart-wrap d-none d-lg-block">
         <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartCount}
          </span>
        </Link>
        {/* menu cart */}
        {/* <MenuCart /> */}
      </div>

      <div className="same-style cart-wrap d-block d-lg-none" style={{marginLeft: "13px"}}>
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartCount}
          </span>
        </Link>
      </div>
      <div className="same-style header-search" style={{marginLeft: "7px"}}>
        <button className="search-active" onClick={handleClick}>
          <i className="pe-7s-search" />
        </button>
        <div className={`search-content ${isSearchOpen ? 'active' : ''}`}>
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

      <div className="same-style mobile-off-canvas d-block d-lg-none" style={{marginLeft: "4px"}}>
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};

export default IconGroup;