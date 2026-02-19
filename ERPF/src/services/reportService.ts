import { AxiosResponse } from "axios";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

export const fetchSalesReport = async (params: any) => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/sales${paramsToQueryString(params)}`,
  );
  return res; // Interceptor already returns response.data
};

export const fetchInventoryReport = async (params: any) => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/inventory${paramsToQueryString(params)}`,
  );
  return res?.data;
};
