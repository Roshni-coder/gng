import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LuTruck, LuPackage, LuMapPin, LuClock, LuCalendar, LuSave, LuX,
  LuPenLine, LuPlus, LuTrash2, LuCheck, LuInfo, LuBuilding, LuPhone,
  LuMail, LuBox, LuSettings
} from "react-icons/lu";

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const stoken = localStorage.getItem("stoken");

  // General Tab State (Partners & Rates)
  const [generalSettings, setGeneralSettings] = useState({
    freeShippingThreshold: 500,
    defaultShippingRate: 50,
    expressShippingRate: 100,
    processingTime: "1-2",
    deliveryPartners: [],
    shippingZones: []
  });

  // Logistics Tab State (Package Sizes & Addresses)
  const [logisticsSettings, setLogisticsSettings] = useState({
    packageDimensions: [],
    pickupAddress: {
      name: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: ""
    },
    returnAddress: {
      name: "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      sameAsPickup: true
    }
  });

  // Schedule Tab State
  const [scheduleSettings, setScheduleSettings] = useState({
    defaultPickupTime: "10:00",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    pickupSchedule: []
  });

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    maxWeight: 0,
    isDefault: false
  });

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const defaultPartners = [
    { name: "Delhivery", isActive: false, deliveryTime: "2-5 days", baseRate: 40, logo: "🚚" },
    { name: "BlueDart", isActive: false, deliveryTime: "1-3 days", baseRate: 60, logo: "📦" },
    { name: "DTDC", isActive: false, deliveryTime: "3-6 days", baseRate: 35, logo: "📬" },
    { name: "Shiprocket", isActive: false, deliveryTime: "2-5 days", baseRate: 45, logo: "🚀" },
    { name: "Ecom Express", isActive: false, deliveryTime: "3-5 days", baseRate: 40, logo: "🛵" }
  ];

  const defaultZones = [
    { zoneName: "Local", states: ["Same State"], rate: 30, deliveryDays: 2 },
    { zoneName: "North India", states: ["Delhi", "Punjab", "Haryana", "UP"], rate: 50, deliveryDays: 4 },
    { zoneName: "South India", states: ["Karnataka", "Tamil Nadu", "Kerala"], rate: 60, deliveryDays: 5 },
    { zoneName: "East India", states: ["West Bengal", "Bihar", "Odisha"], rate: 70, deliveryDays: 5 },
    { zoneName: "West India", states: ["Maharashtra", "Gujarat", "Goa"], rate: 50, deliveryDays: 4 },
    { zoneName: "Northeast", states: ["Assam", "Meghalaya", "Manipur"], rate: 100, deliveryDays: 7 }
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/all-settings`,
        { headers: { stoken } }
      );
      if (res.data.success) {
        const data = res.data.data;
        setGeneralSettings({
          freeShippingThreshold: data.freeShippingThreshold || 500,
          defaultShippingRate: data.defaultShippingRate || 50,
          expressShippingRate: data.expressShippingRate || 100,
          processingTime: data.processingTime || "1-2",
          deliveryPartners: data.deliveryPartners?.length > 0 ? data.deliveryPartners : defaultPartners,
          shippingZones: data.shippingZones?.length > 0 ? data.shippingZones : defaultZones
        });
        setLogisticsSettings({
          packageDimensions: data.packageDimensions || [],
          pickupAddress: data.pickupAddress || logisticsSettings.pickupAddress,
          returnAddress: data.returnAddress || logisticsSettings.returnAddress
        });
        setScheduleSettings({
          defaultPickupTime: data.defaultPickupTime || "10:00",
          workingDays: data.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          pickupSchedule: data.pickupSchedule || []
        });
      }
    } catch (err) {
      console.error(err);
      // Set defaults if fetch fails
      setGeneralSettings(prev => ({
        ...prev,
        deliveryPartners: defaultPartners,
        shippingZones: defaultZones
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...generalSettings,
        ...logisticsSettings,
        ...scheduleSettings
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/all-settings`,
        payload,
        { headers: { stoken } }
      );
      setEditing(false);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const togglePartner = (index) => {
    setGeneralSettings(prev => ({
      ...prev,
      deliveryPartners: prev.deliveryPartners.map((p, i) =>
        i === index ? { ...p, isActive: !p.isActive } : p
      )
    }));
  };

  const updateZoneRate = (index, field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      shippingZones: prev.shippingZones.map((z, i) =>
        i === index ? { ...z, [field]: value } : z
      )
    }));
  };

  const toggleWorkingDay = (day) => {
    setScheduleSettings(prev => {
      const days = prev.workingDays || [];
      if (days.includes(day)) {
        return { ...prev, workingDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, workingDays: [...days, day] };
      }
    });
  };

  const handleAddPackage = () => {
    if (!packageForm.name) return;
    
    const newPackage = { ...packageForm, _id: Date.now().toString() };
    
    if (editingPackage) {
      setLogisticsSettings(prev => ({
        ...prev,
        packageDimensions: prev.packageDimensions.map(p =>
          p._id === editingPackage._id ? { ...newPackage, _id: editingPackage._id } : p
        )
      }));
    } else {
      setLogisticsSettings(prev => ({
        ...prev,
        packageDimensions: [...prev.packageDimensions, newPackage]
      }));
    }
    
    setShowPackageModal(false);
    setEditingPackage(null);
    setPackageForm({ name: "", length: 0, width: 0, height: 0, maxWeight: 0, isDefault: false });
  };

  const handleDeletePackage = (id) => {
    setLogisticsSettings(prev => ({
      ...prev,
      packageDimensions: prev.packageDimensions.filter(p => p._id !== id)
    }));
  };

  const calculateVolumetricWeight = (l, w, h) => {
    return ((l * w * h) / 5000).toFixed(2);
  };

  const tabs = [
    { id: "general", label: "General", icon: LuTruck, description: "Partners & Rates" },
    { id: "logistics", label: "Logistics", icon: LuBox, description: "Packages & Addresses" },
    { id: "schedule", label: "Schedule", icon: LuCalendar, description: "Pickup Timings" }
  ];

  if (loading) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Shipping Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure shipping, delivery partners, and pickup schedules</p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <LuX className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
              >
                <LuSave className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
            >
              <LuPenLine className="w-4 h-4" /> Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vertical Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-all border-b border-gray-100 last:border-0 ${
                  activeTab === tab.id
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeTab === tab.id ? "bg-indigo-100" : "bg-gray-100"
                }`}>
                  <tab.icon className={`w-5 h-5 ${
                    activeTab === tab.id ? "text-indigo-600" : "text-gray-500"
                  }`} />
                </div>
                <div>
                  <p className={`font-medium ${
                    activeTab === tab.id ? "text-indigo-600" : "text-gray-900"
                  }`}>{tab.label}</p>
                  <p className="text-xs text-gray-500">{tab.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {/* GENERAL TAB - Partners & Rates */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Shipping Rates Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <LuTruck className="w-5 h-5 opacity-80" />
                    <span className="text-xs font-medium opacity-80 uppercase">Free Shipping</span>
                  </div>
                  {editing ? (
                    <input
                      type="number"
                      value={generalSettings.freeShippingThreshold}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                      className="w-full bg-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-lg font-bold"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{formatINR(generalSettings.freeShippingThreshold)}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">Minimum order value</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <LuPackage className="w-5 h-5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Standard Rate</span>
                  </div>
                  {editing ? (
                    <input
                      type="number"
                      value={generalSettings.defaultShippingRate}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, defaultShippingRate: Number(e.target.value) }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-lg font-bold"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{formatINR(generalSettings.defaultShippingRate)}</p>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <LuClock className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Processing</span>
                  </div>
                  {editing ? (
                    <select
                      value={generalSettings.processingTime}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, processingTime: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-lg font-bold"
                    >
                      <option value="same-day">Same Day</option>
                      <option value="1">1 Day</option>
                      <option value="1-2">1-2 Days</option>
                      <option value="2-3">2-3 Days</option>
                      <option value="3-5">3-5 Days</option>
                    </select>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{generalSettings.processingTime} days</p>
                  )}
                </div>
              </div>

              {/* Delivery Partners */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <LuTruck className="w-5 h-5 text-indigo-600" />
                    Delivery Partners
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Enable or disable courier integrations</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {generalSettings.deliveryPartners.map((partner, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                          {partner.logo}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{partner.name}</h4>
                          <p className="text-sm text-gray-500">{partner.deliveryTime} • From ₹{partner.baseRate}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => editing && togglePartner(index)}
                        disabled={!editing}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          partner.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        } ${editing ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-70"}`}
                      >
                        {partner.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Zones */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <LuMapPin className="w-5 h-5 text-red-500" />
                    Shipping Zones & Rates
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Zone</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">States</th>
                        <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rate (₹)</th>
                        <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {generalSettings.shippingZones.map((zone, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium text-gray-900">{zone.zoneName}</td>
                          <td className="px-5 py-4 text-sm text-gray-500">{zone.states?.join(", ")}</td>
                          <td className="px-5 py-4 text-center">
                            {editing ? (
                              <input
                                type="number"
                                value={zone.rate}
                                onChange={(e) => updateZoneRate(index, "rate", Number(e.target.value))}
                                className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1"
                              />
                            ) : (
                              <span className="font-medium text-gray-900">{formatINR(zone.rate)}</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {editing ? (
                              <input
                                type="number"
                                value={zone.deliveryDays}
                                onChange={(e) => updateZoneRate(index, "deliveryDays", Number(e.target.value))}
                                className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1"
                              />
                            ) : (
                              <span className="text-gray-600">{zone.deliveryDays} days</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LOGISTICS TAB - Package Sizes & Addresses */}
          {activeTab === "logistics" && (
            <div className="space-y-6">
              {/* Package Dimensions */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <LuBox className="w-5 h-5 text-purple-600" />
                      Package Sizes
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Define standard box dimensions for shipping</p>
                  </div>
                  {editing && (
                    <button
                      onClick={() => setShowPackageModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <LuPlus className="w-4 h-4" /> Add Package
                    </button>
                  )}
                </div>

                {logisticsSettings.packageDimensions.length === 0 ? (
                  <div className="p-12 text-center">
                    <LuBox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-600">No packages configured</p>
                    <p className="text-sm text-gray-500 mt-1">Add your standard package sizes</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    {logisticsSettings.packageDimensions.map((pkg, i) => (
                      <div key={i} className={`border rounded-xl p-4 ${pkg.isDefault ? "border-indigo-300 bg-indigo-50" : "border-gray-200"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                            {pkg.isDefault && (
                              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          {editing && (
                            <button
                              onClick={() => handleDeletePackage(pkg._id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <LuTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-white rounded-lg p-3">
                          <span>{pkg.length}</span>×<span>{pkg.width}</span>×<span>{pkg.height}</span>
                          <span className="text-gray-400">cm</span>
                        </div>
                        <div className="flex justify-between mt-3 text-sm">
                          <span className="text-gray-500">Max: {pkg.maxWeight} kg</span>
                          <span className="text-gray-500">Vol: {calculateVolumetricWeight(pkg.length, pkg.width, pkg.height)} kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pickup Address */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                  <LuMapPin className="w-5 h-5 text-green-600" />
                  Pickup Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={logisticsSettings.pickupAddress.name}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, name: e.target.value }
                      }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      placeholder="Warehouse Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Phone</label>
                    <input
                      type="tel"
                      value={logisticsSettings.pickupAddress.phone}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, phone: e.target.value }
                      }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Address</label>
                    <input
                      type="text"
                      value={logisticsSettings.pickupAddress.addressLine1}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, addressLine1: e.target.value }
                      }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      placeholder="Building, Floor, Street"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">City</label>
                    <input
                      type="text"
                      value={logisticsSettings.pickupAddress.city}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, city: e.target.value }
                      }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">State</label>
                    <select
                      value={logisticsSettings.pickupAddress.state}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, state: e.target.value }
                      }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    >
                      <option value="">Select State</option>
                      {states.map((state, i) => (
                        <option key={i} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={logisticsSettings.pickupAddress.pincode}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, pincode: e.target.value }
                      }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Return Address */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <LuBuilding className="w-5 h-5 text-amber-600" />
                    Return Address
                  </h3>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={logisticsSettings.returnAddress.sameAsPickup}
                      onChange={(e) => setLogisticsSettings(prev => ({
                        ...prev,
                        returnAddress: { ...prev.returnAddress, sameAsPickup: e.target.checked }
                      }))}
                      disabled={!editing}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span className="text-gray-600">Same as pickup</span>
                  </label>
                </div>

                {!logisticsSettings.returnAddress.sameAsPickup && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Contact Name</label>
                      <input
                        type="text"
                        value={logisticsSettings.returnAddress.name}
                        onChange={(e) => setLogisticsSettings(prev => ({
                          ...prev,
                          returnAddress: { ...prev.returnAddress, name: e.target.value }
                        }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Phone</label>
                      <input
                        type="tel"
                        value={logisticsSettings.returnAddress.phone}
                        onChange={(e) => setLogisticsSettings(prev => ({
                          ...prev,
                          returnAddress: { ...prev.returnAddress, phone: e.target.value }
                        }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Address</label>
                      <input
                        type="text"
                        value={logisticsSettings.returnAddress.addressLine1}
                        onChange={(e) => setLogisticsSettings(prev => ({
                          ...prev,
                          returnAddress: { ...prev.returnAddress, addressLine1: e.target.value }
                        }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">City</label>
                      <input
                        type="text"
                        value={logisticsSettings.returnAddress.city}
                        onChange={(e) => setLogisticsSettings(prev => ({
                          ...prev,
                          returnAddress: { ...prev.returnAddress, city: e.target.value }
                        }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">State</label>
                      <select
                        value={logisticsSettings.returnAddress.state}
                        onChange={(e) => setLogisticsSettings(prev => ({
                          ...prev,
                          returnAddress: { ...prev.returnAddress, state: e.target.value }
                        }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      >
                        <option value="">Select State</option>
                        {states.map((state, i) => (
                          <option key={i} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">PIN Code</label>
                      <input
                        type="text"
                        value={logisticsSettings.returnAddress.pincode}
                        onChange={(e) => setLogisticsSettings(prev => ({
                          ...prev,
                          returnAddress: { ...prev.returnAddress, pincode: e.target.value }
                        }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                {logisticsSettings.returnAddress.sameAsPickup && (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
                    Returns will be sent to your pickup address
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCHEDULE TAB - Pickup Timings */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              {/* Default Pickup Time */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                  <LuClock className="w-5 h-5 text-blue-600" />
                  Default Pickup Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Preferred Pickup Time</label>
                    <input
                      type="time"
                      value={scheduleSettings.defaultPickupTime}
                      onChange={(e) => setScheduleSettings(prev => ({ ...prev, defaultPickupTime: e.target.value }))}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Working Days</label>
                    <div className="flex flex-wrap gap-2">
                      {allDays.map((day, i) => (
                        <button
                          key={i}
                          onClick={() => editing && toggleWorkingDay(day)}
                          disabled={!editing}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            scheduleSettings.workingDays?.includes(day)
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          } ${!editing && "cursor-not-allowed opacity-70"}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Schedule Preview */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <LuCalendar className="w-5 h-5 text-green-600" />
                    Weekly Schedule
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {allDays.map((day, i) => {
                    const isWorking = scheduleSettings.workingDays?.includes(day);
                    return (
                      <div key={i} className={`flex items-center justify-between p-4 ${!isWorking && "bg-gray-50"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isWorking ? "bg-green-100" : "bg-gray-100"
                          }`}>
                            <span className="text-sm font-medium">{day.slice(0, 2)}</span>
                          </div>
                          <span className={`font-medium ${isWorking ? "text-gray-900" : "text-gray-400"}`}>{day}</span>
                        </div>
                        <div className="text-right">
                          {isWorking ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {scheduleSettings.defaultPickupTime || "10:00"} onwards
                              </p>
                              <p className="text-xs text-green-600">Available for pickup</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Closed</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <LuInfo className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-indigo-900 text-sm mb-2">Pickup Tips</h4>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• Schedule pickups at least 2 hours before the slot</li>
                      <li>• Have all packages labeled before courier arrives</li>
                      <li>• Same-day pickup available before 2 PM in most cities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPackage ? "Edit Package" : "Add Package"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                <input
                  type="text"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="e.g., Small Box"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                  <input
                    type="number"
                    value={packageForm.length}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, length: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                  <input
                    type="number"
                    value={packageForm.width}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, width: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={packageForm.height}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                <input
                  type="number"
                  value={packageForm.maxWeight}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, maxWeight: Number(e.target.value) }))}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                />
              </div>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={packageForm.isDefault}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-5 h-5 rounded text-indigo-600"
                />
                <span className="text-gray-700">Set as default package</span>
              </label>

              {packageForm.length > 0 && packageForm.width > 0 && packageForm.height > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p><strong>Volumetric Weight:</strong> {calculateVolumetricWeight(packageForm.length, packageForm.width, packageForm.height)} kg</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPackageModal(false);
                    setEditingPackage(null);
                    setPackageForm({ name: "", length: 0, width: 0, height: 0, maxWeight: 0, isDefault: false });
                  }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPackage}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  {editingPackage ? "Update" : "Add"} Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
