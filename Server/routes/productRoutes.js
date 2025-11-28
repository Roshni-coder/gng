import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  filterProducts,
  deleteProduct,
  updateProduct,
  createReview,
  getProductReviews,
  getRelatedProducts,
} from "../controller/productController.js";
import authseller from "../middleware/authseller.js";

const router = express.Router();

router.post('/addproduct',authseller, addProduct);
router.get('/getproducts',authseller, getAllProducts);
router.get('/getproduct/:id', getProductById);
router.get('/filter', filterProducts);
router.delete('/deleteproduct/:id', deleteProduct);
router.put('/updateproduct/:id', updateProduct);
router.post("/review", createReview);
router.get("/reviews/:id", getProductReviews);
router.get("/related/:id", getRelatedProducts);
export default router;
