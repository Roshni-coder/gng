import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import {
  LuUsers,
  LuMegaphone,
  LuTruck,
  LuStar,
  LuGift,
} from "react-icons/lu";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlinePayments, MdOutlineMessage, MdOutlineInsights } from "react-icons/md";
import { PiStorefrontLight } from "react-icons/pi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { Collapse as ReactCollapse } from "react-collapse";
import { MyContext } from "../../App.jsx";

const menuSections = [
  {
    title: "Dashboard",
    icon: RxDashboard,
    items: [
      { label: "Sales Dashboard", path: "/", highlight: true },
      { label: "Order History", path: "/orders" },
    ],
  },
  {
    title: "Products",
    icon: RiProductHuntLine,
    items: [
      { label: "My Products", path: "/products", highlight: true },
      { label: "Add New Product", action: { type: "modal", model: "Add Product" } },
      { label: "Active Products", path: "/products/active" },
      { label: "Out of Stock", path: "/products/out-of-stock" },
      { label: "Product Reviews", path: "/products/reviews" },
      { label: "Inventory Reports", path: "/products/inventory" },
    ],
  },
  {
    title: "Orders",
    icon: HiOutlineClipboardList,
    items: [
      { label: "Pending", path: "/orders/pending", highlight: true },
      { label: "Processing", path: "/orders/processing" },
      { label: "Shipped", path: "/orders/shipped" },
      { label: "Delivered", path: "/orders/delivered" },
      { label: "Cancelled", path: "/orders/cancelled" },
    ],
  },
  // Communication section
  {
    title: "Payments & Finance",
    icon: MdOutlinePayments,
    items: [
      { label: "Overview", path: "/payments/overview" },
      { label: "Transactions", path: "/payments/transactions" },
      { label: "Payouts", path: "/payments/payouts" },
      { label: "Bank Details", path: "/payments/bank-details" },
    ],
  },
  {
    title: "Customers",
    icon: LuUsers,
    items: [
      { label: "My Customers", path: "/customers", highlight: true },
      { label: "Engagement", path: "/customers/engagement" },
    ],
  },
  {
    title: "Store",
    icon: PiStorefrontLight,
    items: [
      { label: "My Store Profile", path: "/seller-profile", highlight: true },
      { label: "Settings", path: "/store/settings" },
      { label: "Appearance", path: "/store/appearance" },
    ],
  },
  // Analytics section
  {
    title: "Analytics",
    icon: MdOutlineInsights,
    items: [
      { label: "Analytics Dashboard", path: "/analytics", highlight: true },
    ],
  },
  {
    title: "Categories",
    icon: TbCategoryPlus,
    items: [
      { label: "My Categories", path: "/categories/my", highlight: true },
      { label: "Opportunity Explorer", path: "/categories/explorer" },
    ],
  },
  {
    title: "Marketing",
    icon: LuMegaphone,
    items: [
      { label: "Promotions", path: "/marketing/promotions", highlight: true },
      { label: "Campaigns & Tools", path: "/marketing/campaigns" },
    ],
  },
  {
    title: "Shipping",
    icon: LuTruck,
    items: [
      { label: "Shipping Settings", path: "/shipping/settings", highlight: true },
      { label: "Shipments", path: "/shipping/shipments" },
    ],
  },
  {
    title: "Reviews & Ratings",
    icon: LuStar,
    items: [
      { label: "Product Reviews", path: "/reviews/products", highlight: true },
      { label: "Store Reviews", path: "/reviews/store" },
      { label: "Response Queue", path: "/reviews/respond" },
      { label: "Review Campaigns", path: "/reviews/requests" },
      { label: "Rating Analytics", path: "/reviews/insights" },
    ],
  },
];

function SideBar() {
  const { setIsOpenAddProductPanel } = useContext(MyContext);
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isOpenSubmenu = (index) => {
    setSubmenuIndex((prev) => (prev === index ? null : index));
  };

  const handleLogout = () => {
    localStorage.removeItem("stoken");
    navigate("/login");
    setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleItemAction = (item) => {
    if (item?.action?.type === "modal") {
      setIsOpenAddProductPanel({ open: true, model: item.action.model });
      closeSidebar();
      return;
    }
    if (item?.path) {
      navigate(item.path);
      closeSidebar();
    }
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Premium Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-[1050] top-5 left-4 p-2.5 bg-white text-gray-700 rounded-xl 
                   shadow-sm border border-gray-100 hover:bg-gray-50 hover:shadow-md
                   transition-all duration-200 ease-out group"
        aria-label="Open menu"
      >
        <HiOutlineMenuAlt2 className="text-xl group-hover:text-indigo-600 transition-colors" />
      </button>

      {/* Premium Overlay with blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-[1040] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Premium Sidebar */}
      <div
        className={`
          fixed top-0 left-0 w-[320px] h-screen bg-white z-[1051]
          shadow-2xl shadow-gray-900/10
          transform transition-transform duration-300 ease-out
          flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <LuGift className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">GiftNGifts</h2>
              <p className="text-xs text-gray-500">Seller Portal</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          {menuSections.map((section, index) => (
            <div key={section.title} className="mb-1">
              <button
                onClick={() => isOpenSubmenu(index)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 ease-out group
                  ${submenuIndex === index 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${submenuIndex === index 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'}
                `}>
                  <section.icon className="text-lg" />
                </div>
                <span className="flex-1 font-medium text-[15px]">{section.title}</span>
                <FiChevronDown 
                  className={`text-gray-400 transition-transform duration-200 ${
                    submenuIndex === index ? "rotate-180 text-indigo-500" : ""
                  }`} 
                />
              </button>

              <ReactCollapse isOpened={submenuIndex === index}>
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-0.5">
                  {section.items.map((item) => {
                    const isInteractive = item.path || item.action;
                    const isActive = item.path && isActivePath(item.path);
                    const ItemTag = isInteractive ? "button" : "div";

                    return (
                      <ItemTag
                        key={`${section.title}-${item.label}`}
                        onClick={() => isInteractive && handleItemAction(item)}
                        className={`
                          flex w-full items-center gap-3 py-2.5 px-3 rounded-lg text-sm
                          transition-all duration-150
                          ${isActive 
                            ? 'bg-indigo-50 text-indigo-700 font-medium' 
                            : isInteractive
                              ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              : 'text-gray-400 cursor-default'}
                        `}
                      >
                        <span className={`
                          w-1.5 h-1.5 rounded-full transition-colors
                          ${isActive ? 'bg-indigo-500' : 'bg-gray-300'}
                        `} />
                        <span className="flex-1 text-left">{item.label}</span>
                      </ItemTag>
                    );
                  })}
                </div>
              </ReactCollapse>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 
                       hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="p-2 bg-gray-100 group-hover:bg-red-100 rounded-lg transition-colors">
              <FiLogOut className="text-lg text-gray-500 group-hover:text-red-500" />
            </div>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SideBar;
