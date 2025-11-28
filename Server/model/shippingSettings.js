import mongoose from "mongoose";

const shippingSettingsSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
    unique: true
  },
  defaultShippingRate: {
    type: Number,
    default: 0
  },
  freeShippingThreshold: {
    type: Number,
    default: 500
  },
  processingTime: {
    type: Number, // in days
    default: 2
  },
  deliveryPartners: [{
    name: String,
    isActive: Boolean,
    priority: Number
  }],
  shippingZones: [{
    zoneName: String,
    states: [String],
    rate: Number,
    deliveryDays: Number
  }],
  packageDimensions: {
    defaultWeight: Number,
    defaultLength: Number,
    defaultWidth: Number,
    defaultHeight: Number
  },
  pickupAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  returnAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    sameAsPickup: { type: Boolean, default: true }
  },
  pickupSchedule: [{
    day: String,
    timeSlot: String,
    isActive: Boolean
  }]
}, { timestamps: true });

const ShippingSettingsModel = mongoose.models.ShippingSettings || mongoose.model("ShippingSettings", shippingSettingsSchema);
export default ShippingSettingsModel;
