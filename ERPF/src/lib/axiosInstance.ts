import useAuthStore from "@stores/authStore";
import axios from "axios";
import { getAccessToken } from "@services/authService";
import { QueryCache } from "@tanstack/react-query";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry: boolean;
  }
}

const erpApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  _retry: false,
});

const queryCache = new QueryCache();

erpApi.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization =
        !config?._retry && accessToken
          ? `Bearer ${accessToken}`
          : config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

erpApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await getAccessToken();
        const { setAuth } = useAuthStore.getState();
        setAuth(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return erpApi(originalRequest);
      } catch (refreshError) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        queryCache.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    error.message =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(error);
  }
);

export default erpApi;
