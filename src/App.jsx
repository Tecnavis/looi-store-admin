import { HashRouter as Router, Routes, Route } from "react-router-dom";
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

