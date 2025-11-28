import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductPerformance() {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reports/product-performance`);
        if (data.success) setPerformance(data.data);
      } catch (error) {
        console.error('Failed to fetch product performance:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, []);

  return (
    <div className="container card bg-white shadow-md rounded px-10">
      <h1 className="text-[18px] py-4 font-[600]">Product Performance Report</h1>
      {loading ? (
        <div>Loading performance data...</div>
      ) : !performance.length ? (
        <div>No product performance data available.</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Title</th>
              <th>Total Sales</th>
              <th>Revenue</th>
              <th>Conversion Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((prod) => (
              <tr key={prod.productId}>
                <td>{prod.productId}</td>
                <td>{prod.title}</td>
                <td>{prod.totalSales}</td>
                <td>{prod.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                <td>{prod.conversionRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductPerformance;
