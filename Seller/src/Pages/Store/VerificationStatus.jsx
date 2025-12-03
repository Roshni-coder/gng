import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdVerified, MdUpload, MdCheckCircle, MdPending, MdError } from "react-icons/md";
import { FiFileText, FiCamera, FiCreditCard, FiShield } from "react-icons/fi";

function VerificationStatus() {
  const [data, setData] = useState({
    status: "Pending",
    documents: [],
    completionPercentage: 0,
    requirements: [
      { name: "Identity Proof", key: "identity", status: "pending", required: true },
      { name: "Business Registration", key: "business", status: "pending", required: true },
      { name: "GST Certificate", key: "gst", status: "pending", required: false },
      { name: "Bank Details", key: "bank", status: "pending", required: true },
      { name: "Address Proof", key: "address", status: "pending", required: true }
    ],
    verifiedAt: null
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/verification`, {
          headers: { stoken }
        });
        if (res.data.success && res.data.data) {
          setData(prev => ({ 
            ...prev, 
            status: res.data.data.isApproved ? 'Verified' : 'Pending',
            ...res.data.data.verificationStatus
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async (docType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(docType);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', docType);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/verification`,
          formData,
          { headers: { stoken, 'Content-Type': 'multipart/form-data' } }
        );
        if (res.data.success) {
          alert("Document uploaded successfully!");
          setData(prev => ({
            ...prev,
            requirements: prev.requirements.map(r => 
              r.key === docType ? { ...r, status: 'pending_review' } : r
            )
          }));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to upload document");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "verified": return "text-green-600 bg-green-100";
      case "pending_review": return "text-yellow-600 bg-yellow-100";
      case "rejected": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "verified": return <MdCheckCircle className="text-green-500 text-xl" />;
      case "pending_review": return <MdPending className="text-yellow-500 text-xl" />;
      case "rejected": return <MdError className="text-red-500 text-xl" />;
      default: return <MdUpload className="text-gray-400 text-xl" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "verified": return "Verified";
      case "pending_review": return "Under Review";
      case "rejected": return "Rejected";
      default: return "Not Submitted";
    }
  };

  const getDocIcon = (key) => {
    switch(key) {
      case "identity": return <FiCamera />;
      case "business": return <FiFileText />;
      case "gst": return <FiFileText />;
      case "bank": return <FiCreditCard />;
      case "address": return <FiFileText />;
      default: return <FiFileText />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const completedCount = data.requirements.filter(r => r.status === 'verified').length;
  const progressPercentage = (completedCount / data.requirements.length) * 100;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Verification Status</h1>
          <p className="text-sm text-gray-500">Complete verification to unlock all features</p>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`rounded-xl p-6 border-2 ${data.status === 'Verified' ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${data.status === 'Verified' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {data.status === 'Verified' ? (
              <MdVerified className="text-4xl text-green-600" />
            ) : (
              <FiShield className="text-4xl text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              {data.status === 'Verified' ? 'Your Store is Verified!' : 'Verification In Progress'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {data.status === 'Verified' 
                ? `Verified on ${new Date(data.verifiedAt).toLocaleDateString()}`
                : `${completedCount} of ${data.requirements.length} documents verified`}
            </p>
          </div>
          {data.status === 'Verified' && (
            <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full">
              <MdVerified />
              <span className="font-medium">Verified Seller</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {data.status !== 'Verified' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Verification Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MdVerified className="text-2xl text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Trust Badge</p>
            <p className="text-sm text-gray-500">Builds customer confidence</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiCreditCard className="text-2xl text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Faster Payouts</p>
            <p className="text-sm text-gray-500">Priority payment processing</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiShield className="text-2xl text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Higher Limits</p>
            <p className="text-sm text-gray-500">Increased selling limits</p>
          </div>
        </div>
      </div>

      {/* Document Requirements */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Required Documents</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {data.requirements.map((doc, i) => (
            <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
              <div className={`p-3 rounded-xl ${doc.status === 'verified' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {getDocIcon(doc.key)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-800">{doc.name}</h4>
                  {doc.required && (
                    <span className="text-xs text-red-500">Required</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {doc.key === 'identity' && 'PAN Card, Aadhaar, or Passport'}
                  {doc.key === 'business' && 'GST Registration or Shop License'}
                  {doc.key === 'gst' && 'GST Certificate (if applicable)'}
                  {doc.key === 'bank' && 'Cancelled cheque or bank statement'}
                  {doc.key === 'address' && 'Utility bill or rent agreement'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  {getStatusText(doc.status)}
                </span>

                {doc.status !== 'verified' && doc.status !== 'pending_review' && (
                  <button
                    onClick={() => handleUpload(doc.key)}
                    disabled={uploading === doc.key}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <MdUpload />
                    {uploading === doc.key ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2">📋 Document Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All documents should be clear and readable</li>
          <li>• Accepted formats: JPG, PNG, PDF (max 5MB)</li>
          <li>• Documents should be valid and not expired</li>
          <li>• Verification usually takes 24-48 hours</li>
          <li>• Contact support if your document is rejected</li>
        </ul>
      </div>
    </div>
  );
}

export default VerificationStatus;
