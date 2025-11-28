import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import React, { useContext, useState, useRef, useEffect } from "react";

import { MdOutlineShoppingCart } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { BsBox } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AppContext } from "../../../context/Appcontext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function Navigation() {
  const navigate = useNavigate();
  const { userData, logout, cartItems, wishlistItems } = useContext(AppContext);

  // Only user menu toggle state and ref needed
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  return (
    <nav className="navigation py-1 md:!py-4 ">
      <div className="container lg:gap-4  grid lg:grid-cols-12 !pl-4 m-auto">
       <div className="col1 lg:col-span-2">
  <Link to="/">
    <h1
      className="text-[#7d0492] text-center lg:text-right text-[26px] font-[600] sm:!text-[30px]"
      style={{ fontStyle: "italic" }}
    >
      GiftNGifts
    </h1>
  </Link>
</div>


        <div className="col2 lg:col-span-7 p-1">
          <Search />
        </div>

        <div className="col3 lg:col-span-3 pt-1 ">
            <ul className="flex items-center justify-center lg:justify-start xl:gap-3 gap-2 w-full">
            {/* USER LOGGED IN MENU */}
            {userData ? (
  <li ref={userMenuRef} className="relative">
    <div
      className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer select-none sm:w-9 sm:h-9"
      onClick={() => setUserMenuOpen(!userMenuOpen)}
    >
      {userData.name[0].toUpperCase()}
    </div>

    {userMenuOpen && (
      <div
        className="absolute top-full mt-2 z-20 bg-white rounded shadow-lg w-44 max-w-[90vw] text-sm text-black overflow-hidden sm:right-0 left-0"
      >
        <ul className="list-none m-0 p-2">
          <Link to="/myProfile" onClick={() => setUserMenuOpen(false)}>
            <li className="py-2 px-2 flex gap-2 items-center hover:bg-gray-100 cursor-pointer text-sm">
              <FaRegUserCircle className="text-[#7d0492] text-[15px]" />
              My Account
            </li>
          </Link>
          <Link to="/wishlist" onClick={() => setUserMenuOpen(false)}>
            <li className="py-2 px-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer text-sm">
              <FaRegHeart className="text-[#7d0492] text-[15px]" />
              Wishlist
            </li>
          </Link>
          <Link to="/orders" onClick={() => setUserMenuOpen(false)}>
            <li className="py-2 px-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer text-sm">
              <BsBox className="text-[#7d0492] text-[14px]" />
              Orders
            </li>
          </Link>
          <li
            onClick={() => {
              logout();
              setUserMenuOpen(false);
            }}
            className="py-2 px-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer text-sm"
          >
            <RiLogoutCircleLine className="text-[#7d0492] text-[15px]" />
            Logout
          </li>
        </ul>
      </div>
    )}
  </li>
) : (
  <li className="sm:ml-2 ">
    <Button
      onClick={() => navigate("/login")}
      className="flex px-3 py-2 text-sm text-gray-800 gap-2 items-center sm:text-base"
    >
      <FaRegUserCircle className="text-[20px] sm:text-[24px] hover:text-black" />
      Login
    </Button>
  </li>
)}


            {/* Wishlist Icon */}
            <li>
              <Tooltip title="Wishlist">
                <Link to="/wishlist">
                  <IconButton aria-label="like">
                    <StyledBadge
                      badgeContent={wishlistItems.length}
                      color="secondary"
                    >
                      <FiHeart className="md:text-[25px] text-[20px]" />
                    </StyledBadge>
                  </IconButton>
                </Link>
              </Tooltip>
            </li>

            {/* Cart Icon */}
            <li>
              <Tooltip title="Cart">
                <Link to="/cartlist">
                  <IconButton aria-label="cart">
                    <StyledBadge
                      badgeContent={cartItems.length}
                      color="secondary"
                    >
                      <MdOutlineShoppingCart className="md:text-[25px] text-[20px]" />
                    </StyledBadge>
                  </IconButton>
                </Link>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
