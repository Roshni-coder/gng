import express from 'express';
const router = express.Router();
import { registerAdmin, loginAdmin, getAllOrders, getAllSellers, toggleApprove, getAllProducts, approveProduct, getProductsBySeller,  getAdminDashboardStats} from '../controller/admincontroller.js';

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/orders', getAllOrders);
router.get('/sellers', getAllSellers);
router.put('/toggle-approve/:sellerId', toggleApprove);
router.get('/products', getAllProducts);
router.put('/toggle-product/:productId', approveProduct);
router.get("/seller-products/:sellerId", getProductsBySeller);
router.get("/stats", getAdminDashboardStats);

export default router;
