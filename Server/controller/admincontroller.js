import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import Admin from '../model/adminModel.js'
import orderModel from '../model/order.js';
import sellermodel from '../model/sellermodel.js';
import addproductmodel from '../model/addproduct.js';
import usermodel from "../model/mongobd_usermodel.js";

export const userlist = async (req, res) => {
  try {
    const users = await usermodel.find();
    if (!users || users.length === 0) {
      return res.json({ success: false, message: "no users found" });
    }
    return res.json({ success: true, users });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Registered successfully",
      token,
      name: newAdmin.name,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: admin.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("user", "name email")
      .populate("items.productId", "title price brand")
      .populate("items.sellerId", "name email nickName")
      .sort({ placedAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await sellermodel.find(
      {},
      "name nickName email phone approved image"
    );

    if (!sellers.length) {
      return res.status(404).json({ message: "No sellers found" });
    }

    return res.status(200).json({ success: true, sellers });
  } catch (error) {
    console.error("FETCH SELLERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleApprove = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await sellermodel.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const updatedSeller = await sellermodel.findByIdAndUpdate(
      sellerId,
      { approved: !seller.approved },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Seller ${
        updatedSeller.approved ? "approved" : "disapproved"
      } successfully.`,
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Error toggling seller approval:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// controller function
export const getAllProducts = async (req, res) => {
  try {
    const products = await addproductmodel
      .find({})
      .populate("sellerId", "name"); // 👈 populate only the 'name' field of the seller

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await addproductmodel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await addproductmodel.findByIdAndUpdate(
      productId,
      { approved: !product.approved },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Product ${
        updatedProduct.approved ? "approved" : "disapproved"
      } successfully.`,
      product: updatedProduct,
    });
    
  } catch (error) {
    console.error("Error toggling product approval:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await addproductmodel.find({ sellerId });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching seller products:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/admin/stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalProducts = await addproductmodel.countDocuments();
    const totalSellers = await sellermodel.countDocuments();
    const totalUsers = await usermodel.countDocuments();

    const orders = await orderModel.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalSellers,
        totalUsers,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

