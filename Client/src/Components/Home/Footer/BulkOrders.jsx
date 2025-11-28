const BulkOrders = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Bulk Orders</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>
  <div className="mb-6 text-sm sm:text-base text-gray-800 leading-relaxed space-y-4">
  <div>
    <h2 className="font-semibold text-lg mb-1">Bulk Orders & Corporate Gifting</h2>
    At <strong>GiftNGifts</strong>, we offer customized solutions for bulk orders and corporate gifting needs. Whether you're planning festive giveaways, employee appreciation, or client gifting, we provide curated packages to suit your requirements.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Minimum Order Quantity</h2>
    Bulk orders typically require a minimum quantity of <strong>25 units</strong>. Customization options may vary based on the product and volume.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Customization & Branding</h2>
    We offer personalized packaging, logo printing, custom messages, and product bundling options to align with your brand identity or gifting theme.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Lead Time & Delivery</h2>
    Depending on the size and customization of your order, delivery may take <strong>7–15 business days</strong>. Express processing is available for urgent requests.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Pricing & Discounts</h2>
    Special pricing is available on bulk orders. The final cost will depend on quantity, product type, and customization. Volume discounts apply for larger orders.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">How to Place a Bulk Order</h2>
    To place a bulk order or request a quote, please email us at <a href="mailto:bulkorders@giftNgifts.com" className="underline">bulkorders@giftNgifts.com</a> with your requirements. Our corporate sales team will get in touch within 24 hours.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Support & Assistance</h2>
    Our dedicated bulk order support team will assist you through the entire process—from selection and customization to payment and delivery.
  </div>
</div>

      </div>
  );
};

export default BulkOrders;
