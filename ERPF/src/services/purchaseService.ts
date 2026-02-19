import { AxiosResponse } from "axios";
import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

export const fetchAllPurchases = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<PurchaseI[]>> => {
  const url = `${ENDPOINT.PURCHASE.BASE}` + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res.data;
};

export const fetchPurchaseById = async (id: string): Promise<PurchaseI> => {
  const res: AxiosResponse = await erpApi.get(
    `${ENDPOINT.PURCHASE.BASE}/${id}`,
  );
  return res?.data;
};

export const createPurchase = async (
  values: Partial<PurchaseI>,
): Promise<PurchaseI> => {
  const res: AxiosResponse = await erpApi.post(ENDPOINT.PURCHASE.BASE, values);
  return res?.data;
};
