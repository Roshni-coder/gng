import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Failed", "Cancelled"],
    default: "Pending"
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "UPI", "PayPal"],
    default: "Bank Transfer"
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String
  }
}, { timestamps: true });

const PayoutModel = mongoose.models.Payout || mongoose.model("Payout", payoutSchema);
export default PayoutModel;
