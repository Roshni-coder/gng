import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdShare, MdEmail, MdBadge, MdQrCode, MdContentCopy, MdLink, MdCampaign, MdImage } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPinterest } from "react-icons/fa";

function PromotionalTools() {
  const [tools, setTools] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('social');
  const [copied, setCopied] = useState('');
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toolsRes, storeRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/promotional-tools`, {
          headers: { stoken }
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/store/info`, {
          headers: { stoken }
        })
      ]);
      if (toolsRes.data.success) setTools(toolsRes.data.data || []);
      if (storeRes.data.success) setStoreInfo(storeRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const getStoreUrl = () => {
    return storeInfo?.storeUrl || `https://giftsingifts.com/store/${storeInfo?.storeId || 'your-store'}`;
  };

  const socialMediaLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getStoreUrl())}`
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(getStoreUrl())}&text=Check out my store!`
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600',
      shareUrl: null
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`Check out my store: ${getStoreUrl()}`)}`
    },
    {
      name: 'Pinterest',
      icon: FaPinterest,
      color: 'bg-red-600',
      shareUrl: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(getStoreUrl())}`
    }
  ];

  const promotionalAssets = [
    { id: 'store-link', name: 'Store Link', icon: MdLink, value: getStoreUrl() },
    { id: 'referral-code', name: 'Referral Code', icon: MdBadge, value: storeInfo?.referralCode || 'STORE2024' },
    { id: 'qr-code', name: 'Store QR Code', icon: MdQrCode, value: 'Generate QR' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Promotional Tools</h1>
        <p className="text-gray-600">Share your store and boost visibility</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'social', label: 'Social Media', icon: MdShare },
          { id: 'assets', label: 'Share Assets', icon: MdLink },
          { id: 'banners', label: 'Banners', icon: MdImage },
          { id: 'email', label: 'Email Templates', icon: MdEmail }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="text-lg" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Share on Social Media</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {socialMediaLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.shareUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => !social.shareUrl && e.preventDefault()}
                  className={`${social.color} text-white rounded-xl p-6 flex flex-col items-center gap-3 hover:opacity-90 transition-opacity shadow-md hover:shadow-lg`}
                >
                  <social.icon className="text-3xl" />
                  <span className="font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Share Message</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700">
                🎁 Check out my gift store on GiftsNGifts! Find unique personalized gifts for every occasion.
                <br /><br />
                🛍️ Shop now: {getStoreUrl()}
              </p>
            </div>
            <button 
              onClick={() => copyToClipboard(`🎁 Check out my gift store on GiftsNGifts! Find unique personalized gifts for every occasion. 🛍️ Shop now: ${getStoreUrl()}`, 'message')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              <MdContentCopy />
              {copied === 'message' ? 'Copied!' : 'Copy Message'}
            </button>
          </div>
        </div>
      )}

      {/* Share Assets Tab */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotionalAssets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <asset.icon className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800">{asset.name}</h3>
              </div>
              {asset.id === 'qr-code' ? (
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <MdQrCode className="text-6xl text-gray-400" />
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    Generate QR Code
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 break-all">
                    <code className="text-sm text-gray-700">{asset.value}</code>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(asset.value, asset.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full justify-center"
                  >
                    <MdContentCopy />
                    {copied === asset.id ? 'Copied!' : 'Copy'}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Promotional Banners</h2>
          <p className="text-gray-500 mb-6">Download ready-to-use banners for your marketing campaigns</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Store Banner - Large', size: '1200x628', type: 'Facebook/LinkedIn' },
              { name: 'Store Banner - Square', size: '1080x1080', type: 'Instagram Post' },
              { name: 'Store Banner - Story', size: '1080x1920', type: 'Instagram/WhatsApp Story' },
              { name: 'Store Banner - Twitter', size: '1600x900', type: 'Twitter Post' },
              { name: 'Email Header', size: '600x200', type: 'Email Campaigns' },
              { name: 'WhatsApp Catalog', size: '500x500', type: 'WhatsApp Business' }
            ].map((banner, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg h-32 flex items-center justify-center mb-3">
                  <MdImage className="text-4xl text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-800">{banner.name}</h3>
                <p className="text-sm text-gray-500">{banner.size} • {banner.type}</p>
                <button className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Templates Tab */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Templates</h2>
            <p className="text-gray-500 mb-6">Pre-designed email templates for different campaigns</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'New Arrival Announcement', description: 'Announce new products to customers' },
                { name: 'Special Offer', description: 'Promote discounts and deals' },
                { name: 'Holiday Greetings', description: 'Seasonal greetings with special offers' },
                { name: 'Customer Appreciation', description: 'Thank customers for their loyalty' },
                { name: 'Product Spotlight', description: 'Highlight a specific product' },
                { name: 'Restock Alert', description: 'Notify customers about restocked items' }
              ].map((template, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MdEmail className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromotionalTools;
