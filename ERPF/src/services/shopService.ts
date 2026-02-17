import { AxiosResponse } from "axios";
import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";

export const fetchShopSettings = async (): Promise<ShopSettingsI> => {
  const res: AxiosResponse = await erpApi.get(ENDPOINT.SHOP);
  return res?.data as ShopSettingsI;
};

export const updateShopSettings = async (
  payload: Partial<ShopSettingsI>,
): Promise<ShopSettingsI> => {
  const res: AxiosResponse = await erpApi.put(ENDPOINT.SHOP, payload);
  return res?.data as ShopSettingsI;
};
