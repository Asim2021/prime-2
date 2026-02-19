import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";
import { AxiosResponse } from "axios";

export const fetchSalesReport = async (
  params: any,
): Promise<PaginationResponseI<any[]>> => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/sales${paramsToQueryString(params)}`,
  );
  return res as any;
};

export const fetchInventoryReport = async (
  params: any,
): Promise<PaginationResponseI<any[]>> => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/inventory${paramsToQueryString(params)}`,
  );
  return res as any;
};
