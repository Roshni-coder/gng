import mongoose from "mongoose";

const marketingCampaignSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["sponsored_product", "store_ad", "banner_ad", "social_media"],
    required: true
  },
  status: {
    type: String,
    enum: ["draft", "active", "paused", "completed", "cancelled"],
    default: "draft"
  },
  budget: {
    total: { type: Number, default: 0 },
    daily: { type: Number, default: 0 },
    spent: { type: Number, default: 0 }
  },
  schedule: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  targeting: {
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }],
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }],
    audience: {
      type: String,
      enum: ["all", "new_customers", "returning_customers"],
      default: "all"
    }
  },
  performance: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }
}, { timestamps: true });

const MarketingCampaign = mongoose.models.MarketingCampaign || mongoose.model("MarketingCampaign", marketingCampaignSchema);
export default MarketingCampaign;
