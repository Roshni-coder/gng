import React from "react";
import ProductStatusBoard from "../../Components/Products/ProductStatusBoard.jsx";

function OutOfStockProducts() {
  return (
    <div
      className="
        w-full 
        min-h-screen 
        p-4 md:p-6 
        bg-gradient-to-b from-gray-50 to-white
        animate-fadeIn
      "
    >
      <ProductStatusBoard
        statusKey="outOfStock"
        title="Out of Stock Products"
        subtitle="These items are currently unavailable. Add inventory to start selling again."
        emptyMessage="🎉 Great! All products are in stock."
      />
    </div>
  );
}

export default OutOfStockProducts;
