import erpApi from "@lib/axiosInstance";
import type { SalesTrendI } from "../types/dashboard";

export const fetchDashboardStats = async (): Promise<any> => {
  const res = await erpApi.get("/reports/dashboard");
  return res; // Interceptor already returns response.data
};

export const fetchSalesTrend = async (): Promise<SalesTrendI[]> => {
  try {
    const res: any = await erpApi.get("/reports/dashboard");
    return res?.data?.salesTrend || [];
  } catch {
    return [];
  }
};

export const fetchLowStock = async (): Promise<any[]> => {
  // Low stock comes from the dashboard metrics or inventory report
  try {
    const res = await erpApi.get("/reports/inventory");
    // Filter for low stock items
    return (res?.data || []).filter(
      (item: any) => Number(item.current_stock) <= Number(item.reorder_level),
    );
  } catch {
    return [];
  }
};
