import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
  },
  description: {
    type: String
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }]
}, { timestamps: true });

const CouponModel = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default CouponModel;
