import React, { useState, useEffect, useContext } from 'react';
import { getReportSummary } from '../../api/report';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * ReportSection:
 *   • Fetches four pieces of data:
 *       1) lowStock            (SKUs with stock < 10)
 *       2) orderStatusSummary  (counts per status)
 *       3) pendingOrders       (all pending orders)
 *   • Renders them in four sub‐sections.
 */
export default function ReportSection() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    stockSummary: [],
    lowStock: [],
    orderStatusSummary: [],
    pendingOrders: [],
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReportSummary();
        setReportData(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === 'Staff' || user?.userType === 'Admin') {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="mt-8">Loading reports…</div>;
  }

  if (!['Staff', 'Admin'].includes(user.userType)) {
    return null; // Only staff/admin sees this section
  }

  const { stockSummary, lowStock, orderStatusSummary, pendingOrders } = reportData;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      {/* 1) Low‐Stock Items */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">Low-Stock Items (stock &lt; 10)</h3>
        {lowStock.length === 0 ? (
          <p className="text-gray-600">No low-stock items.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">SKU</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Stock Level</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((row) => (
                  <tr key={row.sku} className="border-b last:border-0">
                    <td className="px-4 py-2 text-sm">{row.sku}</td>
                    <td className="px-4 py-2 text-sm">{row.product_name}</td>
                    <td className="px-4 py-2 text-sm">{row.stock_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2) Order Status Summary */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">Order Status Summary</h3>
        <ul className="list-disc list-inside">
          {orderStatusSummary.map((row) => (
            <li key={row.order_status} className="text-sm">
              {row.order_status}: {row.count}
            </li>
          ))}
        </ul>
      </div>

      {/* 3) Pending Orders */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">Pending Orders</h3>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-600">No pending orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-4 py-2 text-sm">{row.id}</td>
                    <td className="px-4 py-2 text-sm">{row.customer_id}</td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(row.order_date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">${row.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
