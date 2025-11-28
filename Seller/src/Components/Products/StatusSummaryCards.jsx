import React from "react";
import { formatINR } from "../../utils/orderMetrics";

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Math.round(value));

const SUMMARY_BLUEPRINT = [
  {
    key: "count",
    label: "Total Listings",
    formatter: (value) => formatNumber(value || 0),
  },
  {
    key: "totalValue",
    label: "Inventory Value",
    formatter: (value) => formatINR(value || 0),
  },
  {
    key: "avgPrice",
    label: "Avg. Price",
    formatter: (value) => formatINR(value || 0),
  },
  {
    key: "avgDiscount",
    label: "Avg. Discount",
    formatter: (value) => `${Math.round(value || 0)}%`,
  },
  {
    key: "lowStock",
    label: "Low Stock Items",
    formatter: (value) => formatNumber(value || 0),
  },
];

function StatusSummaryCards({ summary = {}, statusKey }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {SUMMARY_BLUEPRINT.map((item) => (
        <div
          key={item.key}
          className={`rounded-2xl border bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 ${
            statusKey === "active" && item.key === "lowStock"
              ? "border-yellow-200 bg-yellow-50"
              : "border-gray-100"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {item.formatter(summary[item.key] ?? 0)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatusSummaryCards;
