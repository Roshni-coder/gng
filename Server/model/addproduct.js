import mongoose from "mongoose";

const addproductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  categoryname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },

  price: { type: Number, required: true },
  oldprice: { type: Number, required: true },
  discount: { type: Number, required: true },

  ingredients: String,
  brand: String,
  size: String,
  additional_details: String,

  approved: { type: Boolean, default: false },

  images: [
    {
      url: { type: String, required: true },
      altText: { type: String, default: "" },
    },
  ],

  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },

  // ⭐ Stock Fields
  stock: { type: Number, required: true, default: 0 },
  
  availability: {
    type: String,
    enum: ["In Stock", "Low Stock", "Out of Stock"],
    default: "In Stock",
  },

  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// ⭐ Auto-update availability and flags before saving
addproductSchema.pre("save", function (next) {
  this.stock = parseInt(this.stock); // Ensure number

  this.isAvailable = this.stock > 0;

  if (this.stock <= 0) {
    this.stock = 0; // Prevent negative stock
    this.availability = "Out of Stock";
  } 
  else if (this.stock > 0 && this.stock < 5) {
    this.availability = "Low Stock";
  } 
  else {
    this.availability = "In Stock";
  }

  next();
});

const addproductmodel = mongoose.model('Product',addproductSchema)
export default addproductmodel;
