import React from "react";
import { formatINR } from "../../utils/orderMetrics";
import { STATUS_COPY } from "../../utils/productStatus";

const badgeColors = {
  active: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  outOfStock: "bg-rose-100 text-rose-700",
};

function ProductStatusTable({ products, getCategoryNameById, getSubCategoryNameById }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-[1050px] w-full text-sm text-gray-700">

        {/* HEADER */}
        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Product</th>
            <th className="px-6 py-4 text-left font-semibold">Category</th>
            <th className="px-6 py-4 text-center font-semibold">Price</th>
            <th className="px-6 py-4 text-center font-semibold">Discount</th>
            <th className="px-6 py-4 text-center font-semibold">Inventory</th>
            <th className="px-6 py-4 text-center font-semibold">Status</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr
              key={p._id}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              {/* PRODUCT */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  
                  {/* IMAGE */}
                  <div className="w-14 h-14 rounded-lg bg-gray-100 border overflow-hidden shadow-sm flex-shrink-0">
                    {p.images?.[0]?.url ? (
                      <img
                        src={p.images[0].url}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* TITLE */}
                  <div>
                    <p className="font-semibold text-gray-900 leading-tight max-w-[180px] line-clamp-1">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {p.sku || p._id}</p>
                  </div>
                </div>
              </td>

              {/* CATEGORY */}
              <td className="px-6 py-4">
                <p className="font-medium text-gray-800">
                  {getCategoryNameById(p.categoryname)}
                </p>
                <p className="text-xs text-gray-500">
                  {getSubCategoryNameById(p.subcategory)}
                </p>
              </td>

              {/* PRICE */}
              <td className="px-6 py-4 text-center font-semibold text-gray-900">
                {formatINR(p.price)}
              </td>

              {/* DISCOUNT */}
              <td className="px-6 py-4 text-center text-gray-700">
                {Math.round(p.discount || 0)}%
              </td>

              {/* INVENTORY */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.inventoryCount > 10
                      ? "bg-green-50 text-green-700"
                      : p.inventoryCount > 0
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {p.inventoryCount || 0} units
                </span>
              </td>

              {/* STATUS */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`
                    inline-flex items-center justify-center
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${badgeColors[p.status] || "bg-gray-100 text-gray-500"}
                  `}
                >
                  {STATUS_COPY[p.status]?.badge || p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ProductStatusTable;
