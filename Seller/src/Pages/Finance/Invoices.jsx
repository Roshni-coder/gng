import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatINR } from "../../utils/orderMetrics";
import { MdReceipt, MdDownload, MdPrint, MdSearch } from "react-icons/md";
import { FiChevronLeft, FiChevronRight, FiFileText } from "react-icons/fi";

function Invoices() {
  const [data, setData] = useState({ invoices: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/invoices?page=${page}`,
          { headers: { stoken } }
        );
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handlePrint = (invoice) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #f5f5f5; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>${invoice.invoiceNumber}</p>
          </div>
          <div class="details">
            <div>
              <strong>Bill To:</strong><br/>
              ${invoice.customer.name}<br/>
              ${invoice.customer.email}<br/>
              ${invoice.customer.address?.address || ''}, ${invoice.customer.address?.city || ''}
            </div>
            <div>
              <strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}<br/>
              <strong>Order ID:</strong> ${invoice.orderId}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Total: ₹${invoice.total}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
          <p className="text-sm text-gray-500">View and download your order invoices</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <MdReceipt className="text-2xl text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Invoices</p>
            <h3 className="text-xl font-bold text-gray-800">{data.pagination.totalItems || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <FiFileText className="text-2xl text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">This Page</p>
            <h3 className="text-xl font-bold text-gray-800">{data.invoices.length}</h3>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <MdDownload className="text-2xl text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <h3 className="text-xl font-bold text-gray-800">
              {formatINR(data.invoices.reduce((acc, inv) => acc + inv.total, 0))}
            </h3>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading invoices...</p>
          </div>
        ) : data.invoices.length === 0 ? (
          <div className="p-12 text-center">
            <MdReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No invoices generated yet</p>
            <p className="text-sm text-gray-400 mt-1">Invoices are created for completed orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.invoices.map((invoice, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-600">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{invoice.customer.name}</p>
                      <p className="text-xs text-gray-400">{invoice.customer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{invoice.items.length} item(s)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">{formatINR(invoice.total)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <FiFileText />
                        </button>
                        <button
                          onClick={() => handlePrint(invoice)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                          title="Print"
                        >
                          <MdPrint />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {data.pagination.currentPage} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedInvoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Customer</h4>
              <p className="text-gray-800">{selectedInvoice.customer.name}</p>
              <p className="text-sm text-gray-500">{selectedInvoice.customer.email}</p>
              {selectedInvoice.customer.address && (
                <p className="text-sm text-gray-500 mt-1">
                  {selectedInvoice.customer.address.address}, {selectedInvoice.customer.address.city}
                </p>
              )}
            </div>

            {/* Items */}
            <table className="w-full text-sm mb-6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedInvoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatINR(item.price)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatINR(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end border-t border-gray-200 pt-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800">{formatINR(selectedInvoice.total)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handlePrint(selectedInvoice)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <MdPrint />
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;
