import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: true
  },
  storeDescription: {
    type: String
  },
  storeLogo: {
    type: String
  },
  storeBanner: {
    type: String
  },
  storeEmail: {
    type: String
  },
  storePhone: {
    type: String
  },
  storeAddress: {
    type: String
  },
  storeTheme: {
    primaryColor: { type: String, default: "#3B82F6" },
    secondaryColor: { type: String, default: "#8B5CF6" },
    accentColor: { type: String, default: "#10B981" },
    fontFamily: { type: String, default: "Inter" },
    layout: { type: String, default: "grid" },
    headerStyle: { type: String, default: "modern" },
    showBanner: { type: Boolean, default: true },
    showFeaturedProducts: { type: Boolean, default: true },
    productsPerRow: { type: Number, default: 4 }
  },
  businessInfo: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    registrationNumber: String,
    yearEstablished: Number,
    businessAddress: String,
    businessCity: String,
    businessState: String,
    businessPincode: String,
    businessCountry: String
  },
  contactInfo: {
    email: String,
    phone: String,
    alternatePhone: String,
    website: String
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  policies: {
    returnPolicy: String,
    shippingPolicy: String,
    privacyPolicy: String
  },
  holidayMode: {
    isEnabled: { type: Boolean, default: false },
    message: { type: String, default: "We're currently on a break and will be back soon!" },
    startDate: Date,
    endDate: Date,
    autoReplyEnabled: { type: Boolean, default: true },
    autoReplyMessage: { type: String, default: "Thank you for your message. We're currently on holiday and will respond when we return." }
  },
  verificationStatus: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    documents: [{
      type: String,
      url: String,
      status: { type: String, enum: ["pending", "approved", "rejected"] }
    }]
  },
  commissionRate: {
    type: Number,
    default: 10 // percentage
  }
}, { timestamps: true });

const StoreSettingsModel = mongoose.models.StoreSettings || mongoose.model("StoreSettings", storeSettingsSchema);
export default StoreSettingsModel;
