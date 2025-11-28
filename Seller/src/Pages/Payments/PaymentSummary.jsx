import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineReceiptLong, MdTrendingUp, MdAccountBalance, MdPayments } from "react-icons/md";
import { FiArrowRight, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function PaymentSummary() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalPayouts: 0,
    pendingBalance: 0,
    availableBalance: 0,
    commissionPaid: 0,
    monthlyStats: [],
    recentActivity: []
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
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/payment-summary`, {
          headers: { stoken }
        });
        if (res.data.success) setSummary(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const QuickAction = ({ icon: Icon, title, desc, link, color }) => (
    <a 
      href={link}
      className={`flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all group`}
    >
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <FiArrowRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
    </a>
  );

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payment Summary</h1>
        <p className="text-sm text-gray-500">Complete overview of your payment activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Main Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3 opacity-90">
                <MdTrendingUp className="text-xl" />
                <span className="text-sm">Total Revenue</span>
              </div>
              <h3 className="text-2xl font-bold">{formatINR(summary.totalRevenue)}</h3>
              <p className="text-sm mt-2 opacity-80">Lifetime earnings</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3 opacity-90">
                <MdPayments className="text-xl" />
                <span className="text-sm">Available Balance</span>
              </div>
              <h3 className="text-2xl font-bold">{formatINR(summary.availableBalance)}</h3>
              <p className="text-sm mt-2 opacity-80">Ready to withdraw</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3 text-yellow-600">
                <FiClock className="text-xl" />
                <span className="text-sm">Pending</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatINR(summary.pendingBalance)}</h3>
              <p className="text-sm text-gray-500 mt-2">In settlement</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3 text-purple-600">
                <MdAccountBalance className="text-xl" />
                <span className="text-sm">Total Payouts</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatINR(summary.totalPayouts)}</h3>
              <p className="text-sm text-gray-500 mt-2">Withdrawn to bank</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAction 
              icon={MdPayments}
              title="Request Payout"
              desc="Withdraw available balance"
              link="/seller/payments/payout-requests"
              color="bg-green-500"
            />
            <QuickAction 
              icon={MdAccountBalance}
              title="Bank Details"
              desc="Manage payment methods"
              link="/seller/payments/bank-details"
              color="bg-blue-500"
            />
            <QuickAction 
              icon={MdOutlineReceiptLong}
              title="View Transactions"
              desc="Complete transaction history"
              link="/seller/payments/transaction-history"
              color="bg-purple-500"
            />
            <QuickAction 
              icon={MdTrendingUp}
              title="Commission Details"
              desc="View platform fees"
              link="/seller/payments/commission-details"
              color="bg-orange-500"
            />
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Monthly Payment Breakdown</h3>
            
            {summary.monthlyStats?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Month</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Orders</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Commission</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Net Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.monthlyStats?.map((month, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{month.month}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{month.orders}</td>
                        <td className="py-3 px-4 text-right text-gray-800">{formatINR(month.revenue)}</td>
                        <td className="py-3 px-4 text-right text-red-600">-{formatINR(month.commission)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">{formatINR(month.netEarnings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Recent Activity</h3>
              <a href="/seller/payments/transaction-history" className="text-sm text-blue-600 hover:underline">
                View All
              </a>
            </div>

            {summary.recentActivity?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No recent activity</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {summary.recentActivity?.map((activity, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'credit' ? 'bg-green-100' :
                      activity.type === 'debit' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'credit' ? (
                        <FiCheckCircle className="text-green-600" />
                      ) : activity.type === 'debit' ? (
                        <FiAlertCircle className="text-red-600" />
                      ) : (
                        <FiClock className="text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{activity.description}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>

                    <span className={`font-semibold ${
                      activity.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.type === 'credit' ? '+' : '-'}{formatINR(activity.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Commission Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h4 className="font-semibold text-purple-800 mb-2">📊 Commission Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-purple-600">Total Commission</p>
                <p className="text-lg font-bold text-purple-800">{formatINR(summary.commissionPaid)}</p>
              </div>
              <div>
                <p className="text-sm text-purple-600">Average Rate</p>
                <p className="text-lg font-bold text-purple-800">{summary.avgCommissionRate || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-purple-600">This Month</p>
                <p className="text-lg font-bold text-purple-800">{formatINR(summary.monthlyCommission || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-purple-600">Tax Deducted</p>
                <p className="text-lg font-bold text-purple-800">{formatINR(summary.taxDeducted || 0)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentSummary;
