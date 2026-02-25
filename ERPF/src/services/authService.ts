import { AxiosResponse } from "axios";

import { ENDPOINT } from "@constants/endpoints";
import erpApi from "@lib/axiosInstance";

export const loginUser = async (
  values: LoginDataI,
): Promise<ErpResponseI<UserDataI>> => {
  const res: ErpResponseI<UserDataI> = await erpApi.post(
    `${ENDPOINT.AUTH.LOGIN}`,
    values,
  );
  return res;
};

export const logoutUser = async (): Promise<ErpResponseI<null>> => {
  const res: AxiosResponse = await erpApi.get(`${ENDPOINT.AUTH.LOGOUT}`);
  return res.data;
};

export const getAccessToken = async (): Promise<string> => {
  const res: AxiosResponse = await erpApi.get(`${ENDPOINT.AUTH.REFRESH_TOKEN}`);
  const newAccessToken = res?.data;
  return newAccessToken;
};

export const getMe = async (): Promise<UserI> => {
  const res: AxiosResponse = await erpApi.get(`${ENDPOINT.AUTH.GET_ME}`);
  const user = res.data;
  return user as UserI;
};

export const sendForgetPasswordEmail = async (values: {
  email: string;
}): Promise<null> => {
  await erpApi.post(`${ENDPOINT.AUTH.FORGET_PASS}`, values);
  return null;
};

export const verifyOTP = async (values: {
  otp: string;
  email: string;
}): Promise<UserDataI> => {
  const res = await erpApi.post(`${ENDPOINT.AUTH.VALIDATE_OTP}`, values);
  const user = res?.data.user as UserI;
  const accessToken = res?.data.accessToken as string;
  return { user, accessToken };
};
