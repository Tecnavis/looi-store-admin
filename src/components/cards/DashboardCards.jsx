import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

const DashboardCards = () => {
    const [totalCustomers,setTotalCustomers]=useState('');
    const [orderCount,setOrderCount]=useState('');

    useEffect(()=>{
        const fetchCustomers = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/total-users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setTotalCustomers(response.data);
            } catch (err) {
                console.log('Error fetching customers', err);
            }
        };
        const fetchOrderCount = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get('/getordercount', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setOrderCount(response.data);
            } catch (err) {
                console.log('Error fetching customers', err);
            }
        };
        fetchOrderCount();
        fetchCustomers();
    },[]);
console.log(totalCustomers)
console.log(orderCount);

  return (
    <div className="row mb-30">
        <div className="col-lg-6 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3><CountUp end={orderCount.totalOrderCount}/></h3>
                    <p>Orders</p>
                    {/* <Link to="#">Excluding orders in transit</Link> */}
                </div>
                <div className="right">
                  
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-bag-shopping"></i></span>
                    </div>
                </div>
            </div>
        </div>
         
        <div className="col-lg-6 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3><CountUp end={totalCustomers.userCount}/></h3>
                    <p>Customers</p>
                    {/* <Link to="#">See details</Link> */}
                </div>
                <div className="right">
                   
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-user"></i></span>
                    </div>
                </div>
            </div>
        </div>

        {/* <div className="col-lg-3 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3>$<CountUp end={34152}/></h3>
                    <p>Shipping fees are not</p>
                    <Link to="#">View net earnings</Link>
                </div>
                <div className="right">
                    <span className="text-primary">+16.24%</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-dollar-sign"></i></span>
                    </div>
                </div>
            </div>
        </div> */}
       
        {/* <div className="col-lg-3 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3>$<CountUp end={724152}/></h3>
                    <p>My Balance</p>
                    <Link to="#">Withdraw</Link>
                </div>
                <div className="right">
                    <span className="text-primary">+16.24%</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-credit-card"></i></span>
                    </div>
                </div>
            </div>
        </div> */}
    </div>
  )
}

export default DashboardCards