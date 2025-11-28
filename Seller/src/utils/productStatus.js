const parseNumber = (value) => {
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : 0;
};

export const computeInventoryCount = (product = {}) => {
  const candidates = [
    product.inventoryCount,
    product.stock,
    product.quantity,
    product.availableQuantity,
    product.inventory?.available,
    product.inventory?.availableUnits,
  ];

  const firstDefined = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  return parseNumber(firstDefined);
};

export const deriveProductStatus = (product = {}) => {
  const inventoryCount = computeInventoryCount(product);
  if (inventoryCount <= 0) {
    return "outOfStock";
  }

  return product?.approved ? "active" : "draft";
};

export const normalizeProductRecord = (product = {}) => {
  const inventoryCount = computeInventoryCount(product);
  return {
    ...product,
    inventoryCount,
    status: deriveProductStatus({ ...product, inventoryCount }),
  };
};

export const filterProductsByStatus = (products = [], statusKey) => {
  if (!statusKey) return products;
  return products.filter((product) => product.status === statusKey);
};

const normalizeText = (value) => (value || "").toString().toLowerCase();

export const searchProducts = (products = [], term = "", helpers = {}) => {
  if (!term) return products;
  const normalized = normalizeText(term);

  return products.filter((product) => {
    const categoryName = helpers.getCategoryNameById
      ? helpers.getCategoryNameById(product.categoryname)
      : product.categoryname;
    const subcategoryName = helpers.getSubCategoryNameById
      ? helpers.getSubCategoryNameById(product.subcategory)
      : product.subcategory;

    return [
      product.title,
      product.sku,
      categoryName,
      subcategoryName,
      product.sellerId?.name,
    ]
      .filter(Boolean)
      .map(normalizeText)
      .some((text) => text.includes(normalized));
  });
};

export const sortProducts = (products = [], sortKey) => {
  const arr = [...products];

  switch (sortKey) {
    case "price-high":
      return arr.sort((a, b) => parseNumber(b.price) - parseNumber(a.price));
    case "price-low":
      return arr.sort((a, b) => parseNumber(a.price) - parseNumber(b.price));
    case "stock-low":
      return arr.sort((a, b) => parseNumber(a.inventoryCount) - parseNumber(b.inventoryCount));
    case "stock-high":
      return arr.sort((a, b) => parseNumber(b.inventoryCount) - parseNumber(a.inventoryCount));
    default:
      return arr;
  }
};

export const summarizeProducts = (products = []) => {
  const count = products.length;
  const totalValue = products.reduce((sum, product) => sum + parseNumber(product.price), 0);
  const totalDiscount = products.reduce((sum, product) => sum + parseNumber(product.discount), 0);
  const lowStock = products.filter((product) => product.inventoryCount <= 10).length;

  return {
    count,
    totalValue,
    avgPrice: count ? totalValue / count : 0,
    avgDiscount: count ? totalDiscount / count : 0,
    lowStock,
  };
};

export const STATUS_COPY = {
  active: {
    badge: "Live",
    hint: "These listings are live on the marketplace.",
  },
  draft: {
    badge: "Draft",
    hint: "Finalize details and submit for approval.",
  },
  outOfStock: {
    badge: "Restock",
    hint: "Update inventory to start selling again.",
  },
};
