import { AxiosResponse } from "axios";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";
import { ENDPOINT } from "@constants/endpoints";

export interface SalesReportResponseI {
  data: any[];
  stats: {
    total_revenue: number;
    total_orders: number;
  };
}

export interface InventoryReportResponseI<T> {
  data: T[];
  total_value: number;
}

export interface InventoryReportI {
  id: string;
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  reorder_level: number;
  current_stock: string;
  stock_value: string;
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
  params: QueryParamsI,
): Promise<PaginationResponseI<InventoryReportI[]>> => {
  const url = ENDPOINT.REPORTS + "/inventory" + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res.data;
};
