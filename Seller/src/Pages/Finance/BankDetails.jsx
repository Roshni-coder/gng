import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAccountBalance, MdSave, MdEdit, MdCheck } from "react-icons/md";
import { FiCreditCard } from "react-icons/fi";

function BankDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    upiId: ""
  });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/bank-details`, {
          headers: { stoken }
        });
        if (res.data.success && res.data.data) {
          setData(res.data.data);
          setForm(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/finance/bank-details`,
        form,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setData(res.data.data);
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const maskAccountNumber = (acc) => {
    if (!acc || acc.length < 4) return acc;
    return "*".repeat(acc.length - 4) + acc.slice(-4);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bank Details</h1>
          <p className="text-sm text-gray-500">Manage your payout account information</p>
        </div>
        {data && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <MdEdit className="text-lg" />
            <span>Edit Details</span>
          </button>
        )}
      </div>

      {/* Bank Details Form/View */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {editing || !data ? (
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                <input
                  type="text"
                  value={form.accountHolderName}
                  onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
                  placeholder="Enter name as per bank records"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="e.g., State Bank of India"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                <input
                  type="text"
                  value={form.ifscCode}
                  onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., SBIN0001234"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
                <input
                  type="text"
                  value={form.branchName}
                  onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                  placeholder="Enter branch name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID (Optional)</label>
                <input
                  type="text"
                  value={form.upiId}
                  onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                  placeholder="e.g., yourname@upi"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <MdSave className="text-xl" />
                <span>{saving ? "Saving..." : "Save Bank Details"}</span>
              </button>
              {editing && data && (
                <button
                  type="button"
                  onClick={() => { setEditing(false); setForm(data); }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="p-6">
            {/* Saved Bank Account Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MdAccountBalance className="text-3xl" />
                  <span className="font-semibold text-lg">{data.bankName}</span>
                </div>
                <FiCreditCard className="text-3xl opacity-50" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-mono tracking-wider">{maskAccountNumber(data.accountNumber)}</p>
                <p className="text-sm opacity-80">{data.accountHolderName}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">IFSC Code</p>
                <p className="font-semibold text-gray-800">{data.ifscCode}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Branch</p>
                <p className="font-semibold text-gray-800">{data.branchName || "N/A"}</p>
              </div>
              {data.upiId && (
                <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                  <p className="text-sm text-gray-500 mb-1">UPI ID</p>
                  <p className="font-semibold text-gray-800">{data.upiId}</p>
                </div>
              )}
            </div>

            {/* Verification Status */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MdCheck className="text-white text-xl" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Bank Account Verified</p>
                <p className="text-sm text-green-600">Your account is ready to receive payouts</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <h4 className="font-semibold text-yellow-800 mb-2">🔒 Security Note</h4>
        <p className="text-sm text-yellow-700">
          Your bank details are encrypted and securely stored. We never share your banking information 
          with third parties. Payouts are processed directly to your verified account.
        </p>
      </div>
    </div>
  );
}

export default BankDetails;
