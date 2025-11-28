import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdSend, MdSearch, MdReply } from "react-icons/md";
import { FiClock, FiCheck, FiAlertCircle } from "react-icons/fi";

function RespondToReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [filter, setFilter] = useState("pending");
  const [submitting, setSubmitting] = useState(false);
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/respond-list?status=${filter}`, {
        headers: { stoken }
      });
      if (res.data.success) setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (reviewId) => {
    if (!responseText.trim()) return;
    
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/${reviewId}/respond`, 
        { response: responseText },
        { headers: { stoken } }
      );
      fetchReviews();
      setResponding(null);
      setResponseText("");
    } catch (err) {
      alert("Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MdStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
    ));
  };

  const templates = [
    "Thank you for your feedback! We're glad you had a positive experience.",
    "We appreciate you taking the time to share your thoughts.",
    "We're sorry to hear about your experience. We would like to make it right.",
    "Thank you for your valuable feedback. We're constantly working to improve."
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Respond to Reviews</h1>
          <p className="text-sm text-gray-500">Engage with customers and address their feedback</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Pending:</span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
            {reviews.filter(r => !r.response).length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-2">
            {[
              { value: "pending", label: "Pending", icon: FiClock },
              { value: "responded", label: "Responded", icon: FiCheck },
              { value: "all", label: "All", icon: null }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  filter === tab.value 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.icon && <tab.icon />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews */}
          {reviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <MdReply className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No Reviews to Respond</h3>
              <p className="text-gray-500 mt-2">All reviews have been addressed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={i} className={`bg-white border rounded-xl overflow-hidden ${
                  review.rating <= 2 ? 'border-red-200' : 'border-gray-200'
                }`}>
                  {/* Review Header */}
                  <div className={`p-5 ${review.rating <= 2 ? 'bg-red-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {review.customerName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{review.customerName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-sm">{renderStars(review.rating)}</div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {review.rating <= 2 && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
                          <FiAlertCircle /> Priority
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center gap-3 mb-3 bg-gray-50 rounded-lg p-3">
                      {review.productImage && (
                        <img src={review.productImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <span className="text-sm text-gray-600">{review.productName}</span>
                    </div>

                    {/* Review Content */}
                    {review.title && <h5 className="font-medium text-gray-800">{review.title}</h5>}
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>

                  {/* Response Section */}
                  {review.response ? (
                    <div className="p-5 bg-blue-50 border-t border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FiCheck className="text-green-600" />
                        <span className="text-sm font-medium text-green-600">Response sent</span>
                        <span className="text-xs text-gray-500">
                          {review.respondedAt && new Date(review.respondedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.response}</p>
                    </div>
                  ) : responding === review._id ? (
                    <div className="p-5 border-t border-gray-200">
                      {/* Quick Templates */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Quick templates:</p>
                        <div className="flex flex-wrap gap-2">
                          {templates.map((template, j) => (
                            <button
                              key={j}
                              onClick={() => setResponseText(template)}
                              className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                            >
                              {template.substring(0, 30)}...
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response to this review..."
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        rows={4}
                      ></textarea>

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => { setResponding(null); setResponseText(""); }}
                          className="flex-1 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitResponse(review._id)}
                          disabled={!responseText.trim() || submitting}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <MdSend /> Send Response
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={() => setResponding(review._id)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-2"
                      >
                        <MdReply /> Write Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Best Practices */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h4 className="font-semibold text-green-800 mb-3">✍️ Response Best Practices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <p className="font-medium text-green-800">Do:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Respond within 24-48 hours</li>
                  <li>• Thank them for their feedback</li>
                  <li>• Address specific concerns</li>
                  <li>• Offer solutions for issues</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-800">Don't:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Be defensive or argumentative</li>
                  <li>• Use copy-paste responses</li>
                  <li>• Ignore negative reviews</li>
                  <li>• Share customer private info</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RespondToReviews;
