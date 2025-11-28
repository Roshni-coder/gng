const Disclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Disclaimer</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>
 <div className="mb-6 text-sm sm:text-base text-gray-800 leading-relaxed space-y-4">
  <div>
    <h2 className="font-semibold text-lg mb-1">General Disclaimer</h2>
    The information provided on the <strong>GiftNGifts</strong> website is for general informational purposes only. While we strive to keep the content accurate and up to date, we make no warranties or representations regarding the completeness, reliability, or accuracy of any information on the site.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">No Professional Advice</h2>
    Any product or service descriptions, recommendations, or related content provided on this site are not intended as professional advice. You are solely responsible for any decisions or actions taken based on the information available.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Limitation of Liability</h2>
    <strong>GiftNGifts</strong> shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website, products, or reliance on any content presented.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Third-Party Links</h2>
    Our website may contain links to third-party websites for your convenience. We do not control or endorse the content of those sites and are not responsible for their accuracy, legality, or content.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Changes to This Disclaimer</h2>
    We reserve the right to modify this disclaimer at any time without prior notice. It is your responsibility to review this page periodically for updates.
  </div>

  <div>
    <h2 className="font-semibold text-lg mb-1">Contact</h2>
    If you have any questions or concerns regarding this disclaimer, please contact us at: <a href="mailto:support@giftNgifts.com" className="underline">support@giftNgifts.com</a>
  </div>
</div>

      </div>
  );
};

export default Disclaimer;
