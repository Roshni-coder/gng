const FAQs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">FAQs</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>
  <div className="mb-6 text-sm sm:text-base text-gray-800 leading-relaxed space-y-4">
  <div>
    <h2 className="font-semibold text-lg mb-1">What payment methods do you accept?</h2>
    We accept all major credit and debit cards, UPI, net banking, wallets like Paytm and PhonePe, and secure gateways like Razorpay and PayPal.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">How can I track my order?</h2>
    After your order is shipped, a tracking link will be sent to your registered email or mobile number. You can also track your order from the "My Orders" section on our website.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Can I cancel or modify my order?</h2>
    Orders can be cancelled or modified before they are shipped. Once dispatched, cancellations are no longer possible. For urgent changes, please contact our support team immediately.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Do you offer same-day delivery?</h2>
    Yes, same-day delivery is available in select cities on eligible products. Orders must be placed before 12 PM to qualify.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">What is your return policy?</h2>
    We accept returns within 7 days of delivery for unused and undamaged products. Please refer to our Refund Policy page for detailed guidelines.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Do you offer gift wrapping?</h2>
    Yes, gift wrapping is available for most products. You can select this option during checkout if it's available for your chosen item.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Is my personal information secure?</h2>
    Absolutely. We use industry-standard security measures to protect your data. Your personal and payment details are encrypted and handled with strict confidentiality.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">How can I contact customer support?</h2>
    You can reach us via email at <a href="mailto:support@giftNgifts.com" className="underline">support@giftNgifts.com</a>, call us at <span className="font-medium">‪(+91) 9999-999-999‬</span>, or use live chat on our website during support hours (9 AM – 9 PM).
  </div>
</div>

      </div>
  );
};

export default FAQs;
