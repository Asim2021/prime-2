import erpApi from "@lib/axiosInstance";
import type { DashboardStatsI, SalesTrendI } from "../types/dashboard";

export const fetchDashboardStats = async (): Promise<DashboardStatsI> => {
  const { data } = await erpApi.get("/reports/dashboard");
  return data;
};

export const fetchSalesTrend = async (): Promise<SalesTrendI[]> => {
  // Sales trend not yet a separate endpoint — use dashboard data or mock
  try {
    const { data } = await erpApi.get("/reports/dashboard");
    return data?.salesTrend || [];
  } catch {
    return [];
  }
};

export const fetchLowStock = async (): Promise<any[]> => {
  // Low stock comes from the dashboard metrics or inventory report
  try {
    const { data } = await erpApi.get("/reports/inventory");
    // Filter for low stock items
    return (data?.data || []).filter(
      (item: any) => item.status === "LOW" || item.current_stock < 10,
    );
  } catch {
    return [];
  }
};
