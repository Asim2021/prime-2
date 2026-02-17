import { AxiosResponse } from "axios";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

// Medicines (Items)
export const fetchAllMedicines = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<MedicineI[]>> => {
  const url = "/medicines" + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<MedicineI[]>;
};

export const addMedicine = async (
  values: Partial<MedicineI>,
): Promise<MedicineI> => {
  const res: AxiosResponse = await erpApi.post("/medicines", values);
  return res?.data;
};

export const editMedicine = async (
  id: string,
  values: Partial<MedicineI>,
): Promise<MedicineI> => {
  const res: AxiosResponse = await erpApi.put(`/medicines/${id}`, values);
  return res?.data;
};

export const deleteMedicine = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(`/medicines/${id}`);
  return res?.data;
};

// Batches
export const fetchAllBatches = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<BatchI[]>> => {
  const url = "/batches" + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<BatchI[]>;
};

export const addBatch = async (values: Partial<BatchI>): Promise<BatchI> => {
  const res: AxiosResponse = await erpApi.post("/batches", values);
  return res?.data;
};

export const editBatch = async (
  id: string,
  values: Partial<BatchI>,
): Promise<BatchI> => {
  const res: AxiosResponse = await erpApi.put(`/batches/${id}`, values);
  return res?.data;
};

export const deleteBatch = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(`/batches/${id}`);
  return res?.data;
};

// Helpers - Not strictly available on backend as APIs, but maybe for simple lists we can mock or use distinct queries if available.
// For now, let's remove them or return empty to avoid errors in UI calls.
export const fetchAllManufacturers = async (): Promise<ManufacturerI[]> => {
  // const res: AxiosResponse = await erpApi.get(ENDPOINT.ITEM_MAKE);
  // return res?.data;
  return [];
};

export const fetchAllCategories = async (): Promise<CategoryI[]> => {
  // const res: AxiosResponse = await erpApi.get(ENDPOINT.ITEM_GROUPS);
  // return res?.data;
  return [];
};

export const fetchBatchesByMedicine = async (medicineId: string) => {
  const { data } = await erpApi.get(`/medicines/${medicineId}/batches`);
  return data;
};

// Stock Adjustment
export const fetchStockAdjustments = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<StockAdjustmentI[]>> => {
  const url = "/stock-adjustments" + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<StockAdjustmentI[]>;
};

export const createStockAdjustment = async (
  values: Partial<StockAdjustmentI>,
): Promise<StockAdjustmentI> => {
  const res: AxiosResponse = await erpApi.post("/stock-adjustments", values);
  return res?.data;
};
