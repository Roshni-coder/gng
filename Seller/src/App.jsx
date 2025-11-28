import React, { useState, createContext } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Slide } from '@mui/material';
import { IoMdClose } from "react-icons/io";

// Pages & Components
import Header from './Components/Header/Header.jsx';
import SideBar from './Components/Sidebar/SideBar.jsx';
import DashBoard from './Pages/DashBoard/DashBoard.jsx';
import ProductList from './Pages/Product Pages/ProductList.jsx';
import ActiveProducts from './Pages/Product Pages/ActiveProducts.jsx';
import OutOfStockProducts from './Pages/Product Pages/OutOfStockProducts.jsx';
import ProductReviews from './Pages/Product Pages/ProductReviews.jsx';
import AddProduct from './Pages/Product Pages/AddProduct.jsx';
import OrdersList from './Pages/Orders Pages/OrdersList.jsx';
import CategoryList from './Pages/Category/CategoryList.jsx';
import AddCategory from './Pages/Category/AddCategory.jsx';
import SubCategoryList from './Pages/Category/SubCategoryList.jsx';
import AddSubCategory from './Pages/Category/AddSubCategory.jsx';
import SellerProfile from './Pages/Seller Profile/SellerProfile.jsx';
import Login from './Pages/Login/Login.jsx';
import ProtectedRoute from './Pages/ProtectedRoute.jsx';

// Reports & Communication
import ProductPerformance from './Pages/Reports/ProductPerformance.jsx';
import AdminMessages from './Pages/Communication/AdminMessages.jsx';
import SupportTickets from './Pages/Communication/SupportTickets.jsx';
import Notifications from './Pages/Communication/Notifications.jsx';
import ChatCustomers from './Pages/Communication/ChatCustomers.jsx';
import EmailResponses from './Pages/Communication/EmailResponses.jsx';

// Finance & Payments
import Overview from './Pages/Payments/Overview.jsx';
import Transactions from './Pages/Payments/Transactions.jsx';
import Payouts from './Pages/Payments/Payouts.jsx';
import BankDetails from './Pages/Finance/BankDetails.jsx';

// Customers
import MyCustomers from './Pages/Customers/MyCustomers.jsx';
import Engagement from './Pages/Customers/Engagement.jsx';

// Store
import Settings from './Pages/Store/Settings.jsx';
import StoreCustomization from './Pages/Store/StoreCustomization.jsx';

// Analytics
import Analytics from './Pages/Analytics/Analytics.jsx';
import InventoryReports from './Pages/Analytics/InventoryReports.jsx';

// Categories
import MyCategories from './Pages/Categories/MyCategories.jsx';
import OpportunityExplorer from './Pages/Categories/OpportunityExplorer.jsx';

// Marketing
import Promotions from './Pages/Marketing/Promotions.jsx';
import CampaignsTools from './Pages/Marketing/CampaignsTools.jsx';

// Shipping
import ShippingSettings from './Pages/Shipping/Settings.jsx';
import Shipments from './Pages/Shipping/Shipments.jsx';

// Reviews
import StoreReviews from './Pages/Reviews/StoreReviews.jsx';
import RespondToReviews from './Pages/Reviews/RespondToReviews.jsx';
import ReviewRequests from './Pages/Reviews/ReviewRequests.jsx';
import RatingInsights from './Pages/Reviews/RatingInsights.jsx';
import ProductReviewsPage from './Pages/Reviews/ProductReviews.jsx';

// Personalization
import PersonalizationOptions from './Pages/Personalization/PersonalizationOptions.jsx';
import GiftWrapping from './Pages/Personalization/GiftWrapping.jsx';
import GreetingCards from './Pages/Personalization/GreetingCards.jsx';
import CustomMessages from './Pages/Personalization/CustomMessages.jsx';
import AddOnServices from './Pages/Personalization/AddOnServices.jsx';
import BulkPersonalization from './Pages/Personalization/BulkPersonalization.jsx';
import CustomPricing from './Pages/Personalization/CustomPricing.jsx';

