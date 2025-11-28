import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAttachMoney, MdTrendingUp, MdPieChart, MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { FiDollarSign, FiTrendingUp, FiPieChart, FiCalendar } from "react-icons/fi";

function MarketingBudget() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'advertising',
    amount: '',
    period: 'monthly',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetRes, summaryRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/budgets`, {
          headers: { stoken }
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/budget-summary`, {
          headers: { stoken }
        })
      ]);
      if (budgetRes.data.success) setBudgets(budgetRes.data.data || []);
      if (summaryRes.data.success) setSummary(summaryRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/budgets`, formData, {
        headers: { stoken }
      });
      setShowModal(false);
      setFormData({
        category: 'advertising',
        amount: '',
        period: 'monthly',
        startDate: '',
        endDate: '',
        notes: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const categoryColors = {
    advertising: 'bg-blue-100 text-blue-700',
    promotions: 'bg-green-100 text-green-700',
    influencer: 'bg-purple-100 text-purple-700',
    content: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Marketing Budget</h1>
          <p className="text-gray-600">Track and manage your marketing spend</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MdAdd className="text-xl" />
          Add Budget
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiDollarSign className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-xl font-bold text-gray-800">{formatINR(summary.totalBudget)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Spent</p>
                <p className="text-xl font-bold text-gray-800">{formatINR(summary.spent)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiPieChart className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-xl font-bold text-gray-800">{formatINR(summary.remaining)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiCalendar className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ROI</p>
                <p className="text-xl font-bold text-gray-800">{summary.roi || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Budget Allocations</h2>
        </div>
        {budgets.length === 0 ? (
          <div className="text-center py-16">
            <MdPieChart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No budget allocations yet</p>
            <p className="text-gray-400">Create your first marketing budget to start tracking</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {budgets.map((budget, idx) => (
              <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${categoryColors[budget.category] || categoryColors.other}`}>
                      {budget.category}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{formatINR(budget.amount)}</p>
                      <p className="text-sm text-gray-500">{budget.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {budget.startDate && new Date(budget.startDate).toLocaleDateString()}
                        {budget.endDate && ` - ${new Date(budget.endDate).toLocaleDateString()}`}
                      </p>
                      {budget.notes && <p className="text-xs text-gray-400">{budget.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <MdEdit />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Spent: {formatINR(budget.spent || 0)}</span>
                    <span>{Math.round(((budget.spent || 0) / budget.amount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((budget.spent || 0) / budget.amount) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add Marketing Budget</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="advertising">Advertising</option>
                  <option value="promotions">Promotions</option>
                  <option value="influencer">Influencer Marketing</option>
                  <option value="content">Content Creation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter budget amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Additional notes..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketingBudget;
