import React, {useEffect,useState} from "react";
import axios from "axios";

const DashboardCards = () => {

const [stats,setStats] = useState({
orders:0,
revenue:0
});

useEffect(()=>{

axios.get("http://localhost:5000/api/dashboard")
.then(res=>{
setStats(res.data);
});

},[]);

return(

<div className="row">

<div className="col-md-6">

<div className="card">

<h4>Total Orders</h4>

<p>{stats.orders}</p>

</div>

</div>

<div className="col-md-6">

<div className="card">

<h4>Total Revenue</h4>

<p>₹{stats.revenue}</p>

</div>

</div>

</div>

);

};

export default DashboardCards;