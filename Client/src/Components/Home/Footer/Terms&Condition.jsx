const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Terms and Conditions</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>

      <div className="text-gray-800 leading-relaxed space-y-4">
  <p className="text-base">
    <span className="font-semibold">Dear Customers,</span> Welcome to <span className="font-semibold">GiftNGifts</span>!
  </p>

  <p>
    The following Terms and Conditions shall apply to your use of the website owned and operated by GiftNGifts, a platform that enables users to browse, select, and order gifting items such as cakes, accessories, and more for their loved ones, friends, or family members. The services are provided through our website <span className="font-medium">www.giftngifts.in</span> (hereinafter referred to as the “Website”), under the brand name ‘GiftNGifts’ (also referred to as “GNG” / “We” / “Us”).
  </p>

  <p>
    These Terms and Conditions govern the relationship between you (referred to as “You” / “User” / “Your”) and GNG. These Terms are in conjunction with our Terms of Use, Disclaimer, and Privacy Policy, which together constitute a legally binding agreement between you and GiftNGifts.
  </p>

  <p>
    This document is published in accordance with the provisions of Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 read with Rule 5 of the Consumer Protection (E-Commerce) Rules, 2020. These require publishing the rules and regulations, privacy policy, and Terms of Use for access or usage of this Website.
  </p>

  <p>
    By accessing or using our Website, you agree to be bound by these Terms and Conditions. Please read them carefully. If you do not agree with any part of these Terms and Conditions, please do not use the Website.
  </p>

  <h2 className="text-lg font-bold mt-6">General Terms</h2>
  <ul className="list-disc list-inside space-y-2">
    <li>Represent and warrant that you are legally competent to enter into this agreement.</li>
    <li>Accept the Terms outlined herein and agree to be bound by them when using our services.</li>
    <li>
      Understand that, if you are using this Website on behalf of another person or entity (e.g., as an employee, contractor, or agent), you are authorized to bind them to these Terms.
    </li>
  </ul>

  <h2 className="text-lg font-bold mt-6">Website Functionality and Services</h2>
  <ul className="list-disc list-inside space-y-2">
    <li>Browse and search for gifting items.</li>
    <li>Place orders for delivery to selected locations.</li>
    <li>Make secure payments via integrated gateways.</li>
    <li>Contact our support team for order-related queries.</li>
  </ul>
  <p>
    GNG may provide features, tools, or tips to help users choose suitable gifts. These are purely for guidance purposes and are not binding. Users are responsible for their own purchasing decisions.
  </p>
  <p>
    We reserve the right to modify, add, or discontinue any services or features at any time without prior notice.
  </p>

  <h2 className="text-lg font-bold mt-6">User Access and Restrictions</h2>
  <p>
    GNG retains the right to deny or suspend access to any user if we believe that the user has violated these Terms and Conditions or any applicable law.
  </p>
  <p>
    Misuse of the website, fraudulent activity, or any unauthorized attempt to access restricted areas may result in legal action and/or permanent suspension of your account.
  </p>

  <h2 className="text-lg font-bold mt-6">Order Fulfilment and Responsibility</h2>
  <ul className="list-disc list-inside space-y-2">
    <li>Processing and fulfilling your orders.</li>
    <li>Generating invoices and delivering the selected items.</li>
    <li>Ensuring quality and customer satisfaction (to a reasonable extent).</li>
  </ul>
  <p>
    However, under no circumstances shall our directors, affiliates, consultants, partners, or employees be held liable for any damages or losses arising from use of the Website or any transaction made through it.
  </p>
  <p>
    We may use third-party delivery partners, and delays caused by unforeseen circumstances (e.g., weather, traffic, public holidays) are beyond our control.
  </p>
</div>


      {/* Add more content here */}
    </div>
  );
};

export default TermsAndConditions;
