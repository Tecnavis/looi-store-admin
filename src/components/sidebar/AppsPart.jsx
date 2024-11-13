import React, { useContext} from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DigiContext } from '../../context/DigiContext';

const AppsPart = () => {
  const { 
    state, 
    toggleCrmDropdown, 
    toggleHrmDropdown, 
    toggleEcommerceDropdown,
    toggleProductDropdown,
    toggleMainDropdown, 
    toggleSubDropdown,
    layoutPosition, 
    dropdownOpen,
    mainAppsDropdownRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen
  } = useContext(DigiContext);
  const { 
    isMainDropdownOpen, 
    isCrmDropdownOpen, 
    isHrmDropdownOpen, 
    isEcommerceDropdownOpen, 
    isProductDropdownOpen,
    isSubDropdownOpen 
  } = state;
  
  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubDropdown(); // Open the sub-dropdown
    }
  };

  return (
    <li className="sidebar-item" ref={isExpanded || isNavExpanded.isSmall || layoutPosition.horizontal || (layoutPosition.twoColumn && isExpanded) || (layoutPosition.twoColumn && isSmallScreen) ? mainAppsDropdownRef : null}>
      <Link
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainDropdown}
      >
        Dashboard
      </Link>
      <ul className={`sidebar-link-group 
      ${layoutPosition.horizontal ? (dropdownOpen.apps ? 'd-block' : 'd-none') : (isMainDropdownOpen ? 'd-none' : '')}
      `}>  

{/* CRM */}
        {/* <li className="sidebar-dropdown-item" >
          <Link
            role="button"
            className={`sidebar-link has-sub ${isCrmDropdownOpen ? 'show' : ''}`}
            onClick={toggleCrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-headset"></i>
            </span>{' '}
            <span className="sidebar-txt">CRM</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isCrmDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="crmDropdown"
           
          >

            <li className="sidebar-dropdown-item">
              <NavLink to="/audience" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Target Audience
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/company" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Company
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/task" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Task
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/leads" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Leads
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/customer" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Customer
              </NavLink>
            </li>
          </ul>
        </li> */}
{/* HRM */}
        {/* <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isHrmDropdownOpen ? 'show' : ''}`}
            onClick={toggleHrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-tie"></i>
            </span>{' '}
            <span className="sidebar-txt">HRM</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isHrmDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="hrmDropdown"
          >
            <li className="sidebar-dropdown-item">
              <NavLink to="/addEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Employee
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/allEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Employee
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/attendance" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Attendance
              </NavLink>
            </li>
          </ul>
        </li> */}


        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isEcommerceDropdownOpen ? 'show' : ''}`}
            onClick={toggleEcommerceDropdown}
          >
            <span className="nav-icon">
            <i class="fa-solid fa-list"></i>
            </span>{' '}
            <span className="sidebar-txt">Category</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isEcommerceDropdownOpen && isSubDropdownOpen ? 'd-block' :''
            }`}
            id="ecommerceDropdown"

          >
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/allCustomer" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Customer
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/addNewProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/allProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Product
              </NavLink>
            </li>
             */}
              <li className="sidebar-dropdown-item">
              <NavLink to="/addCategory" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Category
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/addMainCategory" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Main Category
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/addSubCategory" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Sub Category
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/viewallcategory" className="sidebar-link" onClick={handleSubNavLinkClick}>
                View Category
              </NavLink>
            </li>
            
            
          </ul>
        </li>

        {/* product sidebar */}
        <li className="sidebar-dropdown-item">
          <Link
            role="button"
            className={`sidebar-link has-sub ${isProductDropdownOpen ? 'show' : ''}`}
            onClick={toggleProductDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-cart-shopping-fast"></i>
            </span>{' '}
            <span className="sidebar-txt">Product</span>
          </Link>
          <ul
            className={`sidebar-dropdown-menu ${
              isProductDropdownOpen && isSubDropdownOpen ? 'd-block' :''
            }`}
            id="productDropdown"

          >
           
              <li className="sidebar-dropdown-item">
              <NavLink to="/addproduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink to="/allproducts" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Product
              </NavLink>
            </li>
            {/* <li className="sidebar-dropdown-item">
              <NavLink to="/addSubCategory" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Sub Category
              </NavLink>
            </li> */}
            
          </ul>
        </li>

        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/addNewProduct" className="sidebar-link">
            <span className="nav-icon">
            <i class="fa-solid fa-cart-plus"></i>
            </span>{' '}
            <span className="sidebar-txt"> Add Product</span>
          </NavLink>
        </li> */}

        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/allProduct" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt"> All Product</span>
          </NavLink>
        </li> */}

     <li className="sidebar-dropdown-item">
          <NavLink to="/addbanner" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Add Banner</span>
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/adsbanner" className="sidebar-link">
            <span className="nav-icon">
            <i class="fa-regular fa-note-sticky"></i>
            </span>{' '}
            <span className="sidebar-txt">Ads Banner</span>
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/addprint" className="sidebar-link">
            <span className="nav-icon">
        <i class="fa-solid fa-note-sticky"></i>
                        </span>{' '}
            <span className="sidebar-txt">Add Prints</span>
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/allCustomer" className="sidebar-link">
            <span className="nav-icon">
            <i class="fa-solid fa-people-group"></i>
                        </span>{' '}
            <span className="sidebar-txt">All Customer</span>
          </NavLink>
        </li>

        <li className="sidebar-dropdown-item">
          <NavLink to="/order" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Order</span>
          </NavLink>
        </li>

        


        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/calendar" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Calendar</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/chat" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-messages"></i>
            </span>{' '}
            <span className="sidebar-txt">Chat</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/email" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-envelope"></i>
            </span>{' '}
            <span className="sidebar-txt">Email</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/invoices" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-file-invoice"></i>
            </span>{' '}
            <span className="sidebar-txt">Invoices</span>
          </NavLink>
        </li> */}
        {/* <li className="sidebar-dropdown-item">
          <NavLink to="/contacts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Contacts</span>
          </NavLink>
        </li> */}
      </ul>
    </li>
  );
};

export default AppsPart;
