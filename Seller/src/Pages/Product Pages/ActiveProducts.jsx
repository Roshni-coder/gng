import React from "react";
import ProductStatusBoard from "../../Components/Products/ProductStatusBoard.jsx";
import { MdCheckCircle } from "react-icons/md";

function ActiveProducts() {
  return (
    <div className="w-full bg-white ">
     
      {/* PRODUCT STATUS MODULE */}
      <div className="rounded p-6 shadow-sm border border-gray-200 bg-white p-1">
        <ProductStatusBoard
          statusKey="active"
          title="Active Products"
          subtitle="Products currently published and available for sale."
          emptyMessage="No active listings right now."
        />
      </div>
    </div>
  );
}

export default ActiveProducts;
