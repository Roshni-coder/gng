import express from "express";
import authseller from "../middleware/authseller.js";

// Finance Controllers
import {
  getPendingPayments,
  getTransactionHistory,
  getPayoutRequests,
  requestPayout,
  getCommissionDetails,
  getBankDetails,
  saveBankDetails,
  getInvoices,
  getEarningsOverview,
  getSettlements,
  getAllTransactions
} from "../controller/financeController.js";

// Customer Controllers
import {
  getCustomerOrderHistory,
  getCustomerReviews,
  getWishlistInsights,
  getCustomerMessages,
  getLoyaltyProgram
} from "../controller/customerController.js";

// Store Controllers
import {
  getStoreSettings,
  updateStoreSettings,
  getBusinessInfo,
  updateBusinessInfo,
  getStoreCustomization,
  updateStoreCustomization,
  getHolidayMode,
  updateHolidayMode,
  getStorePerformance,
  getVerificationStatus,
  submitVerificationDocuments
} from "../controller/storeController.js";

// Analytics Controllers
import {
  getRevenueAnalytics,
  getProductAnalytics,
  getTrafficInsights,
  getConversionReports,
  exportData,
  getInventoryReports
} from "../controller/analyticsController.js";

// Category Analytics Controllers
import {
  getMyCategories,
  getCategoryPerformance,
  getCategorySuggestions
} from "../controller/categoryAnalyticsController.js";

// Marketing Controllers
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getStoreDiscounts,
  updateProductDiscount,
  bulkUpdateDiscounts,
  getMarketingBudget,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
  getPromotionalTools,
  // Legacy exports
  getMyPromotions,
  getDiscountManager,
  getFeaturedProducts,
  getSeasonalOffers
} from "../controller/marketingController.js";

// Shipping Controllers
import {
  getAllShippingSettings,
  updateAllShippingSettings,
  getShipments,
  getShippingSettings,
  updateShippingSettings,
  getDeliveryPartners,
  updateDeliveryPartners,
  getShippingRates,
  updateShippingRates,
  getPackageDimensions,
  updatePackageDimensions,
  getTrackingOrders,
  getPickupSchedule,
  updatePickupSchedule,
  getReturnAddress,
  updateReturnAddress
} from "../controller/shippingController.js";

// Review Controllers
import {
  getProductReviews,
  getMyReviews,
  getProductReviewsForSeller,
  getStoreReviews,
  respondToReview,
  getReviewRequests,
  getRatingInsights,
  getResponseQueue
} from "../controller/reviewController.js";

// Personalization Controllers
import {
  getPersonalizationOptions,
  getGiftWrappingOptions,
  getGreetingCards,
  getCustomMessageOptions,
  getAddOnServices,
  createPersonalizationOption,
  updatePersonalizationOption,
  deletePersonalizationOption,
  getCustomPricing
} from "../controller/personalizationController.js";

const sellerPanelRouter = express.Router();

// ============ FINANCE ROUTES ============
sellerPanelRouter.get("/finance/earnings", authseller, getEarningsOverview);
sellerPanelRouter.get("/finance/settlements", authseller, getSettlements);
sellerPanelRouter.get("/finance/pending-payments", authseller, getPendingPayments);
sellerPanelRouter.get("/finance/transactions", authseller, getAllTransactions);
sellerPanelRouter.get("/finance/payouts", authseller, getPayoutRequests);
sellerPanelRouter.post("/finance/payouts", authseller, requestPayout);
sellerPanelRouter.get("/finance/commission", authseller, getCommissionDetails);
sellerPanelRouter.get("/finance/bank-details", authseller, getBankDetails);
sellerPanelRouter.post("/finance/bank-details", authseller, saveBankDetails);
sellerPanelRouter.get("/finance/invoices", authseller, getInvoices);

// ============ CUSTOMER ROUTES ============
sellerPanelRouter.get("/customers/order-history", authseller, getCustomerOrderHistory);
sellerPanelRouter.get("/customers/reviews", authseller, getCustomerReviews);
sellerPanelRouter.get("/customers/wishlist-insights", authseller, getWishlistInsights);
sellerPanelRouter.get("/customers/messages", authseller, getCustomerMessages);
sellerPanelRouter.get("/customers/loyalty", authseller, getLoyaltyProgram);

// ============ STORE ROUTES ============
sellerPanelRouter.get("/store/settings", authseller, getStoreSettings);
sellerPanelRouter.post("/store/settings", authseller, updateStoreSettings);
sellerPanelRouter.get("/store/business-info", authseller, getBusinessInfo);
sellerPanelRouter.post("/store/business-info", authseller, updateBusinessInfo);
sellerPanelRouter.get("/store/customization", authseller, getStoreCustomization);
sellerPanelRouter.post("/store/customization", authseller, updateStoreCustomization);
sellerPanelRouter.get("/store/holiday-mode", authseller, getHolidayMode);
sellerPanelRouter.post("/store/holiday-mode", authseller, updateHolidayMode);
sellerPanelRouter.get("/store/performance", authseller, getStorePerformance);
sellerPanelRouter.get("/store/verification", authseller, getVerificationStatus);
sellerPanelRouter.post("/store/verification", authseller, submitVerificationDocuments);

// ============ ANALYTICS ROUTES ============
sellerPanelRouter.get("/analytics/revenue", authseller, getRevenueAnalytics);
sellerPanelRouter.get("/analytics/products", authseller, getProductAnalytics);
sellerPanelRouter.get("/analytics/traffic", authseller, getTrafficInsights);
sellerPanelRouter.get("/analytics/conversion", authseller, getConversionReports);
sellerPanelRouter.get("/analytics/export", authseller, exportData);
sellerPanelRouter.get("/analytics/inventory", authseller, getInventoryReports);

