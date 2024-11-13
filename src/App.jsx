// import { BrowserRouter as Router,Routes,Route} from "react-router-dom"
// import React, { Suspense, lazy } from "react";
// // import Dashboard from "./pages/Dashboard"

// import Audience from "./pages/Audience"
// import Company from "./pages/Company"
// import Task from "./pages/Task"
// import Leads from "./pages/Leads"
// import Customer from "./pages/Customer"
// import AddEmployee from "./pages/AddEmployee"
// import AllEmployee from "./pages/AllEmployee"
// import Attendance from "./pages/Attendance"
// import AllCustomer from "./pages/AllCustomer"
// import AddNewProduct from "./pages/AddNewProduct"
// // import AllProduct from "./pages/AllProduct"
// import Category from "./pages/Category"
// import AddCategory from "./pages/category/AddCategory";
// import AddMainCategory from "./pages/category/AddMainCategory";
// import AddSubCategory from "./pages/category/AddSubCategory";
// import ViewCategory from "./pages/category/ViewCategory"
// import Order from "./pages/Order"
// import Chat from "./pages/Chat"
// import Email from "./pages/Email"
// import Calendar from "./pages/Calendar"
// import Invoices from "./pages/Invoices"
// import Contacts from "./pages/Contacts"
// import Login from "./pages/Login"
// import Login2 from "./pages/Login2"
// import Registration from "./pages/Registration"
// import Registration2 from "./pages/Registration2"
// import ResetPassword from "./pages/ResetPassword"
// import UpdatePassword from "./pages/UpdatePassword"
// import LoginStatus from "./pages/LoginStatus"
// import Profile from "./pages/Profile"
// import EditProfile from "./pages/EditProfile"
// import Utility from "./pages/Utility"
// import SweetAlert from "./pages/SweetAlert"
// import NestableList from "./pages/NestableList"
// import Animation from "./pages/Animation"
// import SwiperSlider from "./pages/SwiperSlider"
// import Form from "./pages/Form"
// import Table from "./pages/Table"
// import Charts from "./pages/Charts"
// import Icon from "./pages/Icon"
// import Map from "./pages/Map"
// import FileManager from "./pages/FileManager"
// import Layout from "./components/layout/Layout"
// import Login3 from "./pages/Login3"
// import Error400 from "./pages/Error400"
// import Error403 from "./pages/Error403"
// import Error404 from "./pages/Error404"
// import Error408 from "./pages/Error408"
// import Error500 from "./pages/Error500"
// import Error503 from "./pages/Error503"
// import Error504 from "./pages/Error504"
// import ComingSoon from "./pages/ComingSoon"
// import ComingSoon2 from "./pages/ComingSoon2"
// import PricingTable from "./pages/PricingTable"
// import PricingTable2 from "./pages/PricingTable2"
// import UnderConstruction from "./pages/UnderConstruction"
// import ProtectedRoute from "./protected-route/protected-route"
// import Addproduct from './pages/products/addproduct'
// import AddProduct from "./pages/products/addproduct";
// import AllProduct from './pages/products/allproduct';
// import AddBanner from './pages/banner/AddBanner';

// // Import the components using React.lazy()
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// function App() {

//   return (
//     <Router>
//         <Suspense fallback={<div>Loading...</div>}>
//         <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/login2" element={<Login2 />} />
//       <Route path="/login3" element={<Login3 />} />
//       <Route path="/registration" element={<Registration />} />
//       <Route path="/registration2" element={<Registration2 />} />
//       <Route path="/resetPassword" element={<ResetPassword />} />
//       <Route path="/updatePassword" element={<UpdatePassword />} />
//       <Route path="/loginStatus" element={<LoginStatus />} />

     
//       <Route path="/error400" element={<Error400 />} />
//       <Route path="/error403" element={<Error403 />} /> 
//       <Route path="/error404" element={<Error404 />} />
//       <Route path="/error408" element={<Error408 />} />
//       <Route path="/error500" element={<Error500 />} />
//       <Route path="/error503" element={<Error503 />} />
//       <Route path="/error504" element={<Error504 />} />

     
//       <Route path="/comingSoon" element={<ComingSoon />} />
//       <Route path="/comingSoon2" element={<ComingSoon2 />} />

    
//       <Route path="/pricingTable" element={<PricingTable />} />
//       <Route path="/pricingTable2" element={<PricingTable2 />} />

  
//       <Route path="/underConstruction" element={<UnderConstruction />} />

//       {/* Protected Routes */}
//       <Route element={<Layout />}>
//         {/* These routes will be protected and accessible only to authenticated users */}

//         <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         {/* <Route path="/fileManager" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />
//         <Route path="/crmDashboard" element={<ProtectedRoute><CrmDashboard /></ProtectedRoute>} />
//         <Route path="/hrmDashboard" element={<ProtectedRoute><HrmDashboard /></ProtectedRoute>} /> */}
//         <Route path="/audience" element={<ProtectedRoute><Audience /></ProtectedRoute>} />
//         <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
//         <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
//         <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
//         <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
//         <Route path="/addEmployee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
//         <Route path="/allEmployee" element={<ProtectedRoute><AllEmployee /></ProtectedRoute>} />
//         <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
//         <Route path="/allCustomer" element={<ProtectedRoute><AllCustomer /></ProtectedRoute>} />
//         <Route path="/addNewProduct" element={<ProtectedRoute><AddNewProduct /></ProtectedRoute>} />
//         <Route path="/allProduct" element={<ProtectedRoute><AllProduct /></ProtectedRoute>} />

