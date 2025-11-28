/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Array of { key, header } objects defining columns
 */
export const exportToCSV = (data, filename, columns) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create header row
  const headers = columns.map(col => col.header).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = col.getValue ? col.getValue(item) : item[col.key];
      
      // Handle null/undefined
      if (value === null || value === undefined) value = '';
      
      // Convert to string and escape quotes
      value = String(value).replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quotes
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      
      return value;
    }).join(',');
  });

  // Combine headers and rows
  const csv = [headers, ...rows].join('\n');
  
  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to Excel format (.xlsx)
 */
export const exportToExcel = (data, filename, columns) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create header row
  const headers = columns.map(col => col.header).join('\t');
  
  // Create data rows (tab-separated for Excel)
  const rows = data.map(item => {
    return columns.map(col => {
      let value = col.getValue ? col.getValue(item) : item[col.key];
      
      // Handle null/undefined
      if (value === null || value === undefined) value = '';
      
      // Convert to string
      value = String(value);
      
      return value;
    }).join('\t');
  });

  // Combine headers and rows
  const content = [headers, ...rows].join('\n');
  
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Order export columns configuration
export const ORDER_EXPORT_COLUMNS = [
  { key: 'orderId', header: 'Order ID', getValue: (o) => o._id },
  { key: 'customer', header: 'Customer Name', getValue: (o) => o.shippingAddress?.name || '' },
  { key: 'email', header: 'Email', getValue: (o) => o.user?.email || '' },
  { key: 'phone', header: 'Phone', getValue: (o) => o.shippingAddress?.phone || '' },
  { key: 'address', header: 'Address', getValue: (o) => o.shippingAddress?.address || '' },
  { key: 'city', header: 'City', getValue: (o) => o.shippingAddress?.city || '' },
  { key: 'pincode', header: 'Pincode', getValue: (o) => o.shippingAddress?.pin || '' },
  { key: 'totalAmount', header: 'Total Amount', getValue: (o) => o.totalAmount || 0 },
  { key: 'status', header: 'Status', getValue: (o) => o.status || 'Pending' },
  { key: 'paymentId', header: 'Payment ID', getValue: (o) => o.paymentId || '' },
  { key: 'placedAt', header: 'Order Date', getValue: (o) => o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-IN') : '' },
  { key: 'items', header: 'Items Count', getValue: (o) => o.items?.length || 0 },
];

// Dashboard stats export columns
export const DASHBOARD_STATS_COLUMNS = [
  { key: 'period', header: 'Period' },
  { key: 'orders', header: 'Total Orders' },
  { key: 'revenue', header: 'Revenue' },
];

// Recent orders export columns (simplified)
export const RECENT_ORDERS_COLUMNS = [
  { key: 'orderId', header: 'Order ID', getValue: (o) => o._id?.slice(-8).toUpperCase() },
  { key: 'customer', header: 'Customer', getValue: (o) => o.shippingAddress?.name || '' },
  { key: 'amount', header: 'Amount', getValue: (o) => o.totalAmount || 0 },
  { key: 'status', header: 'Status', getValue: (o) => o.status || 'Pending' },
  { key: 'date', header: 'Date', getValue: (o) => o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-IN') : '' },
];

// Transaction export columns
export const TRANSACTION_EXPORT_COLUMNS = [
  { key: 'date', header: 'Date', getValue: (t) => t.date ? new Date(t.date).toLocaleDateString('en-IN') : '' },
  { key: 'description', header: 'Description', getValue: (t) => t.description || t.customer || '' },
  { key: 'orderId', header: 'Order ID', getValue: (t) => t.orderId || '' },
  { key: 'type', header: 'Type', getValue: (t) => t.type || '' },
  { key: 'amount', header: 'Amount', getValue: (t) => t.amount || 0 },
];

// Settlement export columns
export const SETTLEMENT_EXPORT_COLUMNS = [
  { key: 'settlementId', header: 'Settlement ID', getValue: (s) => s.settlementId || '' },
  { key: 'periodStart', header: 'Period Start', getValue: (s) => s.periodStart ? new Date(s.periodStart).toLocaleDateString('en-IN') : '' },
  { key: 'periodEnd', header: 'Period End', getValue: (s) => s.periodEnd ? new Date(s.periodEnd).toLocaleDateString('en-IN') : '' },
  { key: 'orderCount', header: 'Orders', getValue: (s) => s.orderCount || 0 },
  { key: 'grossAmount', header: 'Gross Amount', getValue: (s) => s.grossAmount || 0 },
  { key: 'deductions', header: 'Deductions', getValue: (s) => s.deductions || 0 },
  { key: 'netAmount', header: 'Net Amount', getValue: (s) => s.netAmount || 0 },
  { key: 'status', header: 'Status', getValue: (s) => s.status || '' },
  { key: 'settlementDate', header: 'Date', getValue: (s) => s.settlementDate ? new Date(s.settlementDate).toLocaleDateString('en-IN') : '' },
];

// Customer export columns
export const CUSTOMER_EXPORT_COLUMNS = [
  { key: 'name', header: 'Customer Name', getValue: (c) => c.name || '' },
  { key: 'email', header: 'Email', getValue: (c) => c.email || '' },
  { key: 'phone', header: 'Phone', getValue: (c) => c.phone || '' },
  { key: 'totalOrders', header: 'Total Orders', getValue: (c) => c.totalOrders || 0 },
  { key: 'totalSpent', header: 'Total Spent', getValue: (c) => c.totalSpent || 0 },
  { key: 'lastOrderDate', header: 'Last Order', getValue: (c) => c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('en-IN') : '' },
];

// Earnings export columns
export const EARNINGS_EXPORT_COLUMNS = [
  { key: 'type', header: 'Type', getValue: (e) => e.type || '' },
  { key: 'description', header: 'Description', getValue: (e) => e.description || '' },
  { key: 'orderId', header: 'Order ID', getValue: (e) => e.orderId || '' },
  { key: 'amount', header: 'Amount', getValue: (e) => e.amount || 0 },
  { key: 'date', header: 'Date', getValue: (e) => e.date ? new Date(e.date).toLocaleDateString('en-IN') : '' },
];

// Payout export columns
export const PAYOUT_EXPORT_COLUMNS = [
  { key: 'requestedAt', header: 'Request Date', getValue: (p) => p.requestedAt ? new Date(p.requestedAt).toLocaleDateString('en-IN') : '' },
  { key: 'amount', header: 'Amount', getValue: (p) => p.amount || 0 },
  { key: 'paymentMethod', header: 'Payment Method', getValue: (p) => p.paymentMethod || '' },
  { key: 'status', header: 'Status', getValue: (p) => p.status || '' },
  { key: 'processedAt', header: 'Processed Date', getValue: (p) => p.processedAt ? new Date(p.processedAt).toLocaleDateString('en-IN') : '' },
];

// Shipment export columns
export const SHIPMENT_EXPORT_COLUMNS = [
  { key: 'orderId', header: 'Order ID', getValue: (s) => s.orderId || '' },
  { key: 'customer', header: 'Customer', getValue: (s) => s.customer || '' },
  { key: 'destination', header: 'Destination', getValue: (s) => s.destination || '' },
  { key: 'carrier', header: 'Carrier', getValue: (s) => s.carrier || '' },
  { key: 'trackingNumber', header: 'Tracking Number', getValue: (s) => s.trackingNumber || '' },
  { key: 'status', header: 'Status', getValue: (s) => s.status || '' },
  { key: 'shippedDate', header: 'Shipped Date', getValue: (s) => s.shippedDate ? new Date(s.shippedDate).toLocaleDateString('en-IN') : '' },
  { key: 'expectedDelivery', header: 'Expected Delivery', getValue: (s) => s.expectedDelivery ? new Date(s.expectedDelivery).toLocaleDateString('en-IN') : '' },
];

// Review export columns  
export const REVIEW_EXPORT_COLUMNS = [
  { key: 'customerName', header: 'Customer', getValue: (r) => r.customerName || r.userName || '' },
  { key: 'productName', header: 'Product', getValue: (r) => r.productName || '' },
  { key: 'rating', header: 'Rating', getValue: (r) => r.rating || 0 },
  { key: 'comment', header: 'Comment', getValue: (r) => r.comment || '' },
  { key: 'response', header: 'Your Response', getValue: (r) => r.response || r.sellerResponse || '' },
  { key: 'createdAt', header: 'Date', getValue: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '' },
];

// Product export columns
export const PRODUCT_EXPORT_COLUMNS = [
  { key: 'title', header: 'Product Name', getValue: (p) => p.title || p.name || '' },
  { key: 'category', header: 'Category', getValue: (p) => p.category || p.categoryname || '' },
  { key: 'price', header: 'Price', getValue: (p) => p.price || 0 },
  { key: 'oldprice', header: 'Original Price', getValue: (p) => p.oldprice || 0 },
  { key: 'discount', header: 'Discount %', getValue: (p) => p.discount || 0 },
  { key: 'stock', header: 'Stock', getValue: (p) => p.stock || 0 },
  { key: 'availability', header: 'Availability', getValue: (p) => p.availability || '' },
  { key: 'approved', header: 'Approved', getValue: (p) => p.approved ? 'Yes' : 'No' },
];

// Category performance export columns
export const CATEGORY_EXPORT_COLUMNS = [
  { key: 'name', header: 'Category Name', getValue: (c) => c.name || '' },
  { key: 'products', header: 'Products Count', getValue: (c) => c.products || c.productCount || 0 },
  { key: 'orders', header: 'Orders', getValue: (c) => c.orders || c.orderCount || 0 },
  { key: 'revenue', header: 'Revenue', getValue: (c) => c.revenue || 0 },
  { key: 'growth', header: 'Growth %', getValue: (c) => c.growth || 0 },
  { key: 'avgRating', header: 'Avg Rating', getValue: (c) => c.avgRating || 0 },
];