// ============ CATEGORY ROUTES ============
sellerPanelRouter.get("/categories/my-categories", authseller, getMyCategories);
sellerPanelRouter.get("/categories/performance", authseller, getCategoryPerformance);
sellerPanelRouter.get("/categories/suggestions", authseller, getCategorySuggestions);

// ============ MARKETING ROUTES ============
// Promotions - Coupons
sellerPanelRouter.get("/marketing/coupons", authseller, getCoupons);
sellerPanelRouter.post("/marketing/coupons", authseller, createCoupon);
sellerPanelRouter.put("/marketing/coupons", authseller, updateCoupon);
sellerPanelRouter.delete("/marketing/coupons/:couponId", authseller, deleteCoupon);
sellerPanelRouter.post("/marketing/coupons/toggle", authseller, toggleCouponStatus);

// Promotions - Store Discounts
sellerPanelRouter.get("/marketing/discounts", authseller, getStoreDiscounts);
sellerPanelRouter.post("/marketing/discounts", authseller, updateProductDiscount);
sellerPanelRouter.post("/marketing/discounts/bulk", authseller, bulkUpdateDiscounts);

// Campaigns & Tools
sellerPanelRouter.get("/marketing/budget", authseller, getMarketingBudget);
sellerPanelRouter.get("/marketing/campaigns", authseller, getCampaigns);
sellerPanelRouter.post("/marketing/campaigns", authseller, createCampaign);
sellerPanelRouter.put("/marketing/campaigns", authseller, updateCampaign);
sellerPanelRouter.delete("/marketing/campaigns/:campaignId", authseller, deleteCampaign);
sellerPanelRouter.post("/marketing/campaigns/toggle", authseller, toggleCampaignStatus);
sellerPanelRouter.get("/marketing/tools", authseller, getPromotionalTools);

// Legacy routes (for backward compatibility)
sellerPanelRouter.get("/marketing/promotions", authseller, getMyPromotions);
sellerPanelRouter.get("/marketing/featured", authseller, getFeaturedProducts);
sellerPanelRouter.get("/marketing/seasonal", authseller, getSeasonalOffers);

// ============ SHIPPING ROUTES ============
// New consolidated endpoints
sellerPanelRouter.get("/shipping/all-settings", authseller, getAllShippingSettings);
sellerPanelRouter.post("/shipping/all-settings", authseller, updateAllShippingSettings);
sellerPanelRouter.get("/shipping/shipments", authseller, getShipments);

// Legacy routes (for backward compatibility)
sellerPanelRouter.get("/shipping/settings", authseller, getShippingSettings);
sellerPanelRouter.post("/shipping/settings", authseller, updateShippingSettings);
sellerPanelRouter.get("/shipping/partners", authseller, getDeliveryPartners);
sellerPanelRouter.post("/shipping/partners", authseller, updateDeliveryPartners);
sellerPanelRouter.get("/shipping/rates", authseller, getShippingRates);
sellerPanelRouter.post("/shipping/rates", authseller, updateShippingRates);
sellerPanelRouter.get("/shipping/dimensions", authseller, getPackageDimensions);
sellerPanelRouter.post("/shipping/dimensions", authseller, updatePackageDimensions);
sellerPanelRouter.get("/shipping/tracking", authseller, getTrackingOrders);
sellerPanelRouter.get("/shipping/pickup", authseller, getPickupSchedule);
sellerPanelRouter.post("/shipping/pickup", authseller, updatePickupSchedule);
sellerPanelRouter.get("/shipping/return-address", authseller, getReturnAddress);
sellerPanelRouter.post("/shipping/return-address", authseller, updateReturnAddress);

// ============ REVIEW ROUTES ============
sellerPanelRouter.get("/reviews/by-product", authseller, getProductReviews);
sellerPanelRouter.get("/reviews/my-reviews", authseller, getMyReviews);
sellerPanelRouter.get("/reviews/product", authseller, getProductReviewsForSeller);
sellerPanelRouter.get("/reviews/store", authseller, getStoreReviews);
sellerPanelRouter.get("/reviews/respond-list", authseller, getResponseQueue);
sellerPanelRouter.post("/reviews/respond", authseller, respondToReview);
sellerPanelRouter.post("/reviews/:reviewId/respond", authseller, respondToReview);
sellerPanelRouter.get("/reviews/requests", authseller, getReviewRequests);
sellerPanelRouter.get("/reviews/insights", authseller, getRatingInsights);

// ============ PERSONALIZATION ROUTES ============
sellerPanelRouter.get("/personalization/options", authseller, getPersonalizationOptions);
sellerPanelRouter.get("/personalization/gift-wrapping", authseller, getGiftWrappingOptions);
sellerPanelRouter.get("/personalization/greeting-cards", authseller, getGreetingCards);
sellerPanelRouter.get("/personalization/custom-messages", authseller, getCustomMessageOptions);
sellerPanelRouter.get("/personalization/add-ons", authseller, getAddOnServices);
sellerPanelRouter.post("/personalization/options", authseller, createPersonalizationOption);
sellerPanelRouter.put("/personalization/options", authseller, updatePersonalizationOption);
sellerPanelRouter.delete("/personalization/options/:optionId", authseller, deletePersonalizationOption);
sellerPanelRouter.get("/personalization/pricing", authseller, getCustomPricing);

export default sellerPanelRouter;