//         <Route path="/addCategory" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
//         <Route path="/addMainCategory" element={<ProtectedRoute><AddMainCategory /></ProtectedRoute>} />
//         <Route path="/addSubCategory" element={<ProtectedRoute><AddSubCategory /></ProtectedRoute>} />
//         <Route path="/viewallcategory" element={<ProtectedRoute><ViewCategory /></ProtectedRoute>} />
//         <Route path="/addproduct" element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
//         <Route path="/allproducts" element={<ProtectedRoute> <AllProduct/></ProtectedRoute>}/>
//         <Route path="/addbanner" element={<ProtectedRoute><AddBanner/></ProtectedRoute> }/>


//         <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
//         <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
//         <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
//         <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
//         <Route path="/email" element={<ProtectedRoute><Email /></ProtectedRoute>} />
//         <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
//         <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
//         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//         <Route path="/editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
//         <Route path="/utility" element={<ProtectedRoute><Utility /></ProtectedRoute>} />
//         <Route path="/sweetAlert" element={<ProtectedRoute><SweetAlert /></ProtectedRoute>} />
//         <Route path="/nestableList" element={<ProtectedRoute><NestableList /></ProtectedRoute>} />
//         <Route path="/animation" element={<ProtectedRoute><Animation /></ProtectedRoute>} />
//         <Route path="/swiperSlider" element={<ProtectedRoute><SwiperSlider /></ProtectedRoute>} />
//         <Route path="/form" element={<ProtectedRoute><Form /></ProtectedRoute>} />
//         <Route path="/table" element={<ProtectedRoute><Table /></ProtectedRoute>} />
        // <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
//         <Route path="/icon" element={<ProtectedRoute><Icon /></ProtectedRoute>} />
//         <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
//       </Route>
//     </Routes>
//         </Suspense>
    
//   </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./protected-route/protected-route";
import { AuthProvider } from "./context/AuthContext";
import Charts from "./pages/Charts"


// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Audience = lazy(() => import('./pages/Audience'));
const Company = lazy(() => import('./pages/Company'));
const Task = lazy(() => import('./pages/Task'));
const Leads = lazy(() => import('./pages/Leads'));
const Customer = lazy(() => import('./pages/Customer'));
const AddEmployee = lazy(() => import('./pages/AddEmployee'));
const AllEmployee = lazy(() => import('./pages/AllEmployee'));
const Attendance = lazy(() => import('./pages/Attendance'));
const AllCustomer = lazy(() => import('./pages/AllCustomer'));
const AddNewProduct = lazy(() => import('./pages/AddNewProduct'));

const AllProduct = lazy(() => import('./pages/products/allproduct'));
const AddProduct = lazy(() => import('./pages/products/addproduct'));
const AddCategory = lazy(() => import('./pages/category/AddCategory'));
const AddMainCategory = lazy(() => import('./pages/category/AddMainCategory'));
const AddSubCategory = lazy(() => import('./pages/category/AddSubCategory'));
const ViewCategory = lazy(() => import('./pages/category/ViewCategory'));

const AddBanner = lazy(() => import('./pages/banner/AddBanner'));
const AdsBanner = lazy(() => import('./pages/banner/AdsBanner'));
const AddPrint=lazy(()=>import('./pages/products/addprints'))
const Order=lazy(()=>import('./pages/Order'))


// Public components (no lazy-loading needed if they're small)
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ResetPassword from "./pages/ResetPassword";
import Error404 from "./pages/Error404"; 

function App() {
  return (
    <AuthProvider>
 <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/error404" element={<Error404 />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/audience" element={<ProtectedRoute><Audience /></ProtectedRoute>} />
            <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
            <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
            <Route path="/addEmployee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
            <Route path="/allEmployee" element={<ProtectedRoute><AllEmployee /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/allCustomer" element={<ProtectedRoute><AllCustomer /></ProtectedRoute>} />
            <Route path="/addNewProduct" element={<ProtectedRoute><AddNewProduct /></ProtectedRoute>} />
            <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
        
           
            
        <Route path="/addCategory" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
        <Route path="/addMainCategory" element={<ProtectedRoute><AddMainCategory /></ProtectedRoute>} />
        <Route path="/addSubCategory" element={<ProtectedRoute><AddSubCategory /></ProtectedRoute>} />
        <Route path="/viewallcategory" element={<ProtectedRoute><ViewCategory /></ProtectedRoute>} />
        <Route path="/addproduct" element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
        <Route path="/allproducts" element={<ProtectedRoute> <AllProduct/></ProtectedRoute>}/>
        <Route path="/addbanner" element={<ProtectedRoute><AddBanner/></ProtectedRoute> }/>
        <Route path="/adsbanner" element={<ProtectedRoute><AdsBanner/></ProtectedRoute> }/>
        <Route path="/addprint" element={<ProtectedRoute><AddPrint/></ProtectedRoute> }/>
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />


        <Route path="*" element={<Error404/>} />
            {/* Add more protected routes as needed */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
    </AuthProvider>
   
  );
}

export default App;

