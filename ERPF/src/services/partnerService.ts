import { AxiosResponse } from "axios";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

// Vendors — Backend mounts at /vendors
export const fetchAllVendors = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<VendorI[]>> => {
  const url = "/vendors" + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<VendorI[]>;
};

export const addVendor = async (values: Partial<VendorI>): Promise<VendorI> => {
  const res: AxiosResponse = await erpApi.post("/vendors", values);
  return res?.data;
};

export const editVendor = async (
  id: string,
  values: Partial<VendorI>,
): Promise<VendorI> => {
  const res: AxiosResponse = await erpApi.put(`/vendors/${id}`, values);
  return res?.data;
};

export const deleteVendor = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(`/vendors/${id}`);
  return res?.data;
};

// Customers — Backend mounts at /customers
export const fetchAllCustomers = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<CustomerI[]>> => {
  const url = "/customers" + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<CustomerI[]>;
};

export const addCustomer = async (
  values: Partial<CustomerI>,
): Promise<CustomerI> => {
  const res: AxiosResponse = await erpApi.post("/customers", values);
  return res?.data;
};

export const editCustomer = async (
  id: string,
  values: Partial<CustomerI>,
): Promise<CustomerI> => {
  const res: AxiosResponse = await erpApi.put(`/customers/${id}`, values);
  return res?.data;
};

export const deleteCustomer = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(`/customers/${id}`);
  return res?.data;
};
