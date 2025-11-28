import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import './TopStrip.css'; // optional if you need it for additional overrides

function TopStrip() {
  const [showMenu, setShowmenu] = useState(false);
  const handleMenu = () => {
    setShowmenu(!showMenu);
  };

  return (
    <div className='top-strip sm:py-3 py-1 border-t border-b border-gray-300 bg-[#7d0492] text-white'>
      <div className="container mx-auto flex justify-between items-center px-4">
        
        {/* Left - Message */}
        <div className="text-[12px] sm:text-[12px] md:text-[13px] font-medium max-w-[70%]">
          Get up to 50% off now season styles, limited time only ...
        </div>

        {/* Right - Menu (Desktop) */}
        <ul className="hidden sm:flex gap-5 text-[11px] sm:text-[12px] md:text-[13px] font-medium">
          <li>
            <Link to="/help-center" className="hover:underline">Help Center</Link>
          </li>
          <li>
            <Link to="/order-tracking" className="hover:underline">Order Tracking</Link>
          </li>
          <li>
            <Link to="/contact-us" className="hover:underline">Contact Us</Link>
          </li>
        </ul>

        {/* Hamburger Icon (Mobile) */}
        <div className="sm:hidden flex items-center justify-end w-fit ml-2">
          <button onClick={handleMenu}>
            <MdOutlineMenu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="sm:hidden bg-[#7d0492] px-4 pt-2 pb-3">
          <ul className="flex justify-between gap-2 text-[12px] font-medium">
            <li className="flex-1 text-center">
              <Link to="/help-center" onClick={handleMenu} className="block w-full">
                Help Center
              </Link>
            </li>
            <li className="flex-1 text-center">
              <Link to="/order-tracking" onClick={handleMenu} className="block w-full">
                Order Tracking
              </Link>
            </li>
            <li className="flex-1 text-center">
              <Link to="/contact-us" onClick={handleMenu} className="block w-full">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default TopStrip;
