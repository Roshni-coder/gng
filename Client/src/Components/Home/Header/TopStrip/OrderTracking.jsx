import React, { useState } from "react";
import axios from "axios";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/order/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setError("Order not found. Please check your Order ID.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getStatusStep = (status) => {
    const steps = ["Placed", "Pending", "Shipped", "Delivered"];
    return steps.indexOf(status);
  };
  return (
    
    <div className="max-w-4xl mx-auto p-6">
      {/* Heading */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Track Your Order</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>

      {/* Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7d0492]"
        />
        <button
          onClick={fetchOrder}
          className="mt-2 px-4 py-2 bg-[#7d0492] text-white rounded hover:bg-[#5c0170]"
        >
          Track Order
        </button>
      </div>

      {/* Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Order Details */}
      {order && (
        <div className="bg-gray-50 p-4 rounded mt-4 shadow">
          <h2 className="text-lg font-semibold mb-2 text-[#7d0492]">Order Summary</h2>
           {/* Order Status Tracker */}
          <div className="flex justify-between items-center my-6 px-2">
            {["Placed", "Pending", "Shipped", "Delivered"].map((step, idx) => {
              const activeStep = getStatusStep(order.status);
              const isActive = idx <= activeStep;
              return (
                <div key={step} className="flex-1 flex flex-col items-center relative">
  {/* Circle with Tick if Active */}
  <div
    className={`w-6 h-6 rounded-full z-10 flex items-center justify-center font-bold text-xs ${
      isActive ? "bg-green-600 text-white" : "bg-gray-300"
    }`}
  >
    {isActive && "✓"}
  </div>

  {/* Label */}
  <p className="mt-1 text-xs text-center">{step}</p>

  {/* Line */}
  {idx !== 4 && (
    <div
      className={`absolute top-3 left-1/2 w-full h-1 -translate-x-1/2 ${
        isActive ? "bg-green-600" : "bg-gray-300"
      }`}
      style={{ zIndex: 0, width: "100%", height: "2px" }}
    ></div>
  )}
</div>

              );
            })}
          </div>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>

          <div className="mt-4">
            <h3 className="font-semibold text-[#7d0492]">Shipping Info</h3>
            <p>{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pin}</p>
            <p>Phone: {order.shippingAddress?.phone}</p>
            {order.shippingAddress?.alternatephone && (
              <p>Alt Phone: {order.shippingAddress.alternatephone}</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-[#7d0492]">Ordered Items</h3>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm text-gray-700 border">
                <thead className="bg-gray-100 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2">Qty</th>
                    <th className="px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="text-center border-t">
                      <td className="py-2">
                        {item.productId?.images?.[0]?.url ? (
                          <img
                            src={item.productId.images[0].url}
                            alt="product"
                            className="w-12 h-12 object-cover mx-auto rounded-md"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2">
                        {item.productId?.title || item.name || "No Title"}
                      </td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;