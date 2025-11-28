const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const createStatsShell = () => ({
  today: { count: 0, total: 0 },
  month: { count: 0, total: 0 },
  year: { count: 0, total: 0 },
  overall: { count: 0, total: 0 },
});

export const computeOrderStats = (orders = []) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return createStatsShell();
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return orders.reduce((acc, order) => {
    const placedAt = new Date(order.placedAt);

    if (Number.isNaN(placedAt.getTime())) {
      return acc;
    }

    const amount = toNumber(order.totalAmount);
    acc.overall.count += 1;
    acc.overall.total += amount;

    if (placedAt >= startOfDay) {
      acc.today.count += 1;
      acc.today.total += amount;
    }

    if (placedAt >= startOfMonth) {
      acc.month.count += 1;
      acc.month.total += amount;
    }

    if (placedAt >= startOfYear) {
      acc.year.count += 1;
      acc.year.total += amount;
    }

    return acc;
  }, createStatsShell());
};

export const filterOrdersByRange = (orders = [], range) => {
  if (!Array.isArray(orders) || !range || range === "overall") {
    return orders ?? [];
  }

  const now = new Date();
  let boundary;

  switch (range) {
    case "today":
      boundary = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "month":
      boundary = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      boundary = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return orders;
  }

  return orders.filter((order) => {
    const placedAt = new Date(order.placedAt);
    if (Number.isNaN(placedAt.getTime())) return false;
    return placedAt >= boundary;
  });
};

export const ORDER_STATUS_META = {
  pending: {
    title: "Pending",
    subtitle: "Orders awaiting confirmation.",
    statuses: ["Pending", "New"],
    emptyMessage: "No pending orders right now.",
  },
  processing: {
    title: "Processing",
    subtitle: "Orders being prepared for dispatch.",
    statuses: ["Processing"],
    emptyMessage: "All caught up on processing orders.",
  },
  shipped: {
    title: "Shipped",
    subtitle: "Packages handed over to the courier.",
    statuses: ["Shipped"],
    emptyMessage: "No shipments in transit currently.",
  },
  delivered: {
    title: "Delivered",
    subtitle: "Orders delivered successfully.",
    statuses: ["Delivered", "Completed"],
    emptyMessage: "No delivered orders for this period.",
  },
  cancelled: {
    title: "Cancelled",
    subtitle: "Track cancelled and returned orders.",
    statuses: ["Cancelled", "Returned", "Refunded"],
    emptyMessage: "No cancelled orders right now.",
  },
};

const normalizeStatus = (value = "") => value.toString().trim().toLowerCase();

export const filterOrdersByStatus = (orders = [], statusKey) => {
  if (!statusKey) return orders;
  const meta = ORDER_STATUS_META[statusKey];
  if (!meta) return orders;

  const allowedStatuses = (meta.statuses || []).map(normalizeStatus);
  if (!allowedStatuses.length) return orders;

  return orders.filter((order) =>
    allowedStatuses.includes(normalizeStatus(order.status))
  );
};

export const formatINR = (value) => {
  const amount = toNumber(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export const ORDER_RANGE_TITLES = {
  today: "Today's Orders",
  month: "This Month's Orders",
  year: "This Year's Orders",
  overall: "Overall Orders",
};

export const ORDER_RANGE_PATHS = {
  today: "/orders/today",
  month: "/orders/month",
  year: "/orders/year",
  overall: "/orders/overall",
};
