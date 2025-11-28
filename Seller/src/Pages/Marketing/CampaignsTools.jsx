import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuPlus, LuTrash2, LuPencil, LuPlay, LuPause, LuCopy, LuExternalLink, LuShare2, LuQrCode } from "react-icons/lu";
import { MdCampaign, MdOutlineBarChart, MdAdsClick, MdTrendingUp, MdOutlineVisibility } from "react-icons/md";
import { FiDollarSign, FiTarget, FiTool, FiShare, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

function CampaignsTools() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const stoken = localStorage.getItem("stoken");

  // Budget & Performance State
  const [budgetData, setBudgetData] = useState({
    budget: { total: 0, spent: 0, remaining: 0 },
    campaigns: { total: 0, active: 0, paused: 0, completed: 0 },
    performance: { impressions: 0, clicks: 0, conversions: 0, revenue: 0, ctr: 0, roas: 0 }
  });

  // Campaigns State
  const [campaigns, setCampaigns] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    type: "sponsored_product",
    budget: { total: 1000, daily: 100 },
    schedule: { startDate: new Date().toISOString().split('T')[0], endDate: "" },
    targeting: { audience: "all" }
  });

  // Tools State
  const [toolsData, setToolsData] = useState({
    storeUrl: "",
    socialTemplates: [],
    activeCoupons: [],
    stats: { totalProducts: 0, activePromotions: 0 }
  });
  const [copiedText, setCopiedText] = useState("");

  const tabs = [
    { id: "campaigns", label: "Ad Campaigns", icon: MdCampaign },
    { id: "tools", label: "Promotional Tools", icon: FiTool }
  ];

  useEffect(() => {
    fetchBudgetData();
    if (activeTab === "campaigns") {
      fetchCampaigns();
    } else {
      fetchTools();
    }
  }, [activeTab]);

  const fetchBudgetData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/budget`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setBudgetData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching budget:", err);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/campaigns`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setCampaigns(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/tools`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setToolsData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching tools:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignForm.name) {
      alert("Please enter a campaign name");
      return;
    }

    setSaving(true);
    try {
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/campaigns`;
      const method = editingCampaign ? 'put' : 'post';
      const payload = editingCampaign 
        ? { ...campaignForm, campaignId: editingCampaign._id }
        : campaignForm;

      await axios[method](endpoint, payload, { headers: { stoken } });

      setShowCampaignModal(false);
      setEditingCampaign(null);
      resetCampaignForm();
      fetchCampaigns();
      fetchBudgetData();
    } catch (err) {
      console.error("Error saving campaign:", err);
      alert(err.response?.data?.message || "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/campaigns/${campaignId}`,
        { headers: { stoken } }
      );
      fetchCampaigns();
      fetchBudgetData();
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  const handleToggleCampaign = async (campaignId, newStatus) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/marketing/campaigns/toggle`,
        { campaignId, status: newStatus },
        { headers: { stoken } }
      );
      fetchCampaigns();
      fetchBudgetData();
    } catch (err) {
      console.error("Error toggling campaign:", err);
    }
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      name: "",
      type: "sponsored_product",
      budget: { total: 1000, daily: 100 },
      schedule: { startDate: new Date().toISOString().split('T')[0], endDate: "" },
      targeting: { audience: "all" }
    });
  };

  const openEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      name: campaign.name,
      type: campaign.type,
      budget: campaign.budget || { total: 0, daily: 0 },
      schedule: {
        startDate: campaign.schedule?.startDate ? new Date(campaign.schedule.startDate).toISOString().split('T')[0] : "",
        endDate: campaign.schedule?.endDate ? new Date(campaign.schedule.endDate).toISOString().split('T')[0] : ""
      },
      targeting: campaign.targeting || { audience: "all" }
    });
    setShowCampaignModal(true);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCampaignTypeLabel = (type) => {
    const types = {
      sponsored_product: "Sponsored Product",
      store_ad: "Store Ad",
      banner_ad: "Banner Ad",
      social_media: "Social Media"
    };
    return types[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "text-gray-500 bg-gray-100",
      active: "text-green-600 bg-green-100",
      paused: "text-yellow-600 bg-yellow-100",
      completed: "text-blue-600 bg-blue-100",
      cancelled: "text-red-600 bg-red-100"
    };
    return colors[status] || colors.draft;
  };

  if (loading && campaigns.length === 0 && !toolsData.storeUrl) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns & Tools</h1>
          <p className="text-sm text-gray-500 mt-1">Manage marketing campaigns and promotional tools</p>
        </div>
        {activeTab === "campaigns" && (
          <button
            onClick={() => { resetCampaignForm(); setEditingCampaign(null); setShowCampaignModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <LuPlus className="w-4 h-4" /> Create Campaign
          </button>
        )}
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Budget</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(budgetData.budget.total)}</h3>
            </div>
            <FiDollarSign className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Spent</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(budgetData.budget.spent)}</h3>
            </div>
            <MdOutlineBarChart className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Impressions</p>
              <h3 className="text-2xl font-bold text-gray-900">{budgetData.performance.impressions.toLocaleString()}</h3>
            </div>
            <MdOutlineVisibility className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clicks</p>
              <h3 className="text-2xl font-bold text-gray-900">{budgetData.performance.clicks.toLocaleString()}</h3>
            </div>
            <MdAdsClick className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ============ CAMPAIGNS TAB ============ */}
          {activeTab === "campaigns" && (
            <div className="space-y-6">
              {/* Campaign Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium">{budgetData.campaigns.total}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full text-sm">
                  <span className="text-green-600">Active:</span>
                  <span className="font-medium text-green-700">{budgetData.campaigns.active}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-full text-sm">
                  <span className="text-yellow-600">Paused:</span>
                  <span className="font-medium text-yellow-700">{budgetData.campaigns.paused}</span>
                </div>
              </div>

              {/* Campaigns List */}
              {campaigns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <MdCampaign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-600 font-medium">No campaigns yet</h3>
                  <p className="text-gray-400 text-sm mt-1">Create your first campaign to start promoting</p>
                  <button
                    onClick={() => { resetCampaignForm(); setShowCampaignModal(true); }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <MdCampaign className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(campaign.status)}`}>
                                  {campaign.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{getCampaignTypeLabel(campaign.type)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(campaign.budget?.total || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Spent</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(campaign.budget?.spent || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Impressions</p>
                            <p className="font-semibold text-gray-900">{(campaign.performance?.impressions || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Clicks</p>
                            <p className="font-semibold text-gray-900">{campaign.performance?.clicks || 0}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {campaign.status === 'active' ? (
                            <button
                              onClick={() => handleToggleCampaign(campaign._id, 'paused')}
                              className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                              title="Pause"
                            >
                              <LuPause className="w-4 h-4" />
                            </button>
                          ) : campaign.status !== 'completed' ? (
                            <button
                              onClick={() => handleToggleCampaign(campaign._id, 'active')}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                              title="Start"
                            >
                              <LuPlay className="w-4 h-4" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => openEditCampaign(campaign)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <LuPencil className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <LuTrash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ TOOLS TAB ============ */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              {/* Store Link & QR */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <LuShare2 className="text-indigo-600" />
                      Share Your Store
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Share your store link with customers</p>
                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={toolsData.storeUrl || ""}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(toolsData.storeUrl, "storeUrl")}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          copiedText === "storeUrl" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {copiedText === "storeUrl" ? (
                          <>✓ Copied</>
                        ) : (
                          <><LuCopy className="w-4 h-4" /> Copy</>
                        )}
                      </button>
                      <a
                        href={toolsData.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <LuExternalLink className="w-5 h-5 text-gray-600" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <LuQrCode className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Templates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {toolsData.socialTemplates?.map((template, index) => {
                    const icons = {
                      whatsapp: { icon: FaWhatsapp, color: "text-green-600 bg-green-100" },
                      instagram: { icon: FaInstagram, color: "text-pink-600 bg-pink-100" },
                      facebook: { icon: FaFacebook, color: "text-blue-600 bg-blue-100" }
                    };
                    const platform = icons[template.platform] || { icon: FiShare, color: "text-gray-600 bg-gray-100" };
                    const Icon = platform.icon;

                    return (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-900 capitalize">{template.platform}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.template}</p>
                        <button
                          onClick={() => copyToClipboard(template.template, template.platform)}
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                            copiedText === template.platform
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {copiedText === template.platform ? "✓ Copied!" : "Copy Template"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Coupons to Share */}
              {toolsData.activeCoupons?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Coupons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {toolsData.activeCoupons.map((coupon, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-indigo-600">{coupon.code}</span>
                          <span className="text-sm font-medium text-green-600">{coupon.discount}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{coupon.shareText}</p>
                        <button
                          onClick={() => copyToClipboard(coupon.shareText, `coupon-${index}`)}
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                            copiedText === `coupon-${index}`
                              ? "bg-green-100 text-green-700"
                              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          }`}
                        >
                          {copiedText === `coupon-${index}` ? "✓ Copied!" : "Copy Share Text"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-900">{toolsData.stats?.totalProducts || 0}</h3>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-purple-600 text-sm">Active Promotions</p>
                  <h3 className="text-2xl font-bold text-purple-700">{toolsData.stats?.activePromotions || 0}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCampaign ? "Edit Campaign" : "Create Campaign"}
                </h2>
                <button
                  onClick={() => { setShowCampaignModal(false); setEditingCampaign(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  placeholder="e.g., Summer Sale Campaign"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                <select
                  value={campaignForm.type}
                  onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sponsored_product">Sponsored Product</option>
                  <option value="store_ad">Store Ad</option>
                  <option value="banner_ad">Banner Ad</option>
                  <option value="social_media">Social Media</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (₹)</label>
                  <input
                    type="number"
                    value={campaignForm.budget.total}
                    onChange={(e) => setCampaignForm({ 
                      ...campaignForm, 
                      budget: { ...campaignForm.budget, total: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Budget (₹)</label>
                  <input
                    type="number"
                    value={campaignForm.budget.daily}
                    onChange={(e) => setCampaignForm({ 
                      ...campaignForm, 
                      budget: { ...campaignForm.budget, daily: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={campaignForm.schedule.startDate}
                    onChange={(e) => setCampaignForm({ 
                      ...campaignForm, 
                      schedule: { ...campaignForm.schedule, startDate: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={campaignForm.schedule.endDate}
                    onChange={(e) => setCampaignForm({ 
                      ...campaignForm, 
                      schedule: { ...campaignForm.schedule, endDate: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={campaignForm.targeting.audience}
                  onChange={(e) => setCampaignForm({ 
                    ...campaignForm, 
                    targeting: { ...campaignForm.targeting, audience: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Customers</option>
                  <option value="new_customers">New Customers</option>
                  <option value="returning_customers">Returning Customers</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowCampaignModal(false); setEditingCampaign(null); }}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : (editingCampaign ? "Update Campaign" : "Create Campaign")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignsTools;
