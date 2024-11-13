import React, { useContext, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DigiContext } from '../../context/DigiContext';
import axiosInstance from '../../../axiosConfig';

const AreaChartComponent = () => {
  const { isLightTheme, isRechartHeight } = useContext(DigiContext);
  const [chartData, setChartData] = useState([]);
  const axisColor = isLightTheme ? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)';

  useEffect(() => {
    const fetchOrdersPerDay = async () => {
      try {
        const response = await axiosInstance.get('/getOrdersPerDay');
        const data = response.data.ordersPerDay.map(order => ({
          date: order._id, // The date string from aggregation
          orderCount: order.orderCount,
          totalSales: order.totalSales
        }));
        setChartData(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrdersPerDay();
  }, []);

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <AreaChart data={chartData}>
        <CartesianGrid stroke="#334652" strokeDasharray="3" />
        <XAxis dataKey="date" stroke={axisColor} label={{ value: "Date", position: "insideBottomRight", offset: -5 }} />
        <YAxis stroke={axisColor} label={{ value: "Orders", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />

        {/* Displaying order count per day */}
        <Area type="monotone" dataKey="orderCount" stroke="#037fe0" fill="#2a4d76" strokeWidth={2} fillOpacity={0.6} />

        {/* Displaying total sales per day */}
        <Area type="monotone" dataKey="totalSales" stroke="#ffc658" fill="#f7a35c" strokeWidth={2} fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
