import { AxiosResponse } from "axios";
import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

// Vendors
export const fetchAllVendors = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<VendorI[]>> => {
  const url = `${ENDPOINT.VENDOR_MASTER}` + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<VendorI[]>;
};

export const addVendor = async (values: Partial<VendorI>): Promise<VendorI> => {
  const res: AxiosResponse = await erpApi.post(ENDPOINT.VENDOR_MASTER, values);
  return res?.data;
};

export const editVendor = async (
  id: string,
  values: Partial<VendorI>,
): Promise<VendorI> => {
  const res: AxiosResponse = await erpApi.put(
    `${ENDPOINT.VENDOR_MASTER}/${id}`,
    values,
  );
  return res?.data;
};

export const deleteVendor = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(
    `${ENDPOINT.VENDOR_MASTER}/${id}`,
  );
  return res?.data;
};

// Customers
export const fetchAllCustomers = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<CustomerI[]>> => {
  const url = `${ENDPOINT.SALES_CUSTOMERS}` + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<CustomerI[]>;
};

export const addCustomer = async (
  values: Partial<CustomerI>,
): Promise<CustomerI> => {
  const res: AxiosResponse = await erpApi.post(
    ENDPOINT.SALES_CUSTOMERS,
    values,
  );
  return res?.data;
};

export const editCustomer = async (
  id: string,
  values: Partial<CustomerI>,
): Promise<CustomerI> => {
  const res: AxiosResponse = await erpApi.put(
    `${ENDPOINT.SALES_CUSTOMERS}/${id}`,
    values,
  );
  return res?.data;
};

export const deleteCustomer = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(
    `${ENDPOINT.SALES_CUSTOMERS}/${id}`,
  );
  return res?.data;
};
