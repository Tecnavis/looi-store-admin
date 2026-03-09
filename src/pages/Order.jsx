import React, {useEffect,useState} from "react";
import axios from "axios";

const OrderListTable = () => {

const [orders,setOrders] = useState([]);

useEffect(()=>{

axios.get("http://localhost:5000/api/orders")
.then(res=>{
setOrders(res.data);
});

},[]);

return(

<table className="table">

<thead>

<tr>
<th>Order ID</th>
<th>Customer</th>
<th>Total</th>
<th>Payment</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{orders.map(order=>(

<tr key={order._id}>

<td>{order._id}</td>

<td>{order.customer?.name}</td>

<td>₹{order.totalAmount}</td>

<td>{order.paymentMethod}</td>

<td>{order.orderStatus}</td>

</tr>

))}

</tbody>

</table>

);

};

export default OrderListTable;