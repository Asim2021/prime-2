import { AxiosResponse } from "axios";
import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

// Medicines (Items)
export const fetchAllMedicines = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<MedicineI[]>> => {
  const url = `${ENDPOINT.ITEMS}` + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  // Backend returns { data: { data: [], totalCount: ... } } which matches PaginationResponseI structure if axios interceptor handles it,
  // or if PaginationResponseI matches.
  // Assuming res.data is the payload.
  return res?.data as PaginationResponseI<MedicineI[]>;
};

export const addMedicine = async (
  values: Partial<MedicineI>,
): Promise<MedicineI> => {
  const res: AxiosResponse = await erpApi.post(ENDPOINT.ITEMS, values);
  return res?.data;
};

export const editMedicine = async (
  id: string,
  values: Partial<MedicineI>,
): Promise<MedicineI> => {
  const res: AxiosResponse = await erpApi.put(
    `${ENDPOINT.ITEMS}/${id}`,
    values,
  );
  return res?.data;
};

export const deleteMedicine = async (id: string): Promise<string> => {
  const res: AxiosResponse = await erpApi.delete(`${ENDPOINT.ITEMS}/${id}`);
  return res?.data;
};

// Batches
export const fetchAllBatches = async (
  _params: QueryParamsI,
): Promise<PaginationResponseI<BatchI[]>> => {
  console.warn("fetchAllBatches not implemented");
  return { data: [], totalCount: 0, totalPages: 0, currentPage: 1 } as any;
};

export const addBatch = async (_values: Partial<BatchI>): Promise<BatchI> => {
  throw new Error("Batches not implemented yet");
};

export const editBatch = async (
  _id: string,
  _values: Partial<BatchI>,
): Promise<BatchI> => {
  throw new Error("Batches not implemented yet");
};

export const deleteBatch = async (_id: string): Promise<string> => {
  throw new Error("Batches not implemented yet");
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
  const { data } = await erpApi.get(
    `${ENDPOINT.INVENTORY_ITEMS}/${medicineId}/batches`,
  );
  return data;
};

// Stock Adjustment
export const fetchStockAdjustments = async (
  params: QueryParamsI,
): Promise<PaginationResponseI<StockAdjustmentI[]>> => {
  const url = `${ENDPOINT.INVENTORY_ADJUST}` + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  return res?.data as PaginationResponseI<StockAdjustmentI[]>;
};

export const createStockAdjustment = async (
  values: Partial<StockAdjustmentI>,
): Promise<StockAdjustmentI> => {
  const res: AxiosResponse = await erpApi.post(
    ENDPOINT.INVENTORY_ADJUST,
    values,
  );
  return res?.data;
};
