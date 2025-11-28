import orderModel from "../model/order.js";
import PayoutModel from "../model/payout.js";
import BankDetailsModel from "../model/bankDetails.js";
import addproductmodel from "../model/addproduct.js";

// ============ OVERVIEW / EARNINGS ============
export const getEarningsOverview = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { period = "all" } = req.query;

    // Build date filter based on period
    let dateFilter = {};
    const now = new Date();
    if (period === "month") {
      dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    } else if (period === "year") {
      dateFilter = { $gte: new Date(now.getFullYear(), 0, 1) };
    } else if (period === "6months") {
      dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1) };
    }

    // Get all orders for this seller
    let orderQuery = { "items.sellerId": sellerId };
    if (Object.keys(dateFilter).length > 0) {
      orderQuery.placedAt = dateFilter;
    }

    const allOrders = await orderModel.find(orderQuery).sort({ placedAt: -1 });

    // Calculate earnings
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let withdrawableBalance = 0;
    const recentTransactions = [];

    const completedStatuses = ["Delivered", "Completed"];
    const pendingStatuses = ["Pending", "Processing", "Shipped"];
    const commissionRate = 10; // 10% platform commission

    allOrders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId?.toString() === sellerId?.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const netAmount = orderTotal - (orderTotal * commissionRate / 100);

      if (orderTotal > 0) {
        if (completedStatuses.includes(order.status)) {
          totalEarnings += netAmount;
          withdrawableBalance += netAmount;
        } else if (pendingStatuses.includes(order.status)) {
          pendingEarnings += netAmount;
        }

        // Add to recent transactions (first 10)
        if (recentTransactions.length < 10) {
          recentTransactions.push({
            type: order.status === "Cancelled" || order.status === "Returned" ? "refund" : "order",
            description: `Order #${order._id.toString().slice(-8).toUpperCase()}`,
            orderId: order._id,
            amount: netAmount,
            date: order.placedAt
          });
        }
      }
    });

    // Subtract processed payouts from withdrawable balance
    const payouts = await PayoutModel.find({ 
      sellerId, 
      status: { $in: ["Completed", "Processing", "Pending"] }
    });
    const totalPayouts = payouts.reduce((acc, p) => acc + p.amount, 0);
    withdrawableBalance = Math.max(0, withdrawableBalance - totalPayouts);

    // Calculate monthly earnings for chart
    const monthlyEarnings = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthOrders = allOrders.filter(order => {
        const orderDate = new Date(order.placedAt);
        return orderDate >= monthDate && orderDate <= monthEnd && completedStatuses.includes(order.status);
      });

      let monthTotal = 0;
      monthOrders.forEach(order => {
        const sellerItems = order.items.filter(item => item.sellerId?.toString() === sellerId?.toString());
        const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        monthTotal += orderTotal - (orderTotal * commissionRate / 100);
      });

      monthlyEarnings.push({
        month: monthNames[monthDate.getMonth()],
        amount: monthTotal
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        pendingEarnings,
        withdrawableBalance,
        totalPayouts: payouts.filter(p => p.status === "Completed").reduce((acc, p) => acc + p.amount, 0),
        monthlyEarnings,
        recentTransactions
      }
    });
  } catch (error) {
    console.error("Earnings Overview Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============ SETTLEMENTS ============
export const getSettlements = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { status = "all" } = req.query;

    // Get completed orders grouped by week for settlements
    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      status: { $in: ["Delivered", "Completed"] }
    }).sort({ placedAt: -1 });

    const commissionRate = 10;
    const settlements = [];
    let totalSettled = 0;
    let pendingSettlement = 0;

    // Group orders by week to simulate settlements
    const weekGroups = {};
    orders.forEach(order => {
      const orderDate = new Date(order.placedAt);
      const weekStart = new Date(orderDate);
      weekStart.setDate(orderDate.getDate() - orderDate.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = {
          orders: [],
          periodStart: weekStart,
          periodEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
        };
      }
      weekGroups[weekKey].orders.push(order);
    });

    // Create settlement records from week groups
    Object.keys(weekGroups).sort().reverse().forEach((weekKey, index) => {
      const group = weekGroups[weekKey];
      let grossAmount = 0;
      let orderCount = 0;

      group.orders.forEach(order => {
        const sellerItems = order.items.filter(item => item.sellerId?.toString() === sellerId?.toString());
        const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        grossAmount += orderTotal;
        orderCount++;
      });

      const deductions = grossAmount * commissionRate / 100;
      const netAmount = grossAmount - deductions;
      
      // Simulate status based on age
      const daysSinceEnd = Math.floor((new Date() - group.periodEnd) / (24 * 60 * 60 * 1000));
      let settlementStatus = "pending";
      if (daysSinceEnd > 14) {
        settlementStatus = "completed";
        totalSettled += netAmount;
      } else if (daysSinceEnd > 7) {
        settlementStatus = "processing";
        pendingSettlement += netAmount;
      } else {
        pendingSettlement += netAmount;
      }

      if (status === "all" || status === settlementStatus) {
        settlements.push({
          settlementId: `SET${weekKey.replace(/-/g, '')}`,
          periodStart: group.periodStart,
          periodEnd: group.periodEnd,
          orderCount,
          grossAmount,
          deductions,
          netAmount,
          status: settlementStatus,
          settlementDate: new Date(group.periodEnd.getTime() + 14 * 24 * 60 * 60 * 1000)
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        settlements: settlements.slice(0, 20),
        stats: {
          totalSettled,
          pendingSettlement,
          nextSettlement: settlements.find(s => s.status === "processing")?.settlementDate || null,
          avgSettlementDays: 7,
          commissionRate
        }
      }
    });
  } catch (error) {
    console.error("Settlements Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============ TRANSACTIONS (All types) ============
export const getAllTransactions = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { page = 1, limit = 20, type = "all" } = req.query;

    const commissionRate = 10;
    const transactions = [];

    // Get orders
    const orders = await orderModel.find({ "items.sellerId": sellerId })
      .populate("user", "name email")
      .sort({ placedAt: -1 });

    // Get payouts
    const payouts = await PayoutModel.find({ sellerId }).sort({ requestedAt: -1 });

    // Process orders into transactions
    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId?.toString() === sellerId?.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      if (orderTotal > 0) {
        const commissionAmount = orderTotal * commissionRate / 100;

        // Order transaction (credit)
        if (type === "all" || type === "order") {
          if (!["Cancelled", "Returned"].includes(order.status)) {
            transactions.push({
              id: `ORD-${order._id}`,
              type: "order",
              description: order.user?.name || order.shippingAddress?.name || "Order Payment",
              orderId: order._id.toString(),
              email: order.user?.email || "",
              amount: orderTotal,
              date: order.placedAt,
              status: order.status
            });
          }
        }

        // Commission transaction (debit)
        if ((type === "all" || type === "commission") && ["Delivered", "Completed"].includes(order.status)) {
          transactions.push({
            id: `COM-${order._id}`,
            type: "commission",
            description: `Platform fee for Order #${order._id.toString().slice(-8).toUpperCase()}`,
            orderId: order._id.toString(),
            email: "",
            amount: commissionAmount,
            date: order.placedAt,
            status: "Deducted"
          });
        }

        // Refund transaction (debit)
        if ((type === "all" || type === "refund") && ["Cancelled", "Returned"].includes(order.status)) {
          transactions.push({
            id: `REF-${order._id}`,
            type: "refund",
            description: `Refund for Order #${order._id.toString().slice(-8).toUpperCase()}`,
            orderId: order._id.toString(),
            email: order.user?.email || "",
            amount: orderTotal,
            date: order.placedAt,
            status: order.status
          });
        }
      }
    });

    // Add payout transactions
    if (type === "all" || type === "payout") {
      payouts.forEach(payout => {
        transactions.push({
          id: `PAY-${payout._id}`,
          type: "payout",
          description: `Payout via ${payout.paymentMethod}`,
          orderId: "",
          email: "",
          amount: payout.amount,
          date: payout.requestedAt,
          status: payout.status
        });
      });
    }

    // Sort by date
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedTransactions = transactions.slice(startIndex, startIndex + parseInt(limit));

    // Calculate totals
    const totalCredit = transactions
      .filter(t => t.type === "order")
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalDebit = transactions
      .filter(t => ["refund", "commission", "payout"].includes(t.type))
      .reduce((acc, t) => acc + t.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        totalAmount: totalCredit - totalDebit,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(transactions.length / limit),
          totalItems: transactions.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error("All Transactions Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Pending Payments
export const getPendingPayments = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    
    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      status: { $in: ["Pending", "Processing", "Shipped"] }
    }).populate("user", "name email");

    let pendingAmount = 0;
    const pendingOrders = [];

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (orderTotal > 0) {
        pendingAmount += orderTotal;
        pendingOrders.push({
          orderId: order._id,
          date: order.placedAt,
          customer: order.user?.name || order.shippingAddress?.name || "Guest",
          amount: orderTotal,
          status: order.status,
          expectedDate: new Date(order.placedAt.getTime() + 7 * 24 * 60 * 60 * 1000)
        });
      }
    });

    pendingOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ 
      success: true, 
      data: {
        pendingAmount,
        pendingOrders,
        totalPendingOrders: pendingOrders.length
      }
    });
  } catch (error) {
    console.error("Pending Payments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Transaction History
export const getTransactionHistory = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    let query = { "items.sellerId": sellerId };
    
    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.placedAt = {};
      if (startDate) query.placedAt.$gte = new Date(startDate);
      if (endDate) query.placedAt.$lte = new Date(endDate);
    }

    const orders = await orderModel.find(query)
      .populate("user", "name email")
      .sort({ placedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await orderModel.countDocuments(query);

    const transactions = [];
    let totalAmount = 0;

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (orderTotal > 0) {
        totalAmount += orderTotal;
        transactions.push({
          _id: order._id,
          orderId: order._id,
          date: order.placedAt,
          customer: order.user?.name || order.shippingAddress?.name || "Guest",
          email: order.user?.email || "N/A",
          items: sellerItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          amount: orderTotal,
          status: order.status,
          paymentId: order.paymentId
        });
      }
    });

    res.status(200).json({ 
      success: true, 
      data: {
        transactions,
        totalAmount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error("Transaction History Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Payout Requests
export const getPayoutRequests = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    
    const payouts = await PayoutModel.find({ sellerId }).sort({ requestedAt: -1 });

    // Calculate available balance from completed orders
    const completedOrders = await orderModel.find({
      "items.sellerId": sellerId,
      status: { $in: ["Delivered", "Completed"] }
    });

    let availableBalance = 0;
    completedOrders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      availableBalance += sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    });

    // Subtract already processed/pending payouts
    const processedPayouts = payouts
      .filter(p => ["Completed", "Processing", "Pending"].includes(p.status))
      .reduce((acc, p) => acc + p.amount, 0);

    availableBalance = Math.max(0, availableBalance - processedPayouts);

    res.status(200).json({ 
      success: true, 
      data: {
        payouts,
        availableBalance,
        totalWithdrawn: payouts.filter(p => p.status === "Completed").reduce((acc, p) => acc + p.amount, 0)
      }
    });
  } catch (error) {
    console.error("Payout Requests Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Request Payout
export const requestPayout = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { amount, paymentMethod, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid payout amount" });
    }

    // Verify available balance
    const completedOrders = await orderModel.find({
      "items.sellerId": sellerId,
      status: { $in: ["Delivered", "Completed"] }
    });

    let availableBalance = 0;
    completedOrders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      availableBalance += sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    });

    const existingPayouts = await PayoutModel.find({ 
      sellerId, 
      status: { $in: ["Completed", "Processing", "Pending"] }
    });
    const processedAmount = existingPayouts.reduce((acc, p) => acc + p.amount, 0);
    availableBalance = Math.max(0, availableBalance - processedAmount);

    if (amount > availableBalance) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const payout = new PayoutModel({
      sellerId,
      amount,
      paymentMethod: paymentMethod || "Bank Transfer",
      notes
    });

    await payout.save();

    res.status(201).json({ success: true, message: "Payout request submitted", payout });
  } catch (error) {
    console.error("Request Payout Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Commission Details
export const getCommissionDetails = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const commissionRate = 10; // Default 10%

    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      status: { $in: ["Delivered", "Completed"] }
    }).sort({ placedAt: -1 });

    let totalSales = 0;
    let totalCommission = 0;
    const commissionBreakdown = [];

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const commission = orderTotal * (commissionRate / 100);
      
      if (orderTotal > 0) {
        totalSales += orderTotal;
        totalCommission += commission;
        commissionBreakdown.push({
          orderId: order._id,
          date: order.placedAt,
          orderValue: orderTotal,
          commissionRate,
          commissionAmount: commission,
          netEarnings: orderTotal - commission
        });
      }
    });

    res.status(200).json({ 
      success: true, 
      data: {
        commissionRate,
        totalSales,
        totalCommission,
        netEarnings: totalSales - totalCommission,
        commissionBreakdown: commissionBreakdown.slice(0, 50) // Last 50 transactions
      }
    });
  } catch (error) {
    console.error("Commission Details Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Bank Details
export const getBankDetails = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    
    const bankDetails = await BankDetailsModel.findOne({ sellerId });

    res.status(200).json({ success: true, data: bankDetails });
  } catch (error) {
    console.error("Bank Details Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Save/Update Bank Details
export const saveBankDetails = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { accountHolderName, bankName, accountNumber, ifscCode, branchName, upiId } = req.body;

    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let bankDetails = await BankDetailsModel.findOne({ sellerId });

    if (bankDetails) {
      bankDetails.accountHolderName = accountHolderName;
      bankDetails.bankName = bankName;
      bankDetails.accountNumber = accountNumber;
      bankDetails.ifscCode = ifscCode;
      bankDetails.branchName = branchName;
      bankDetails.upiId = upiId;
      await bankDetails.save();
    } else {
      bankDetails = new BankDetailsModel({
        sellerId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        branchName,
        upiId
      });
      await bankDetails.save();
    }

    res.status(200).json({ success: true, message: "Bank details saved successfully", data: bankDetails });
  } catch (error) {
    console.error("Save Bank Details Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Invoices
export const getInvoices = async (req, res) => {
  try {
    const sellerId = req.sellerId || req.body.sellerId;
    const { page = 1, limit = 20 } = req.query;

    const orders = await orderModel.find({
      "items.sellerId": sellerId,
      status: { $in: ["Delivered", "Completed"] }
    })
      .populate("user", "name email")
      .sort({ placedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await orderModel.countDocuments({
      "items.sellerId": sellerId,
      status: { $in: ["Delivered", "Completed"] }
    });

    const invoices = orders.map((order, index) => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const orderTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      return {
        invoiceNumber: `INV-${order._id.toString().slice(-8).toUpperCase()}`,
        orderId: order._id,
        date: order.placedAt,
        customer: {
          name: order.user?.name || order.shippingAddress?.name || "Guest",
          email: order.user?.email || "N/A",
          address: order.shippingAddress
        },
        items: sellerItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal: orderTotal,
        tax: 0,
        total: orderTotal,
        status: "Paid"
      };
    });

    res.status(200).json({ 
      success: true, 
      data: {
        invoices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount
        }
      }
    });
  } catch (error) {
    console.error("Invoices Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
