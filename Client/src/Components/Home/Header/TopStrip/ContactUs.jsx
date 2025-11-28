const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stylized heading with fading horizontal lines */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
        <h1 className="text-2xl text-[#7d0492] font-bold mx-4 whitespace-nowrap">Contact Us</h1>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#7d0492] to-transparent max-w-[120px]" />
      </div>

      <div className="space-y-6 text-gray-800 text-sm sm:text-base leading-relaxed">
        <div>
          <h2 className="font-semibold text-lg  mb-1">Get in Touch</h2>
          <p>
            Thank you for visiting GiftNGifts. If you have any questions, concerns, or feedback, our team is here to assist you. Please use any of the contact methods below to reach us.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg  mb-1">Office Address</h2>
          <p>
            GiftNGifts - Mega Support Store<br />
            Union Trade Center<br />
            India
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg  mb-1">Email Support</h2>
          <p>
            For general inquiries or support, feel free to email us at:<br />
            <a href="mailto:sales@giftNgifts.com" className=" hover:underline">
              sales@giftNgifts.com
            </a><br />
            We typically respond within 24 hours on business days.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg  mb-1">Phone Support</h2>
          <p>
            Call us at: <span className=" font-semibold">‪(+91) 9999-999-999‬</span><br />
            Hours: Monday to Saturday, 9:00 AM – 6:00 PM
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg  mb-1">Live Chat</h2>
          <p>
            Use our online chat feature available on the website to speak with a customer support representative in real-time.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg  mb-1">Customer Satisfaction</h2>
          <p>
            We value your trust and are committed to providing a seamless gifting experience. If you have any feedback or suggestions, we’d love to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
