import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  },
  title: {
    type: String
  },
  sellerResponse: {
    type: String,
    default: null
  },
  respondedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
