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
  storeTheme: {
    primaryColor: { type: String, default: "#3B82F6" },
    secondaryColor: { type: String, default: "#1E40AF" }
  },
  businessInfo: {
    businessName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    registrationNumber: String,
    yearEstablished: Number
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
    message: String,
    startDate: Date,
    endDate: Date
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
