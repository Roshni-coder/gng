import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Home/Header/Header.jsx";
import Home from "../src/Components/Home/HomePage.jsx";
import Footer from "./Components/Home/Footer/Footer.jsx";
import ProductList from "./Components/ProductList/ProductList.jsx";
import ProductDetail from "./Components/ProductDetalis/ProductDetail.jsx";
import Login from "./Components/LoginPage/Login.jsx";
import Emailverify from "./Components/LoginPage/Emailverify.jsx";
import Reset_pass from "./Components/LoginPage/Reset_pass.jsx";
import MyProfile from "./Components/My Profile/MyProfile.jsx";
import Cartpage from "./Components/Cart Page/Cartpage.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import AddAddress from "./Components/BillingPage/AddAddress.jsx";
import WishlistPage from "./Components/Wish List/WishlistPage.jsx";
import OrderSummery from "./Components/Order Summery/OrderSummery.jsx";
import PaymentSuccess from "./Components/Order Summery/PaymentSuccess.jsx";
import Feedback from "./Components/Feedback/Feedback.jsx";
import OrderSuccess from "./Components/Order Summery/OrderSuccess.jsx";
import SearchResultsPage from "./Components/Home/Header/Navigations/SearchResultsPage.jsx";
import Support_Policy from "./Components/Home/Footer/Support_Policy.jsx";
import TermsAndConditions from "./Components/Home/Footer/Terms&Condition.jsx";
import PrivacyPolicy from "./Components/Home/Footer/PrivacyPolicy.jsx";
import ShippingInfo from "./Components/Home/Footer/Shippinginfo.jsx";
import OrderTracking from "./Components/Home/Header/TopStrip/OrderTracking.jsx";
import HelpCenter from "./Components/Home/Header/TopStrip/HelpCenter.jsx";
import ContactUs from './Components/Home/Header/TopStrip/ContactUs.jsx'
import TermsOfUse from "./Components/Home/Footer/TermOfUSe.jsx";
import FAQs from './Components/Home/Footer/FAQs.jsx';
import Desclaimer from './Components/Home/Footer/Desclaimer.jsx'
import BulkOrders from './Components/Home/Footer/BulkOrders.jsx'
import RefundPlicy from './Components/Home/Footer/RefundPolicy.jsx'
import ErrorPage from "./Components/ErrorPage/ErrorPage.jsx";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<Emailverify />} />
        <Route path="/Reset_pass" element={<Reset_pass />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cartlist" element={<Cartpage />} />
        {/* <Route path="/checkout" element={<Checkout/>}/> */}
        <Route path="/addaddress" element={<AddAddress />} />
        <Route path="/ordersummery" element={<OrderSummery />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/support-policy" element={<Support_Policy />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} /> 
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/order-tracking" element={<OrderTracking />} /> 
        <Route path="/terms-of-use" element={<TermsOfUse />} /> 
        <Route path="/faqs" element={<FAQs/>} /> 
        <Route path="/disclaimer" element={<Desclaimer/>} /> 
         <Route path="/bulk-orders" element={<BulkOrders/>} /> 
         <Route path="/refund-policy" element={<RefundPlicy/>} />
         <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
