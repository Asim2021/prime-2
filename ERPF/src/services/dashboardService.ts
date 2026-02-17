import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";
import type { DashboardStatsI, SalesTrendI } from "../types/dashboard";

export const fetchDashboardStats = async (): Promise<DashboardStatsI> => {
  const { data } = await erpApi.get(ENDPOINT.DASHBOARD.SUMMARY);
  return data;
};

export const fetchSalesTrend = async (): Promise<SalesTrendI[]> => {
  const { data } = await erpApi.get(ENDPOINT.DASHBOARD.SALES_TREND);
  return data;
};

export const fetchLowStock = async (): Promise<any[]> => {
  const { data } = await erpApi.get(ENDPOINT.DASHBOARD.LOW_STOCK);
  return data;
};

export const fetchPendingApprovals = async (): Promise<any[]> => {
  const { data } = await erpApi.get(ENDPOINT.DASHBOARD.PENDING_APPROVALS);
  return data;
};

// Mocking some data for now if backend endpoints aren't ready,
// but sticking to real calls as primary.
