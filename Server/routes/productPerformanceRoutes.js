import express from "express";
import addproductmodel from "../model/addproduct.js";
import orderModel from "../model/order.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await addproductmodel.find().lean();
    const orders = await orderModel.find().lean();

    const productStats = products.map(product => {
      let totalSales = 0;
      let revenue = 0;
      let orderCount = 0;

      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.productId.toString() === product._id.toString()) {
            totalSales += item.quantity;
            revenue += item.price * item.quantity;
            orderCount += 1;
          }
        });
      });

      const conversionRate =
        orders.length > 0
          ? ((orderCount / orders.length) * 100).toFixed(2)
          : 0;

      return {
        productId: product._id,
        title: product.title,
        totalSales,
        revenue,
        conversionRate,
        price: product.price,
        approved: product.approved,
        images: product.images,
      };
    });

    productStats.sort((a, b) => b.totalSales - a.totalSales);

    res.json({ success: true, data: productStats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
