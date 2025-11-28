import React, { useMemo, useState } from "react";
import { FiRefreshCw, FiDownload } from "react-icons/fi";
import { MdCategory } from "react-icons/md";

import SearchBox from "../SearchBox/SearchBox.jsx";
import StatusSummaryCards from "./StatusSummaryCards.jsx";
import ProductStatusTable from "./ProductStatusTable.jsx";

import { useSellerProducts } from "../../hooks/useSellerProducts.js";
import { useCatalogMeta } from "../../hooks/useCatalogMeta.js";
import { exportToExcel, PRODUCT_EXPORT_COLUMNS } from "../../utils/exportUtils.js";

import {
  filterProductsByStatus,
  searchProducts,
  sortProducts,
  summarizeProducts,
  STATUS_COPY,
} from "../../utils/productStatus.js";

const sortOptions = [
  { value: "recent", label: "Sort: Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "stock-low", label: "Stock: Low to High" },
  { value: "stock-high", label: "Stock: High to Low" },
];

function ProductStatusBoard({ statusKey, title, subtitle, emptyMessage }) {
  const { products, loading, error, refresh } = useSellerProducts();
  const { categories, getCategoryNameById, getSubCategoryNameById } = useCatalogMeta();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState("recent");

  // APPLY ALL FILTERING
  const filteredProducts = useMemo(() => {
    let list = filterProductsByStatus(products, statusKey);

    if (categoryFilter !== "all") {
      list = list.filter((p) => p.categoryname === categoryFilter);
    }

    list = searchProducts(list, searchTerm, {
      getCategoryNameById,
      getSubCategoryNameById,
    });

    list = sortProducts(list, sortKey);

    return list;
  }, [products, statusKey, categoryFilter, searchTerm, sortKey]);

  const summary = useMemo(() => summarizeProducts(filteredProducts), [filteredProducts]);
  const statusMeta = STATUS_COPY[statusKey];

  return (
    <div className="space-y-10">

      {/* PAGE HEADER */}
      <header className="flex items-center gap-4 border-b pb-6 border-gray-200">
        <div
          className="
            w-12 h-12 
            flex items-center justify-center
            rounded-xl 
            bg-gradient-to-br from-gray-100 to-gray-50 
            shadow-inner border
            text-2xl text-gray-600
          "
        >
          <MdCategory />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {subtitle || statusMeta?.hint}
          </p>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <StatusSummaryCards summary={summary} statusKey={statusKey} />

      {/* MAIN PANEL */}
      <section
        className="
          rounded-2xl 
          overflow-hidden 
          border border-gray-200 
          bg-white 
          shadow-[0_4px_18px_rgba(0,0,0,0.04)]
        "
      >
        {/* FILTER BAR */}
        <div
          className="
            p-5 
            flex flex-col gap-4
            md:flex-row md:items-center md:justify-between
            bg-gradient-to-br from-gray-50 to-white
            border-b border-gray-200
          "
        >
          {/* SEARCH */}
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by product, SKU, category..."
          />

          {/* FILTER GROUP */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="
                rounded-xl border border-gray-300 
                px-4 py-2.5 text-sm 
                bg-white shadow-sm 
                hover:border-gray-400 
                focus:ring-2 focus:ring-gray-200
                transition
              "
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryname}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="
                rounded-xl border border-gray-300
                px-4 py-2.5 text-sm 
                bg-white shadow-sm 
                hover:border-gray-400 
                focus:ring-2 focus:ring-gray-200
                transition
              "
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={refresh}
              className="
                inline-flex items-center gap-2 
                rounded-xl px-4 py-2.5 
                text-sm font-medium text-gray-700
                border border-gray-300 
                bg-gray-50 
                hover:bg-gray-100 
                shadow-sm 
                transition
              "
            >
              <FiRefreshCw className="text-base" />
              Refresh
            </button>

            {/* Export Button */}
            <button
              type="button"
              onClick={() => exportToExcel(filteredProducts, `products_${statusKey}`, PRODUCT_EXPORT_COLUMNS)}
              className="
                inline-flex items-center gap-2 
                rounded-xl px-4 py-2.5 
                text-sm font-medium text-white
                bg-indigo-600 
                hover:bg-indigo-700 
                shadow-sm 
                transition
              "
            >
              <FiDownload className="text-base" />
              Export
            </button>
          </div>
        </div>

        {/* TABLE + STATES */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading products…</div>
        ) : error ? (
          <div className="p-10 text-center text-rose-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-14 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          <ProductStatusTable
            products={filteredProducts}
            getCategoryNameById={getCategoryNameById}
            getSubCategoryNameById={getSubCategoryNameById}
          />
        )}
      </section>
    </div>
  );
}

export default ProductStatusBoard;
