const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Refund Policy</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>
  <div className="mb-6 text-sm sm:text-base text-gray-800 leading-relaxed space-y-4">
  <div>
    <h2 className="font-semibold text-lg mb-1">Refund Eligibility</h2>
    If you are not fully satisfied with your purchase from <strong>GiftNGifts</strong>, you may request a refund within <strong>7 days</strong> of receiving the product. To be eligible, the item must be unused, in its original condition and packaging, and include a valid proof of purchase.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Non-Refundable Items</h2>
    Please note that customized, personalized, and perishable items (such as cakes or flowers) are <strong>non-refundable</strong> unless they arrive damaged or defective.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Shipping Charges</h2>
    Shipping and handling charges are non-refundable unless the return is due to an error on our part (e.g., wrong or damaged item sent).
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Refund Process</h2>
    Once your return is received and inspected, we will notify you via email regarding the approval or rejection of your refund. If approved, the refund will be processed within 5–7 business days to your original method of payment.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">How to Request a Refund</h2>
    To initiate a refund, please email us at <a href="mailto:support@giftNgifts.com" className="underline">support@giftNgifts.com</a> with your order number, reason for return, and relevant photos if applicable.
  </div>
</div>


      </div>
  );
};

export default RefundPolicy;
