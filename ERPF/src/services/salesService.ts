import erpApi from "@lib/axiosInstance";
import { ENDPOINT } from "../constants/endpoints";
import { SaleI } from "../types/sales";
import { paramsToQueryString } from "@utils/helpers";
import { AxiosResponse } from "axios";

export interface CreateSalePayload {
  customer_id?: string | null;
  customer_name?: string;
  customer_phone?: string;
  payment_mode: string;
  items: {
    batch_id: string;
    quantity: number;
    selling_price: number;
    mrp_at_sale: number;
  }[];
  total_amount: number;
  taxable_amount: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
}

export const createSale = async (payload: CreateSalePayload) => {
  const response = await erpApi.post(ENDPOINT.SALES.BASE, payload);
  return response;
};

export const fetchAllSales = async (
  params?: any,
): Promise<PaginationResponseI<SaleI[]>> => {
  const url = ENDPOINT.SALES.BASE + paramsToQueryString(params);
  const response: AxiosResponse = await erpApi.get(url);
  return response.data;
};

export const fetchSaleById = async (id: string) => {
  const response = await erpApi.get(`${ENDPOINT.SALES.BASE}/${id}`);
  return response.data;
};

export const createSalesReturn = async (payload: any) => {
  const response = await erpApi.post(`${ENDPOINT.SALES.BASE}/return`, payload);
  return response.data;
};

export const fetchAllSalesReturns = async (
  params?: any,
): Promise<PaginationResponseI<any[]>> => {
  const url = ENDPOINT.SALES_RETURNS + paramsToQueryString(params);
  const response: AxiosResponse = await erpApi.get(url);
  return response.data;
};
