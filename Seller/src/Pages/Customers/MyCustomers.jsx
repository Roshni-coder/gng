import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { LuSearch, LuUsers, LuMail, LuPhone, LuDownload } from "react-icons/lu";
import { exportToExcel, CUSTOMER_EXPORT_COLUMNS } from "../../utils/exportUtils";

function MyCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/customers/my-customers`, {
          headers: { stoken }
        });
        if (res.data.success) setCustomers(res.data.customers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stoken]);

  const filtered = customers.filter(c => 
    c.name?.toLowerCase().includes(filter.toLowerCase()) || 
    c.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Customers</h1>
          <p className="text-sm text-gray-500 mt-1">People who have purchased from your store</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportToExcel(customers, 'customers', CUSTOMER_EXPORT_COLUMNS)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <LuDownload className="w-4 h-4" />
            Export
          </button>
          <div className="relative w-full md:w-64">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span>Loading customers...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <LuUsers className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No customers found</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((cust) => (
                  <tr key={cust._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {cust.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cust.name}</p>
                          <p className="text-xs text-gray-500">ID: #{cust._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <LuMail className="w-3.5 h-3.5 text-gray-400" />
                          {cust.email}
                        </div>
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <LuPhone className="w-3.5 h-3.5 text-gray-400" />
                            {cust.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {cust.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-900">{formatINR(cust.totalSpent)}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {new Date(cust.lastOrderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filtered.length}</span> of <span className="font-medium text-gray-700">{customers.length}</span> customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCustomers;