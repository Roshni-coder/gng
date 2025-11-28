import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminReport = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [orders, setOrders] = useState([]);
  const [sellerCounts, setSellerCounts] = useState({});

  const allOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`);
      const filled = res.data.orders.flatMap((order) =>
        order.items.map((item) => ({
          ...item,
          placedAt: order.placedAt,
        }))
      );
      setOrders(filled);
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
  };

  useEffect(() => {
    const counts = {};
    const filteredOrders = orders.filter((orderItem) => {
      const placedDate = new Date(orderItem.placedAt);
      const month = placedDate.toLocaleString("default", { month: "long" });
      const year = placedDate.getFullYear();
      return month === selectedMonth && year === selectedYear;
    });

    filteredOrders.forEach((orderItem) => {
      const name = orderItem.sellerId?.name;
      const sellerId = orderItem.sellerId?._id;
      const key = sellerId;
      const price = orderItem.price ?? 0;
      const quantity = orderItem.quantity ?? 1;
      const total = price * quantity;
      const brandName = orderItem.sellerId?.nickName ?? "N/A";


      if (!counts[key]) {
        counts[key] = {
          sellerId: key,
          name,
          brandName,
          orderCount: 1,
          totalSales: total,
        };
      } else {
        counts[key].orderCount += 1;
        counts[key].totalSales += total;
      }
    });

    setSellerCounts(counts);
  }, [orders, selectedMonth, selectedYear]);

  useEffect(() => {
    allOrders();
  }, []);

  const report = Object.values(sellerCounts);
  const totalRevenue = report.reduce((sum, s) => sum + s.totalSales, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Monthly Sales Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Month: ${selectedMonth}  Year: ${selectedYear}`, 14, 25);

    const tableData = report.map((item) => [
      item.name,
      item.brandName,
      item.sellerId,
      item.orderCount,
      `Rs. ${item.totalSales.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
    ]);

    autoTable(doc, {
      head: [["Seller","Brand","Seller ID","Total Orders","Total Sales (INR)"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], halign: "center", fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 60 },
        3: { halign: "center", cellWidth: 30 },
        4: { halign: "right", cellWidth: 50 },
      },
    });

    autoTable(doc, {
      body: [
        [
          "",
          "",
          "Total Revenue",
          `Rs. ${totalRevenue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}`,
        ],
      ],
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontStyle: "bold", halign: "right" },
      columnStyles: {
        2: { fontStyle: "bold", halign: "right" },
        3: { fontStyle: "bold", halign: "right" },
      },
    });

    doc.save(`Monthly_Report_${selectedMonth}_${selectedYear}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          📊 Monthly Sales Report
        </h2>

        {/* Filters & Button */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            className="px-8 py-2 rounded bg-gray-50 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>
          <select
            className="px-8 py-2 rounded bg-gray-50 text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-sm text-sm"
          >
            📄 Generate PDF
          </button>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border !border-gray-300 text-sm text-gray-700">
            <thead className="bg-gray-100 text-left text-[14px]">
              <tr>
                <th className="px-4 py-4 border border-gray-300 text-center">Seller ID</th>
                <th className="px-4 py-4 border border-gray-300 text-center">Seller Name</th>
                <th className="px-4 py-4 border border-gray-300 text-center">Brand Name</th>
                <th className="px-4 py-4 border border-gray-300 text-center">Total Orders</th>
                <th className="px-4 py-4 border border-gray-300 text-center">Total Sales (₹)</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-4 py-3 border border-gray-300 text-center">{item.sellerId}</td>
                  <td className="px-4 py-3 border border-gray-300 text-center font-medium">{item.name}</td>
                   <td className="px-4 py-3 border border-gray-300 text-center">{item.brandName}</td>
                  <td className="px-4 py-3 border border-gray-300  text-center">{item.orderCount}</td>
                  <td className="px-4 py-3 border border-gray-300  text-center">
                    ₹{item.totalSales.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="px-16 py-3  font-bold text-right border-r border-gray-300" colSpan={4}>
                  Total Revenue :
                </td>
                <td className="px-4 py-3 font-bold text-center">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
