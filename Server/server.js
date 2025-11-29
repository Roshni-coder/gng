
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from './config/mongobd.js';
import connectcloudinary from "./config/cloudinary.js";
import authRoutes from './routes/auth_routes.js';
import userRoutes from "./routes/user_routes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/upload_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import subcategoryRoutes from "./routes/subcategory_routes.js";
import sellerRoutes from "./routes/sellerroutes.js";
import clientRoutes from "./routes/clientroute.js";
import productDetailsRoutes from "./routes/productdetails_api.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoute.js";
import productPerformanceRoutes from "./routes/productPerformanceRoutes.js";  // ✔ FIXED
import sellerPanelRoutes from "./routes/sellerPanelRoutes.js";  // New Seller Panel Routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const port = process.env.PORT || 7000;

connectDB();
connectcloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://giftngifts.in'];
    //  const allowed = ['*', 'http://srv814093.hstgr.cloud'];
    const hostname = new URL(origin).hostname;
    if (allowed.includes(origin) || hostname.endsWith('.ishisofttech.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// // Add CORS headers for static uploads to allow cross-origin image loading
// app.use('/uploads', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// }, express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes); // ✅ New Product Routes
app.use('/api/client', clientRoutes); // ✅ New Client Routes
app.use('/api', uploadRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/products', productDetailsRoutes);
app.use('/api', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/reports/product-performance', productPerformanceRoutes);
app.use('/api/seller-panel', sellerPanelRoutes);  // All new seller panel routes


app.listen(port, () => console.log(`Server started on port ${port}...`));
