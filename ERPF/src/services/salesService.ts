import erpApi from "@lib/axiosInstance";
import { ENDPOINT } from "../constants/endpoints";
import { SaleI } from "../types/sales";

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
  item_count: number;
}

export const createSale = async (payload: CreateSalePayload) => {
  const response = await erpApi.post(ENDPOINT.SALES.BASE, payload);
  return response.data;
};

export const fetchAllSales = async (params?: any) => {
  const response = await erpApi.get(ENDPOINT.SALES.BASE, { params });
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
