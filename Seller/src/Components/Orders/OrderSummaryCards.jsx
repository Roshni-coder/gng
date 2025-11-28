import React from "react";

const SUMMARY_CONFIG = [
  { key: "today", title: "Today's Orders", iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  { key: "month", title: "This Month", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { key: "year", title: "This Year", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { key: "overall", title: "All Time", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
];

function OrderSummaryCards({ stats, formatAmount, focusedRange, onSelectRange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {SUMMARY_CONFIG.map(({ key, title, iconBg, iconColor }) => {
        const data = stats?.[key] || { count: 0, total: 0 };
        const isActive = focusedRange === key;
        const Tag = onSelectRange ? "button" : "div";

        return (
          <Tag
            key={key}
            type={onSelectRange ? "button" : undefined}
            onClick={onSelectRange ? () => onSelectRange(key) : undefined}
            className={`
              relative rounded-xl p-6 text-left
              bg-white border transition-all duration-200
              focus:outline-none
              ${isActive
                ? "border-indigo-200 shadow-md ring-1 ring-indigo-100"
                : "border-gray-200 shadow-soft hover:shadow-card-hover hover:border-gray-300"
              }
            `}
          >
            {/* Title */}
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              {title}
            </p>

            {/* Order Count */}
            <p className="text-3xl font-bold text-gray-900">
              {data.count}
            </p>
            <p className="text-xs text-gray-400 mt-1">orders</p>

            {/* Revenue */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatAmount ? formatAmount(data.total) : data.total}
                </span>
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-b-xl"></div>
            )}
          </Tag>
        );
      })}
    </div>
  );
}

export default OrderSummaryCards;
