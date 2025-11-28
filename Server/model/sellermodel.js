import mongoose from "mongoose";

const sellerschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickName: { type: String, required: true },

  otp: { type: String },
  otpExpire: { type: Date },
  verified: { type: Boolean, default: false },

  phone: Number,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  image: String,
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const sellermodel =
  mongoose.models.seller || mongoose.model("Seller", sellerschema);

export default sellermodel;
