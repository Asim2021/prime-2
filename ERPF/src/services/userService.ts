import { AxiosResponse } from "axios";

import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";
import { paramsToQueryString } from "@utils/helpers";

export const fetchUserById = async (id: string): Promise<UserI> => {
  const res: AxiosResponse = await erpApi.get(`/users/${id}`);
  const user = res?.data;
  return user as UserI;
};

export const fetchAllUser = async (
  params: QueryParamsI,
): Promise<PaginationResponse<UserI[]>> => {
  const url = `${ENDPOINT.USERS.BASE}` + paramsToQueryString(params);
  const res: AxiosResponse = await erpApi.get(url);
  const users = res?.data;
  return users as PaginationResponse<UserI[]>;
};

export const addUser = async (values: Partial<UserI>): Promise<UserI> => {
  const res: AxiosResponse = await erpApi.post(
    `${ENDPOINT.USERS.BASE}`,
    values,
  );
  const data = res?.data;
  return data;
};

export const editUser = async (
  id: string | null,
  payload: Partial<UserI>,
): Promise<UserI> => {
  const res: AxiosResponse = await erpApi.put(
    `${ENDPOINT.USERS.BASE}/${id}`,
    payload,
  );
  const user = res?.data;
  return user as UserI;
};

export const deleteUser = async (id: string) => {
  const res: AxiosResponse = await erpApi.delete(
    `${ENDPOINT.USERS.BASE}/${id}`,
  );
  return res.data as string;
};

export const bulkCreateUsers = async (
  users: any[],
): Promise<ErpResponse<UserI[]>> => {
  const url = `${ENDPOINT.USERS.BASE}/bulk-create`;
  const res: AxiosResponse = await erpApi.post(url, users);
  return res?.data;
};

export const uploadProfile = async (
  id: string,
  payload: ProfileI,
): Promise<ProfileUploadI> => {
  const res: AxiosResponse<ProfileUploadI> = await erpApi.post<ProfileUploadI>(
    `${ENDPOINT.USERS.PROFILE}/${id}`,
    payload,
  );
  return res.data;
};

export const deleteProfile = async (id: string): Promise<null> => {
  const res: AxiosResponse<null> = await erpApi.delete<null>(
    `${ENDPOINT.USERS.PROFILE}/${id}`,
  );
  return res.data;
};
