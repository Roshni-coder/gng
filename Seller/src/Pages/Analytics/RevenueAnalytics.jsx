import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuDownload, LuTrendingUp, LuTrendingDown, LuWallet, LuInfo } from "react-icons/lu";

function RevenueAnalytics() {
  const [data, setData] = useState({
    totalRevenue: 0,
    previousPeriodRevenue: 0,
    growthRate: 0,
    monthlyData: [],
    topCategories: [],
    revenueByPaymentMethod: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("6months");
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
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/analytics/revenue?period=${period}`, {
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
  }, [period]);

  const maxRevenue = Math.max(...(data.monthlyData?.map(d => d.revenue) || [1]));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Revenue Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your earnings and revenue trends</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none bg-white transition-all"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <LuDownload className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg shadow-emerald-200">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <LuWallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Total Revenue</span>
                </div>
                <h3 className="text-3xl font-bold">{formatINR(data.totalRevenue)}</h3>
                <div className="flex items-center gap-1.5 mt-3 text-sm text-white/80">
                  {data.growthRate >= 0 ? <LuTrendingUp className="w-4 h-4" /> : <LuTrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(data.growthRate)}% {data.growthRate >= 0 ? 'increase' : 'decrease'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <LuTrendingDown className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Period</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatINR(data.previousPeriodRevenue)}</h3>
              <p className="text-xs text-gray-400 mt-1">For comparison</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <LuTrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Monthly</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatINR(data.totalRevenue / (data.monthlyData?.length || 1))}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Per month average</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Monthly Revenue Trend</h3>
            
            {data.monthlyData?.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No revenue data available
              </div>
            ) : (
              <div className="h-64 flex items-end gap-2">
                {data.monthlyData?.map((month, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs text-gray-600 mb-1">{formatINR(month.revenue)}</span>
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500"
                        style={{ height: `${(month.revenue / maxRevenue) * 200}px`, minHeight: '20px' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{month.month}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category & Payment Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Revenue by Category</h3>
              
              {data.topCategories?.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No category data available</p>
              ) : (
                <div className="space-y-4">
                  {data.topCategories?.map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-gray-900">{cat.category}</span>
                        <span className="text-gray-600">{formatINR(cat.revenue)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            i === 0 ? 'bg-emerald-500' :
                            i === 1 ? 'bg-indigo-500' :
                            i === 2 ? 'bg-purple-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${(cat.revenue / data.totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Methods</h3>
              
              {data.revenueByPaymentMethod?.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No payment data available</p>
              ) : (
                <div className="space-y-3">
                  {data.revenueByPaymentMethod?.map((method, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          method.method === 'UPI' ? 'bg-purple-500' :
                          method.method === 'Card' ? 'bg-indigo-500' :
                          method.method === 'COD' ? 'bg-amber-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="font-medium text-gray-900 text-sm">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatINR(method.revenue)}</p>
                        <p className="text-xs text-gray-500">{method.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <LuInfo className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-900 text-sm mb-2">Revenue Insights</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Your best performing month was {data.monthlyData?.[0]?.month || 'N/A'}</li>
                  <li>• {data.topCategories?.[0]?.category || 'Your products'} generates the most revenue</li>
                  <li>• Consider running promotions during slower months to boost sales</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RevenueAnalytics;
