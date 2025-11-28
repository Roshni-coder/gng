import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdInventory, MdWarning, MdCheckCircle, MdDownload } from "react-icons/md";
import { FiPackage, FiAlertTriangle, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

function InventoryReports() {
  const [data, setData] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    inventoryValue: 0,
    lowStockProducts: [],
    topMovingProducts: [],
    slowMovingProducts: []
  });
  const [loading, setLoading] = useState(true);
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/analytics/inventory`, {
          headers: { stoken }
        });
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/analytics/export?type=inventory`, {
        headers: { stoken },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to export");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Reports</h1>
          <p className="text-sm text-gray-500">Monitor your stock levels and product performance</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2"
        >
          <MdDownload /> Export Report
        </button>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FiPackage className="text-xl" />
            <span className="text-sm font-medium">Total Products</span>
          </div>
          <h3 className="text-2xl font-bold">{data.totalProducts}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-green-600">
            <MdCheckCircle />
            <span className="text-sm">In Stock</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{data.inStock}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-yellow-600">
            <FiAlertTriangle />
            <span className="text-sm">Low Stock</span>
          </div>
          <h3 className="text-2xl font-bold text-yellow-600">{data.lowStock}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <MdWarning />
            <span className="text-sm">Out of Stock</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600">{data.outOfStock}</h3>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <MdInventory className="text-xl" />
            <span className="text-sm font-medium">Inventory Value</span>
          </div>
          <h3 className="text-2xl font-bold">{formatINR(data.inventoryValue)}</h3>
        </div>
      </div>

      {/* Stock Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Stock Distribution</h3>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
          <div 
            className="bg-green-500 h-full"
            style={{ width: `${data.totalProducts ? (data.inStock / data.totalProducts) * 100 : 0}%` }}
          ></div>
          <div 
            className="bg-yellow-500 h-full"
            style={{ width: `${data.totalProducts ? (data.lowStock / data.totalProducts) * 100 : 0}%` }}
          ></div>
          <div 
            className="bg-red-500 h-full"
            style={{ width: `${data.totalProducts ? (data.outOfStock / data.totalProducts) * 100 : 0}%` }}
          ></div>
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">In Stock ({data.inStock})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Low Stock ({data.lowStock})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Out of Stock ({data.outOfStock})</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {data.lowStockProducts?.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-yellow-200 flex items-center gap-2">
            <FiAlertTriangle className="text-yellow-600 text-xl" />
            <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
          </div>
          <div className="divide-y divide-yellow-100">
            {data.lowStockProducts?.slice(0, 5).map((product, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FiPackage className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">{product.stock} left</p>
                  <p className="text-xs text-gray-500">Min: {product.minStock || 10}</p>
                </div>
                <button className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Moving Products */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center gap-2">
            <FiTrendingUp className="text-green-500 text-xl" />
            <h3 className="font-semibold text-gray-800">Fast Moving Products</h3>
          </div>
          
          {data.topMovingProducts?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No data available</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.topMovingProducts?.map((product, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.soldCount} sold this month</p>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {product.growth}% ↑
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slow Moving Products */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center gap-2">
            <FiTrendingDown className="text-red-500 text-xl" />
            <h3 className="font-semibold text-gray-800">Slow Moving Products</h3>
          </div>
          
          {data.slowMovingProducts?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No data available</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.slowMovingProducts?.map((product, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-500">Last sold: {product.lastSold || 'Never'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{product.stock} in stock</p>
                    <p className="text-xs text-red-500">{product.daysSinceLastSale}+ days idle</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">📦 Inventory Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep popular items well-stocked to avoid missing sales</li>
          <li>• Consider promotions for slow-moving inventory</li>
          <li>• Set up low stock alerts to automate reordering</li>
          <li>• Review inventory value regularly to optimize cash flow</li>
        </ul>
      </div>
    </div>
  );
}

export default InventoryReports;
