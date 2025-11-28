import React from "react";
import ProductStatusBoard from "../../Components/Products/ProductStatusBoard.jsx";

function DraftProducts() {
  return (
    <div
      className="
        w-full 
        min-h-screen 
        p-4 md:p-6 
        animate-fadeIn 
        bg-gradient-to-b from-gray-50 to-white
      "
    >
      <ProductStatusBoard
        statusKey="draft"
        title="Draft Products"
        subtitle="Save & refine your listings. Publish when you're ready."
        emptyMessage="No draft items found."
      />
    </div>
  );
}

export default DraftProducts;
