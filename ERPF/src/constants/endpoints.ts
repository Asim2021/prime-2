export const ENDPOINT = {
  ALL: "*",
  AUTH: {
    FORGET_PASS: "/auth/forget-password",
    GET_ME: "/auth/getme",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    REGISTER: "/auth/register",
    VALIDATE_OTP: "/auth/validate-otp",
    FORGET_PASSWORD: "/auth/forget-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY: "/auth/verify",
  },
  BASE: "/",
  ITEMS: "/medicines",
  // BATCHES: "/batches", // Not implemented on backend yet
  // BATCHES: "/batches",
  PURCHASE: {
    BASE: "/purchases",
    CREATE: "/purchases/create",
    DETAILS: "/purchases/details", // placeholder
    HISTORY: "/purchases/history", // placeholder
  },
  PARTNERS: "/partners",
  PARTNER_VENDORS: "/vendors",
  PARTNER_CUSTOMERS: "/customers",
  INVENTORY_ITEMS: "/medicines",
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
  },
  VENDOR_MASTER: "/vendor-master",
  // Sales Routes
  SALES: {
    BASE: "/sales",
    POS: "/sales/pos",
    ORDERS: "/sales", // History
  },
  SALES_RETURNS: "/sales/returns",
  SETTINGS: "/settings",
  ROLES: "/roles",
  SHOP: "/shop-settings",
  AUDIT_LOGS: "/audit-logs",
  // Inventory Routes
  INVENTORY_STOCK: "/inventory/stock",
  INVENTORY_ADJUST: "/inventory/adjust",
  INVENTORY_TRANSFER: "/inventory/transfer",
  IMPORT: "/import",
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    SALES_TREND: "/dashboard/sales-trend",
    PENDING_APPROVALS: "/dashboard/pending-approvals",
    LOW_STOCK: "/dashboard/low-stock",
  },
  REPORTS: "/reports",
};
