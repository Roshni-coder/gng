import mongoose from "mongoose";

const personalizationSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  type: {
    type: String,
    enum: ["gift_wrapping", "greeting_card", "custom_message", "add_on_service"],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
}, { timestamps: true });

const PersonalizationModel = mongoose.models.Personalization || mongoose.model("Personalization", personalizationSchema);
export default PersonalizationModel;
