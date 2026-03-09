import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardMainContent = () => {

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {

    axios
      .get("https://looi-store-server-izvs.onrender.com//api/dashboard/analytics")
      .then((res) => {
        setStats(res.data);
      });

  }, []);

  return (

    <div className="main-content">

      <div className="row">

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Total Revenue</h6>
            <h3>₹{stats.totalRevenue}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Total Orders</h6>
            <h3>{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Customers</h6>
            <h3>{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Products</h6>
            <h3>{stats.totalProducts}</h3>
          </div>
        </div>

      </div>

    </div>

  );
};

export default DashboardMainContent;