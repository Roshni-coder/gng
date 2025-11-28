const ShippingInfo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Shipping Information</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>
  <div className="space-y-4">
  <h2 className="font-semibold text-lg mb-1">Shipping Information</h2>
  <p className="mb-2">
    At GiftNGifts, we strive to deliver your gifts with care and on time. Please review our shipping policies below:
  </p>

  <h2 className="font-semibold text-lg mb-1">Delivery Areas</h2>
  <p className="mb-2">
    We currently deliver across major cities in India. For remote or non-serviceable areas, delivery availability will be confirmed at checkout.
  </p>

  <h2 className="font-semibold text-lg mb-1">Estimated Delivery Time</h2>
  <ul className="list-disc list-inside mb-2 space-y-1">
    <li>Standard Delivery: 3–5 business days</li>
    <li>Express Delivery: 1–2 business days (charges apply)</li>
    <li>Same-Day Delivery: Available in select cities on eligible products (order before 12 PM)</li>
  </ul>

  <h2 className="font-semibold text-lg mb-1">Shipping Charges</h2>
  <ul className="list-disc list-inside mb-2 space-y-1">
    <li>Free shipping on orders above ₹999</li>
    <li>Orders below ₹999: Delivery charge of ₹49–₹99 based on location and speed</li>
  </ul>

  <h2 className="font-semibold text-lg mb-1">Gift Packaging</h2>
  <p className="mb-2">
    All items are securely packed. Gift wrapping is available at checkout for select products.
  </p>

  <h2 className="font-semibold text-lg mb-1">Order Tracking</h2>
  <p className="mb-2">
    Once your order is shipped, you’ll receive a tracking link via email or SMS to monitor its status in real time.
  </p>

  <h2 className="font-semibold text-lg mb-1">Failed Deliveries</h2>
  <p className="mb-2">
    If delivery fails due to incorrect address or recipient unavailability, we will attempt re-delivery once. Additional charges may apply after the first attempt.
  </p>

  <h2 className="font-semibold text-lg mb-1">Need Help?</h2>
  <p className="mb-2">
    Our customer care team is available 9 AM – 9 PM to assist you with any shipping-related queries.
  </p>
</div>

      </div>
  );
};

export default ShippingInfo;