import React, { useContext, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DigiContext } from '../../context/DigiContext';
import axiosInstance from '../../../axiosConfig';

// Custom tooltip — shows order count and sales (₹) with clear formatting,
// themed to match light/dark mode instead of the default browser-style box.
const CustomTooltip = ({ active, payload, label, isLightTheme }) => {
  if (!active || !payload || !payload.length) return null;
  const bg = isLightTheme ? '#ffffff' : '#1e2a38';
  const text = isLightTheme ? '#1a1a1a' : '#e8edf2';
  const border = isLightTheme ? '#e2e6ea' : '#2f3f4f';
  return (
    <div
      style={{
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        fontSize: '13px',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, display: 'inline-block' }}></span>
          <span>{entry.name === 'orderCount' ? 'Orders' : 'Sales (₹)'}:</span>
          <strong>{entry.name === 'totalSales' ? `₹${Number(entry.value).toLocaleString('en-IN')}` : entry.value}</strong>
        </div>
      ))}
    </div>
  );
};

const AreaChartComponent = () => {
  const { isLightTheme, isRechartHeight } = useContext(DigiContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const axisColor = isLightTheme ? 'hsl(0deg 0% 0% / 60%)' : 'hsl(0deg 0% 89.41% / 70%)';
  const gridColor = isLightTheme ? '#e9edf1' : '#2f3f4f';

  useEffect(() => {
    const fetchOrdersPerDay = async () => {
      try {
        const response = await axiosInstance.get('/getOrdersPerDay');
        const data = response.data.ordersPerDay.map((order) => ({
          date: order._id,
          orderCount: order.orderCount,
          totalSales: order.totalSales,
        }));
        setChartData(data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersPerDay();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: isRechartHeight || 300 }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading chart...</span>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-muted"
        style={{ minHeight: isRechartHeight || 300 }}
      >
        <i className="fa-light fa-chart-line fa-2x mb-2"></i>
        <p className="mb-0">No order data available yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#037fe0" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#037fe0" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffa940" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#ffa940" stopOpacity={0.03} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="date"
          stroke={axisColor}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: gridColor }}
        />

        {/* Left axis: order count — small whole numbers */}
        <YAxis
          yAxisId="orders"
          stroke={axisColor}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={40}
        />

        {/* Right axis: sales in ₹ — separate scale so it doesn't flatten the orders line */}
        <YAxis
          yAxisId="sales"
          orientation="right"
          stroke={axisColor}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          width={50}
        />

        <Tooltip content={<CustomTooltip isLightTheme={isLightTheme} />} />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => (value === 'orderCount' ? 'Orders' : 'Sales (₹)')}
        />

        <Area
          yAxisId="orders"
          type="monotone"
          dataKey="orderCount"
          stroke="#037fe0"
          strokeWidth={2.5}
          fill="url(#ordersGradient)"
          activeDot={{ r: 5 }}
        />

        <Area
          yAxisId="sales"
          type="monotone"
          dataKey="totalSales"
          stroke="#ffa940"
          strokeWidth={2.5}
          fill="url(#salesGradient)"
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
