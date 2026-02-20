import { AxiosResponse } from "axios";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

export interface SalesReportResponseI {
  data: any[];
  stats: {
    total_revenue: number;
    total_orders: number;
  };
}

export interface InventoryReportResponseI {
  data: any[];
  total_value: number;
}

export const fetchSalesReport = async (
  params: any,
): Promise<SalesReportResponseI> => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/sales${paramsToQueryString(params)}`,
  );
  return res.data;
};

export const fetchInventoryReport = async (
  params: any,
): Promise<InventoryReportResponseI> => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/inventory${paramsToQueryString(params)}`,
  );
  return res.data;
};
