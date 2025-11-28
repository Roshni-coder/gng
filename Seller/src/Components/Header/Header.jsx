import React, { useContext, useState } from "react";
import { FiUser, FiLogOut, FiBell, FiSearch } from "react-icons/fi";
import { LuGift } from "react-icons/lu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Admincontext } from "../context/admincontext";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { atoken, setatoken } = useContext(Admincontext);
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "";
  const nickName = localStorage.getItem("nick name") || "";
  const displayName = nickName || name;

  const handleClick = (event) => {
    if (atoken) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("atoken");
    localStorage.removeItem("name");
    localStorage.removeItem("nick name");
    setatoken("");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-[1600px] py-3 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Centered with space for sidebar toggle */}
          <div className="flex items-center justify-center flex-1 pl-12">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 
                            rounded-xl flex items-center justify-center
                            group-hover:shadow-lg group-hover:shadow-indigo-500/25 
                            transition-all duration-300">
                <LuGift className="text-white text-lg" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  GiftNGifts
                </h1>
                <p className="text-[10px] text-gray-400 font-medium -mt-0.5 tracking-wide">
                  SELLER PORTAL
                </p>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                             rounded-xl transition-all duration-200 hidden sm:flex">
              <FiSearch className="text-lg" />
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 
                             hover:bg-gray-100 rounded-xl transition-all duration-200">
              <FiBell className="text-lg" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full 
                             ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            {atoken && (
              <button
                onClick={handleClick}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full 
                         bg-gray-50 hover:bg-gray-100 border border-gray-100
                         transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 
                              text-white font-semibold rounded-full 
                              flex items-center justify-center text-sm
                              group-hover:shadow-md transition-shadow">
                  {displayName[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {displayName}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.08))",
              mt: 1.5,
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              minWidth: "220px",
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 20,
                width: 12,
                height: 12,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                borderTop: "1px solid rgba(0,0,0,0.05)",
                borderLeft: "1px solid rgba(0,0,0,0.05)",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 
                          text-white rounded-full flex items-center justify-center 
                          text-lg font-semibold">
              {displayName[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">Seller Account</p>
            </div>
          </div>
        </div>

        <Divider className="!my-2" />
        
        <Link to="/seller-profile">
          <MenuItem className="!mx-2 !rounded-lg !py-2.5 hover:!bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiUser className="text-gray-600 text-sm" />
              </div>
              <span className="text-sm font-medium text-gray-700">My Profile</span>
            </div>
          </MenuItem>
        </Link>

        <MenuItem
          onClick={handleLogout}
          className="!mx-2 !rounded-lg !py-2.5 hover:!bg-red-50 !mb-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <FiLogOut className="text-red-500 text-sm" />
            </div>
            <span className="text-sm font-medium text-red-600">Sign Out</span>
          </div>
        </MenuItem>
      </Menu>
    </header>
  );
}

export default Header;