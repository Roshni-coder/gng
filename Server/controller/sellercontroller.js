import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import sellermodel from "../model/sellermodel.js";
import addproductmodel from "../model/addproduct.js";
import { v2 as cloudinary } from "cloudinary";
import orderModel from "../model/order.js";
import usermodel from "../model/mongobd_usermodel.js";
import { sendEmail } from "../config/mail.js";
//  ========================= REGISTER SELLER =========================

export const registerseller = async (req, res) => {
  try {
    const { name, email, password, nickName, phone } = req.body;

    if (!name || !email || !password || !nickName || !phone)
      return res.json({ success: false, message: "All fields required" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email format" });

    let existing = await sellermodel.findOne({ email });

    if (existing && !existing.verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existing.otp = otp;
      existing.otpExpire = Date.now() + 10 * 60 * 1000;
      await existing.save();

      await sendEmail(email, "Verify Seller Account", `<h1>Your OTP is ${otp}</h1>`);
      return res.json({ success: true, message: "OTP resent to email" });
    }

    if (existing) return res.json({ success: false, message: "Seller already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const seller = await sellermodel.create({
      name,
      email,
      password: hashed,
      nickName,
      phone,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      verified: false
    });

    await sendEmail(email, "Your OTP Verification Code", `<h1>Your OTP is ${otp}</h1>`);

    res.json({
      success: true,
      message: "Registered, OTP sent to email",
      email
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================= VERIFY OTP =========================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const seller = await sellermodel.findOne({ email });

    if (!seller)
      return res.json({ success: false, message: "Seller not found" });

    if (seller.otp !== otp || seller.otpExpire < Date.now())
      return res.json({ success: false, message: "Invalid or expired OTP" });

    seller.verified = true;
    seller.otp = null;
    seller.otpExpire = null;
    await seller.save();

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: "OTP verified",
      token
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ========================= LOGIN SELLER =========================

export const loginseller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await sellermodel.findOne({ email });

    if (!seller)
      return res.json({ success: false, message: "Invalid credentials" });

    if (!seller.verified)
      return res.json({ success: false, message: "Please verify your email first" });

    const match = await bcrypt.compare(password, seller.password);

    if (!match)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      message: "Login successful",
      user: {
        name: seller.name,
        email: seller.email,
        nickName: seller.nickName,
        id: seller._id
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all users
export const userlist = async (req, res) => {
  try {
    const users = await usermodel.find();
    if (!users) {
      return res.json({ success: false, message: "no users found" });
    }
    return res.json({ success: true, users });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Mark Order Complete
export const ordercomplete = async (req, res) => {
  try {
    // const {sellerId,orderid } = req.sellerId;
    const { sellerid, orderid } = req.body;
    const orderdata = await orderModel.findById(orderid);

    if (orderdata && orderdata.sellerid === sellerid) {
      await orderModel.findByIdAndUpdate(orderid, {
        completed: true,
      });
      return res.json({ success: true, message: "Order Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const addproducts = async (req, res) => {
  try {
    const sellerId = req.sellerId;  // ✔ from token

    const {
      title, description, price, categoryname, subcategory,
      oldprice, discount, ingredients, brand, additional_details, 
      size, stock
    } = req.body;

    if (!title || !description || !price || !categoryname || !subcategory || !stock) {
      return res.status(400).json({ success:false, message: 'Missing required fields' });
    }

    const images = await Promise.all(
      req.files.map(file =>
        cloudinary.uploader.upload(file.path, { resource_type:"image" })
      )
    );

    const imageUrls = images.map(img => ({
      url: img.secure_url,
      altText: title,
    }));

    const newProduct = new addproductmodel({
      title,
      description,
      price,
      categoryname,
      subcategory,
      oldprice,
      discount,
      ingredients,
      brand,
      additional_details,
      size,
      stock,
      sellerId,
      images: imageUrls
    });

    await newProduct.save();

    return res.status(201).json({ success:true, message:"Product added successfully" });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    return res.status(500).json({ success:false, message: err.message });
  }
};

export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.sellerId;   // ← FIXED

    const seller = await sellermodel.findById(sellerId);

    return res.status(200).json({ success: true, seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.sellerId; // from authseller middleware

    let seller = await sellermodel.findById(sellerId);
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    const { name, email, phone, street, city, state, pincode } = req.body;

    // Update fields
    seller.name = name || seller.name;
    seller.email = email || seller.email;
    seller.phone = phone || seller.phone;

    seller.address = {
      street: street || seller.address?.street,
      city: city || seller.address?.city,
      state: state || seller.address?.state,
      pincode: pincode || seller.address?.pincode,
    };

    // If profile image exists
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "seller_profiles"
      });
      seller.image = uploaded.secure_url;
    }

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      seller,
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getSellerOrders = async (req, res) => {
  // const { sellerId } = req.body;
const sellerId = req.sellerId;
  try {
    const orders = await orderModel.find({
      items: {
        $elemMatch: { sellerId }
      }
    })
      .populate("user", "name email")
      .populate("items.productId", "title price brand images")
      .sort({ placedAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this seller." });
    }

    // Optional: filter out only relevant items for that seller
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId);
      return {
        _id: order._id,
        user: order.user,
        items: sellerItems,
        totalAmount: sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        shippingAddress: order.shippingAddress,
        placedAt: order.placedAt,
        status: order.status,
        image: order.image,
        paymentId: order.paymentId
      };
    });

    res.status(200).json({ success: true, filteredOrders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getSeller = async (req, res) => {
const sellerId = req.sellerId;
  // const { sellerId } = req.body
  
  const seller = await sellermodel.find({ _id: sellerId })

  if (!seller.length) {
    return res.status(404).json({ message: "seller not found" })

  }

  return res.status(200).json({ success: true, seller });

}
export const getSellerDashboardStats = async (req, res) => {
  try {
    // const { sellerId } = req.body;
   const sellerId = req.sellerId; 
    // Get seller's products
    const products = await addproductmodel.find({ sellerId });

    // Get all orders where this seller's product exists
    const orders = await orderModel.find({ "items.sellerId": sellerId });

    let totalOrders = 0;
    let totalSales = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.sellerId?.toString() === sellerId.toString()) {
          totalOrders += 1;
          totalSales += item.price * item.quantity;
        }
      });
    });

    totalRevenue = totalSales; // You can subtract expenses or fees here

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalSales,
        totalRevenue,
        totalProducts: products.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};


// Update Order Status
export const updateSellerOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.sellerId || req.body.sellerId;

    const order = await orderModel.findOne({
      _id: orderId,
      "items.sellerId": sellerId
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found for this seller" });
    }

    order.items.forEach((item) => {
      if (item.sellerId.toString() === sellerId.toString()) {
        item.status = status;
      }
    });
    order.status = status;

    await order.save();
    return res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- NEW: Get Seller Earnings & Transactions ---
export const getSellerEarnings = async (req, res) => {
  try {
    
    const sellerId = req.sellerId;  // ✔ from token


    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      // Consider Delivered/Completed status for earnings
      status: { $in: ["Delivered", "Completed", "Pending", "Processing", "Shipped"] } 
    }).populate("user", "name email");

    let totalEarnings = 0;
    const transactions = [];

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (orderTotal > 0) {
        totalEarnings += orderTotal;
        transactions.push({
          orderId: order._id,
          date: order.placedAt,
          customer: order.user?.name || order.shippingAddress?.name || "Guest",
          amount: orderTotal,
          status: order.status
        });
      }
    });

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ 
      success: true, 
      data: {
        totalEarnings,
        pendingClearance: 0,
        transactions
      }
    });
  } catch (error) {
    console.error("Earnings Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- NEW: Get My Customers ---
export const getSellerCustomers = async (req, res) => {
  try {
    const sellerId = req.sellerId;  // ✔ from token


    const orders = await orderModel.find({ "items.sellerId": sellerId })
      .populate("user", "name email");

    const uniqueCustomers = {};

    orders.forEach(order => {
      // Use shipping address if user relation is missing
      const customerId = order.user?._id?.toString() || order.shippingAddress?.phone;
      const customerName = order.user?.name || order.shippingAddress?.name || "Guest";
      const customerEmail = order.user?.email || "N/A";
      const customerPhone = order.shippingAddress?.phone || "N/A";

      if (customerId) {
        const orderValue = order.items
          .filter(item => item.sellerId.toString() === sellerId.toString())
          .reduce((acc, item) => acc + (item.price * item.quantity), 0);

        if (!uniqueCustomers[customerId]) {
          uniqueCustomers[customerId] = {
            _id: customerId,
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.placedAt
          };
        }

        uniqueCustomers[customerId].totalOrders += 1;
        uniqueCustomers[customerId].totalSpent += orderValue;
        if (new Date(order.placedAt) > new Date(uniqueCustomers[customerId].lastOrderDate)) {
          uniqueCustomers[customerId].lastOrderDate = order.placedAt;
        }
      }
    });

    res.status(200).json({ success: true, customers: Object.values(uniqueCustomers) });
  } catch (error) {
    console.error("Customer Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};