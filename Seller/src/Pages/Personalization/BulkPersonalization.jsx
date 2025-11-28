import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdUpload, MdDownload, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import { FiFile, FiUploadCloud, FiDownload } from "react-icons/fi";

function BulkPersonalization() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/bulk-jobs`, {
        headers: { stoken }
      });
      if (res.data.success) setJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/bulk-upload`, formData, {
        headers: { 
          stoken,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      fetchJobs();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      failed: "bg-red-100 text-red-700 border-red-200"
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      processing: "🔄",
      completed: "✅",
      failed: "❌"
    };
    return icons[status] || "⏳";
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bulk Personalization</h1>
        <p className="text-sm text-gray-500">Upload personalization options in bulk via CSV</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Upload Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📤 Upload CSV File</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all">
              {uploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUploadCloud className="text-3xl text-blue-600 animate-bounce" />
                  </div>
                  <p className="text-gray-700">Uploading... {uploadProgress}%</p>
                  <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiUploadCloud className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-700 mb-2">
                      <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">CSV or XLSX files only</p>
                  </label>
                </>
              )}
            </div>

            {/* Download Template */}
            <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FiFile className="text-xl text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">Download Template</p>
                  <p className="text-sm text-gray-500">Use our template for correct formatting</p>
                </div>
              </div>
              <a 
                href="/templates/personalization-template.csv"
                download
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white flex items-center gap-2 text-gray-700"
              >
                <FiDownload /> Download
              </a>
            </div>
          </div>

          {/* CSV Format Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-800 mb-4">📋 CSV Format Guide</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 px-3 text-blue-800">Column</th>
                    <th className="text-left py-2 px-3 text-blue-800">Required</th>
                    <th className="text-left py-2 px-3 text-blue-800">Description</th>
                    <th className="text-left py-2 px-3 text-blue-800">Example</th>
                  </tr>
                </thead>
                <tbody className="text-blue-700">
                  <tr className="border-b border-blue-100">
                    <td className="py-2 px-3 font-mono">name</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">Option name</td>
                    <td className="py-2 px-3">Custom Text</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 px-3 font-mono">type</td>
                    <td className="py-2 px-3">Yes</td>
                    <td className="py-2 px-3">text, image, select, gift</td>
                    <td className="py-2 px-3">text</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 px-3 font-mono">price</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">Additional price in INR</td>
                    <td className="py-2 px-3">50</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-2 px-3 font-mono">description</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">Brief description</td>
                    <td className="py-2 px-3">Add custom text</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">active</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">true or false</td>
                    <td className="py-2 px-3">true</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upload History */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">📁 Upload History</h3>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiFile className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>No uploads yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className="text-2xl">{getStatusIcon(job.status)}</div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{job.fileName}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{new Date(job.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>{job.totalRows} rows</span>
                        {job.status === 'completed' && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">{job.successCount} success</span>
                            {job.errorCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-red-600">{job.errorCount} errors</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>

                    {job.errorFile && (
                      <a 
                        href={job.errorFile}
                        download
                        className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Download Errors
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <MdInfo /> Important Notes
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Maximum 1000 rows per upload</li>
              <li>• File size limit: 5MB</li>
              <li>• Duplicate names will be updated, not created as new</li>
              <li>• Processing may take a few minutes for large files</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default BulkPersonalization;
