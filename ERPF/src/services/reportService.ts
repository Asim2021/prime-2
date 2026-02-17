import { AxiosResponse } from "axios";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

export const fetchSalesReport = async (params: any) => {
  // Reusing sales endpoint for now, or dedicated /reports/sales if available.
  // Plan mentions /reports/sales
  // let's use /reports/sales if we can, or fallback to /sales with filters
  // sticking to plan: GET /reports/sales
  // But endpoint constant might need update
  const res: AxiosResponse = await erpApi.get(
    `/reports/sales${paramsToQueryString(params)}`,
  );
  return res?.data;
};

export const fetchInventoryReport = async (params: any) => {
  const res: AxiosResponse = await erpApi.get(
    `/reports/inventory${paramsToQueryString(params)}`,
  );
  return res?.data;
};
