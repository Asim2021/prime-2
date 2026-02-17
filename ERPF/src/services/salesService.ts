import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";

export const fetchAllSales = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
}) => {
  const { data } = await erpApi.get(ENDPOINT.SALES_ORDERS, { params });
  return data;
};

export const fetchSaleById = async (id: string) => {
  const { data } = await erpApi.get(`${ENDPOINT.SALES_ORDERS}/${id}`);
  return data;
};

export interface CreateSalePayload {
  customer_name: string;
  customer_phone?: string;
  customer_id?: string;
  payment_mode: "cash" | "upi" | "credit";
  total_amount: number;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  is_credit: boolean;
  items: {
    batch_id: string;
    quantity: number;
    selling_price: number;
    mrp_at_sale: number;
  }[];
}

export const createSale = async (payload: CreateSalePayload) => {
  const { data } = await erpApi.post(ENDPOINT.SALES_ORDERS, payload);
  return data;
};

export const createSalesReturn = async (payload: any) => {
  const { data } = await erpApi.post(ENDPOINT.SALES_RETURNS, payload);
  return data;
};
