import orderModel from "../model/order.js";
import addproductmodel from "../model/addproduct.js";
import Review from "../model/review.js";
import Category from "../model/Category.js";

// Helper function to get date range based on period
const getDateRange = (period) => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }
  
  return { startDate, endDate };
};

// Helper function to get day names for chart
const getDayNames = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Get Revenue Analytics (for new Analytics Dashboard)
export const getRevenueAnalytics = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { period = "week" } = req.query;

    const { startDate, endDate } = getDateRange(period);

    // Get orders for the period
    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      placedAt: { $gte: startDate, $lte: endDate }
    }).populate("items.productId", "title categoryname");

    // Calculate revenue by day for chart
    const chartData = {};
    let totalRevenue = 0;
    let totalOrders = 0;

    // Initialize chart data based on period
    if (period === 'week') {
      const dayNames = getDayNames();
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = dayNames[date.getDay()];
        chartData[dayName] = { name: dayName, revenue: 0, orders: 0 };
      }
    } else {
      // For month/quarter/year, group by date
      const current = new Date(startDate);
      while (current <= endDate) {
        const key = current.toISOString().split('T')[0];
        chartData[key] = { name: key, revenue: 0, orders: 0 };
        current.setDate(current.getDate() + 1);
      }
    }

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        item.sellerId?.toString() === sellerId?.toString()
      );
      
      if (sellerItems.length > 0) {
        totalOrders++;
        
        sellerItems.forEach(item => {
          const revenue = item.price * item.quantity;
          totalRevenue += revenue;

          // Add to chart data
          if (period === 'week') {
            const dayName = getDayNames()[new Date(order.placedAt).getDay()];
            if (chartData[dayName]) {
              chartData[dayName].revenue += revenue;
              chartData[dayName].orders++;
            }
          } else {
            const dateKey = new Date(order.placedAt).toISOString().split('T')[0];
            if (chartData[dateKey]) {
              chartData[dateKey].revenue += revenue;
              chartData[dateKey].orders++;
            }
          }
        });
      }
    });

    // Get previous period for comparison
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    
    switch (period) {
      case 'week':
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        break;
      case 'month':
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        break;
      case 'quarter':
        prevStartDate.setMonth(prevStartDate.getMonth() - 3);
        break;
      case 'year':
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        break;
    }

    const prevOrders = await orderModel.find({
      "items.sellerId": sellerId,
      placedAt: { $gte: prevStartDate, $lte: prevEndDate }
    });

    let prevRevenue = 0;
    let prevOrderCount = 0;
    prevOrders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        item.sellerId?.toString() === sellerId?.toString()
      );
      if (sellerItems.length > 0) {
        prevOrderCount++;
        prevRevenue += sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      }
    });

    const growth = prevRevenue > 0 
      ? parseFloat(((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)) 
      : (totalRevenue > 0 ? 100 : 0);

    const ordersGrowth = prevOrderCount > 0
      ? parseFloat(((totalOrders - prevOrderCount) / prevOrderCount * 100).toFixed(1))
      : (totalOrders > 0 ? 100 : 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        growth,
        ordersGrowth,
        chartData: Object.values(chartData)
      }
    });
  } catch (error) {
    console.error("Revenue Analytics Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Product Analytics (for Products tab)
export const getProductAnalytics = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { period = "week" } = req.query;

    const { startDate, endDate } = getDateRange(period);

    // Get orders with seller's products
    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      placedAt: { $gte: startDate, $lte: endDate }
    });

    // Aggregate product sales
    const productSales = {};
    
    orders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        item.sellerId?.toString() === sellerId?.toString()
      );
      
      sellerItems.forEach(item => {
        const productName = item.name || "Unknown Product";
        if (!productSales[productName]) {
          productSales[productName] = { name: productName, value: 0, sales: 0, revenue: 0 };
        }
        productSales[productName].sales += item.quantity;
        productSales[productName].revenue += item.price * item.quantity;
        productSales[productName].value += item.quantity; // For pie chart
      });
    });

    // Sort by sales and get top products
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // If less than 5 products, add "Others" if there are more
    const otherProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(5);

    if (otherProducts.length > 0) {
      const othersTotal = otherProducts.reduce((acc, p) => ({
        sales: acc.sales + p.sales,
        revenue: acc.revenue + p.revenue,
        value: acc.value + p.value
      }), { sales: 0, revenue: 0, value: 0 });

      topProducts.push({
        name: 'Others',
        value: othersTotal.value,
        sales: othersTotal.sales,
        revenue: othersTotal.revenue
      });
    }

    res.status(200).json({
      success: true,
      data: {
        topProducts,
        totalProducts: Object.keys(productSales).length,
        totalSales: Object.values(productSales).reduce((acc, p) => acc + p.sales, 0)
      }
    });
  } catch (error) {
    console.error("Product Analytics Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Traffic Insights (for Traffic tab)
export const getTrafficInsights = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { period = "week" } = req.query;

    const { startDate, endDate } = getDateRange(period);

    // Get products and orders for traffic estimation
    const products = await addproductmodel.find({ sellerId });
    const orders = await orderModel.find({ 
      "items.sellerId": sellerId,
      placedAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate estimated traffic based on orders (since we don't have real analytics)
    const totalOrders = orders.length;
    const estimatedVisitors = totalOrders * 15; // Assume 15 visitors per order
    const conversionRate = estimatedVisitors > 0 
      ? parseFloat(((totalOrders / estimatedVisitors) * 100).toFixed(1))
      : 0;

    // Simulated traffic sources (in real app, this would come from analytics service)
    const sources = [
      { name: 'Direct', value: Math.round(estimatedVisitors * 0.35) },
      { name: 'Social Media', value: Math.round(estimatedVisitors * 0.25) },
      { name: 'Search Engine', value: Math.round(estimatedVisitors * 0.30) },
      { name: 'Referral', value: Math.round(estimatedVisitors * 0.10) }
    ];

    res.status(200).json({
      success: true,
      data: {
        totalVisitors: estimatedVisitors,
        conversionRate,
        sources,
        note: "Traffic data is estimated. Connect Google Analytics for accurate data."
      }
    });
  } catch (error) {
    console.error("Traffic Insights Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Conversion Reports
export const getConversionReports = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { period = "30" } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const products = await addproductmodel.find({ sellerId });
    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      placedAt: { $gte: startDate }
    });

    const productConversion = products.map(product => {
      const productOrders = orders.filter(o => 
        o.items.some(i => i.productId?.toString() === product._id.toString())
      );
      const orderCount = productOrders.length;
      const estimatedViews = orderCount * 12;
      const revenue = productOrders.reduce((acc, o) => {
        const item = o.items.find(i => i.productId?.toString() === product._id.toString());
        return acc + (item ? item.price * item.quantity : 0);
      }, 0);

      return {
        productId: product._id,
        name: product.title,
        image: product.images?.[0]?.url,
        views: estimatedViews,
        orders: orderCount,
        conversionRate: estimatedViews > 0 ? ((orderCount / estimatedViews) * 100).toFixed(2) : 0,
        revenue,
        avgOrderValue: orderCount > 0 ? (revenue / orderCount).toFixed(2) : 0
      };
    });

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => ["Delivered", "Completed"].includes(o.status)).length;
    const returnedOrders = orders.filter(o => o.status === "Returned").length;

    res.status(200).json({
      success: true,
      data: {
        overallConversionRate: "8.3%",
        cartAbandonmentRate: "65%",
        orderCompletionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0,
        returnRate: totalOrders > 0 ? ((returnedOrders / totalOrders) * 100).toFixed(1) : 0,
        productConversion: productConversion.sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate)),
        funnelData: {
          visits: products.length * 50,
          productViews: products.length * 30,
          addToCart: totalOrders * 2,
          checkout: totalOrders * 1.3,
          purchase: totalOrders
        }
      }
    });
  } catch (error) {
    console.error("Conversion Reports Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Export Data
export const exportData = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { type = "orders", format = "json", startDate, endDate } = req.query;

    let data = [];
    let query = {};

    if (startDate || endDate) {
      query.placedAt = {};
      if (startDate) query.placedAt.$gte = new Date(startDate);
      if (endDate) query.placedAt.$lte = new Date(endDate);
    }

    switch (type) {
      case "orders":
        const orders = await orderModel.find({ "items.sellerId": sellerId, ...query })
          .populate("user", "name email");
        data = orders.map(order => {
          const sellerItems = order.items.filter(i => i.sellerId.toString() === sellerId.toString());
          return {
            orderId: order._id,
            date: order.placedAt,
            customer: order.user?.name || order.shippingAddress?.name,
            email: order.user?.email,
            items: sellerItems.map(i => `${i.name} x${i.quantity}`).join(", "),
            total: sellerItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
            status: order.status,
            address: `${order.shippingAddress?.address}, ${order.shippingAddress?.city}`
          };
        });
        break;

      case "products":
        const products = await addproductmodel.find({ sellerId })
          .populate("categoryname", "name");
        data = products.map(p => ({
          productId: p._id,
          title: p.title,
          category: p.categoryname?.name,
          price: p.price,
          oldPrice: p.oldprice,
          discount: p.discount,
          stock: p.stock,
          availability: p.availability,
          approved: p.approved
        }));
        break;

      case "customers":
        const customerOrders = await orderModel.find({ "items.sellerId": sellerId })
          .populate("user", "name email");
        const customers = {};
        customerOrders.forEach(order => {
          const custId = order.user?._id?.toString() || order.shippingAddress?.phone;
          if (custId && !customers[custId]) {
            customers[custId] = {
              name: order.user?.name || order.shippingAddress?.name,
              email: order.user?.email,
              phone: order.shippingAddress?.phone,
              totalOrders: 0,
              totalSpent: 0
            };
          }
          if (custId) {
            const total = order.items
              .filter(i => i.sellerId.toString() === sellerId.toString())
              .reduce((acc, i) => acc + i.price * i.quantity, 0);
            customers[custId].totalOrders++;
            customers[custId].totalSpent += total;
          }
        });
        data = Object.values(customers);
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid export type" });
    }

    res.status(200).json({
      success: true,
      data: {
        type,
        count: data.length,
        exportedAt: new Date(),
        records: data
      }
    });
  } catch (error) {
    console.error("Export Data Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Inventory Reports
export const getInventoryReports = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;

    const products = await addproductmodel.find({ sellerId })
      .populate("categoryname", "name");

    const inventory = {
      totalProducts: products.length,
      inStock: products.filter(p => p.availability === "In Stock").length,
      lowStock: products.filter(p => p.availability === "Low Stock").length,
      outOfStock: products.filter(p => p.availability === "Out of Stock").length,
      totalStockValue: products.reduce((acc, p) => acc + (p.stock * p.price), 0),
      avgStockLevel: products.length > 0 ? (products.reduce((acc, p) => acc + p.stock, 0) / products.length).toFixed(0) : 0
    };

    const productDetails = products.map(p => ({
      _id: p._id,
      title: p.title,
      image: p.images?.[0]?.url,
      category: p.categoryname?.name || "Uncategorized",
      price: p.price,
      stock: p.stock,
      availability: p.availability,
      stockValue: p.stock * p.price,
      approved: p.approved
    })).sort((a, b) => a.stock - b.stock);

    const categoryBreakdown = {};
    products.forEach(p => {
      const catName = p.categoryname?.name || "Uncategorized";
      if (!categoryBreakdown[catName]) {
        categoryBreakdown[catName] = { count: 0, totalStock: 0, value: 0 };
      }
      categoryBreakdown[catName].count++;
      categoryBreakdown[catName].totalStock += p.stock;
      categoryBreakdown[catName].value += p.stock * p.price;
    });

    res.status(200).json({
      success: true,
      data: {
        summary: inventory,
        products: productDetails,
        categoryBreakdown: Object.entries(categoryBreakdown)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.value - a.value),
        alerts: {
          outOfStock: productDetails.filter(p => p.availability === "Out of Stock"),
          lowStock: productDetails.filter(p => p.availability === "Low Stock")
        }
      }
    });
  } catch (error) {
    console.error("Inventory Reports Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