export const MyContext = createContext();
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Layout({ children }) {
  return (
    <section className="main h-screen w-full flex flex-col bg-[#F9FAFB]">
      <Header />
      <div className="flex w-full overflow-hidden flex-1">
        <aside className="h-full">
          <SideBar />
        </aside>
        <main className="flex-1 py-6 px-6 overflow-y-auto bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </section>
  );
}

function App() {
  const [isOpenAddProductPanel, setIsOpenAddProductPanel] = useState({
    open: false,
    model: ''
  });
  const values = {
    isOpenAddProductPanel,
    setIsOpenAddProductPanel
  };
  const router = createBrowserRouter([
    { path: '/', element: <ProtectedRoute><Layout><DashBoard /></Layout></ProtectedRoute> },
    { path: '/login', element: <Login /> },
    { path: '/products', element: <ProtectedRoute><Layout><ProductList /></Layout></ProtectedRoute> },
    { path: '/products/active', element: <ProtectedRoute><Layout><ActiveProducts /></Layout></ProtectedRoute> },
    { path: '/products/out-of-stock', element: <ProtectedRoute><Layout><OutOfStockProducts /></Layout></ProtectedRoute> },
    { path: '/products/reviews', element: <ProtectedRoute><Layout><ProductReviews /></Layout></ProtectedRoute> },
    { path: '/products/inventory', element: <ProtectedRoute><Layout><InventoryReports /></Layout></ProtectedRoute> },
    { path: '/orders', element: <ProtectedRoute><Layout><OrdersList /></Layout></ProtectedRoute> },
    { path: '/orders/pending', element: <ProtectedRoute><Layout><OrdersList statusKey="pending" /></Layout></ProtectedRoute> },
    { path: '/orders/processing', element: <ProtectedRoute><Layout><OrdersList statusKey="processing" /></Layout></ProtectedRoute> },
    { path: '/orders/shipped', element: <ProtectedRoute><Layout><OrdersList statusKey="shipped" /></Layout></ProtectedRoute> },
    { path: '/orders/delivered', element: <ProtectedRoute><Layout><OrdersList statusKey="delivered" /></Layout></ProtectedRoute> },
    { path: '/orders/cancelled', element: <ProtectedRoute><Layout><OrdersList statusKey="cancelled" /></Layout></ProtectedRoute> },
    { path: '/categorylist', element: <ProtectedRoute><Layout><CategoryList /></Layout></ProtectedRoute> },
    { path: '/subcategorylist', element: <ProtectedRoute><Layout><SubCategoryList /></Layout></ProtectedRoute> },
    { path: '/seller-profile', element: <ProtectedRoute><Layout><SellerProfile /></Layout></ProtectedRoute> },
    
    // Reports
    { path: '/reports/product-performance', element: <ProtectedRoute><Layout><ProductPerformance /></Layout></ProtectedRoute> },
    
    // Communication
    { path: '/communication/admin-messages', element: <ProtectedRoute><Layout><AdminMessages /></Layout></ProtectedRoute> },
    { path: '/communication/support-tickets', element: <ProtectedRoute><Layout><SupportTickets /></Layout></ProtectedRoute> },
    { path: '/communication/notifications', element: <ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute> },
    { path: '/communication/chat-customers', element: <ProtectedRoute><Layout><ChatCustomers /></Layout></ProtectedRoute> },
    { path: '/communication/email-responses', element: <ProtectedRoute><Layout><EmailResponses /></Layout></ProtectedRoute> },

    // Payments & Finance
    { path: '/payments/overview', element: <ProtectedRoute><Layout><Overview /></Layout></ProtectedRoute> },
    { path: '/payments/transactions', element: <ProtectedRoute><Layout><Transactions /></Layout></ProtectedRoute> },
    { path: '/payments/payouts', element: <ProtectedRoute><Layout><Payouts /></Layout></ProtectedRoute> },
    { path: '/payments/bank-details', element: <ProtectedRoute><Layout><BankDetails /></Layout></ProtectedRoute> },

    // Customers
    { path: '/customers', element: <ProtectedRoute><Layout><MyCustomers /></Layout></ProtectedRoute> },
    { path: '/customers/engagement', element: <ProtectedRoute><Layout><Engagement /></Layout></ProtectedRoute> },

    // Store
    { path: '/store/settings', element: <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute> },
    { path: '/store/appearance', element: <ProtectedRoute><Layout><StoreCustomization /></Layout></ProtectedRoute> },

    // Analytics
    { path: '/analytics', element: <ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute> },

    // Categories
    { path: '/categories/my', element: <ProtectedRoute><Layout><MyCategories /></Layout></ProtectedRoute> },
    { path: '/categories/explorer', element: <ProtectedRoute><Layout><OpportunityExplorer /></Layout></ProtectedRoute> },

    // Marketing
    { path: '/marketing/promotions', element: <ProtectedRoute><Layout><Promotions /></Layout></ProtectedRoute> },
    { path: '/marketing/campaigns', element: <ProtectedRoute><Layout><CampaignsTools /></Layout></ProtectedRoute> },

    // Shipping
    { path: '/shipping/settings', element: <ProtectedRoute><Layout><ShippingSettings /></Layout></ProtectedRoute> },
    { path: '/shipping/shipments', element: <ProtectedRoute><Layout><Shipments /></Layout></ProtectedRoute> },

    // Reviews
    { path: '/reviews/products', element: <ProtectedRoute><Layout><ProductReviewsPage /></Layout></ProtectedRoute> },
    { path: '/reviews/store', element: <ProtectedRoute><Layout><StoreReviews /></Layout></ProtectedRoute> },
    { path: '/reviews/respond', element: <ProtectedRoute><Layout><RespondToReviews /></Layout></ProtectedRoute> },
    { path: '/reviews/requests', element: <ProtectedRoute><Layout><ReviewRequests /></Layout></ProtectedRoute> },
    { path: '/reviews/insights', element: <ProtectedRoute><Layout><RatingInsights /></Layout></ProtectedRoute> },

    // Personalization
    { path: '/personalization/options', element: <ProtectedRoute><Layout><PersonalizationOptions /></Layout></ProtectedRoute> },
    { path: '/personalization/gift-wrapping', element: <ProtectedRoute><Layout><GiftWrapping /></Layout></ProtectedRoute> },
    { path: '/personalization/greeting-cards', element: <ProtectedRoute><Layout><GreetingCards /></Layout></ProtectedRoute> },
    { path: '/personalization/messages', element: <ProtectedRoute><Layout><CustomMessages /></Layout></ProtectedRoute> },
    { path: '/personalization/addons', element: <ProtectedRoute><Layout><AddOnServices /></Layout></ProtectedRoute> },
    { path: '/personalization/bulk', element: <ProtectedRoute><Layout><BulkPersonalization /></Layout></ProtectedRoute> },
    { path: '/personalization/pricing', element: <ProtectedRoute><Layout><CustomPricing /></Layout></ProtectedRoute> },
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      {/* Dialog for Add Forms */}
      <Dialog
        fullScreen
        open={isOpenAddProductPanel.open}
        onClose={() => setIsOpenAddProductPanel({ open: false })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} className="!bg-white !shadow-md !py-4">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setIsOpenAddProductPanel({ open: false })}
              aria-label="close"
            >
              <IoMdClose className="text-gray-800 text-[18px]" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">{isOpenAddProductPanel?.model}</span>
            </Typography>
          </Toolbar>
        </AppBar>
        {isOpenAddProductPanel?.model === 'Add Product' && <AddProduct />}
        {isOpenAddProductPanel?.model === 'Add New Category' && <AddCategory />}
        {isOpenAddProductPanel?.model === 'Add New Sub Category' && <AddSubCategory />}
      </Dialog>
    </MyContext.Provider>
  );
}

export default App;