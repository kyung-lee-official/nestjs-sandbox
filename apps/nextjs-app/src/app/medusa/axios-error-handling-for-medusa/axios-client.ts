import type { HttpErrorResponse } from "@repo/types";
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth";

interface CustomRequestConfig extends AxiosRequestConfig {
  skipInterceptor?: boolean;
  bearerToken?: string; // for registerCustomer and resetPassword APIs
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & CustomRequestConfig) => {
    config.headers["x-publishable-api-key"] =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    if (config.bearerToken) {
      config.headers.Authorization = `Bearer ${config.bearerToken}`;
    }

    return config;
  },
);

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<HttpErrorResponse>) => {
    const status = error.response?.status;
    const errorData = error.response?.data?.error;
    const errorCode = errorData?.code;
    const skipInterceptor =
      (error.config as CustomRequestConfig)?.skipInterceptor ?? false;

    if (
      status === 404 &&
      error.response?.headers["content-type"] === "text/html; charset=utf-8"
    ) {
      return Promise.reject({
        error: {
          code: "SYSTEM.ENDPOINT_NOT_FOUND",
          message: `The requested endpoint ${error.config?.url} was not found on the server.`,
          details: {},
          timestamp: errorData?.timestamp,
        },
      } as HttpErrorResponse);
    }

    if (status === 401) {
      const { signOut } = useAuthStore.getState();
      signOut();

      return Promise.reject({
        error: {
          code: errorCode || "AUTH.UNAUTHORIZED",
          message: errorData?.message,
          details: {},
          timestamp: errorData?.timestamp,
        },
      } as HttpErrorResponse);
    }

    if (errorData) {
      return Promise.reject({
        error: {
          code: errorData.code,
          message: errorData.message,
          details: errorData.details,
          timestamp: errorData.timestamp,
        },
      } as HttpErrorResponse);
    }

    return Promise.reject({
      error: {
        code: "SYSTEM.UNKNOWN_ERROR",
        message:
          error.response?.status === 500
            ? "Something went wrong on the server"
            : error.message || "Network Error",
        details: {},
        timestamp: new Date().toISOString(),
      },
    } as HttpErrorResponse);
  },
);

/**
 * 封装 GET 请求函数
 * @param url
 * @param config
 * @returns Promise<T>
 */
export const get = <T>(url: string, config?: CustomRequestConfig): Promise<T> =>
  instance
    .get<T>(url, {
      ...config,
    })
    .then((res) => res.data);

/** 封装 POST 请求函数
 * @param url
 * @param data
 * @param config
 * @returns Promise<T>
 */
export const post = <T>(
  url: string,
  data?: any,
  config?: CustomRequestConfig,
): Promise<T> => instance.post<T>(url, data, config).then((res) => res.data);

/** 封装 DELETE 请求函数
 * @param url
 * @param config
 * @returns Promise<T>
 */
export const del = async <T>(
  url: string,
  config?: CustomRequestConfig,
): Promise<T> =>
  instance
    .delete<T>(url, {
      ...config,
    })
    .then((res) => res.data);

const api = { get, post, del };
export default api;
