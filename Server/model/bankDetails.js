import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
    unique: true
  },
  accountHolderName: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  ifscCode: {
    type: String,
    required: true
  },
  branchName: {
    type: String
  },
  upiId: {
    type: String
  },
  isPrimary: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const BankDetailsModel = mongoose.models.BankDetails || mongoose.model("BankDetails", bankDetailsSchema);
export default BankDetailsModel;
