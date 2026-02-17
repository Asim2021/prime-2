export interface DashboardStatsI {
  totalSales: number;
  totalSalesChange: number; // percentage vs yesterday
  stockValue: number;
  lowStockCount: number;
  expiryCount: number;
}

export interface SalesTrendI {
  date: string;
  amount: number;
}

export interface RecentActivityI {
  id: string;
  type: "SALE" | "PURCHASE";
  description: string;
  amount: number;
  timestamp: string;
}

export interface ExpiryAlertI {
  id: string; // batch_id
  medicine_name: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
}
