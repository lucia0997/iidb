import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { HttpRequestConfig } from "./types";

export type RequestOnFulfilled = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
export type RequestOnRejected = (error: AxiosError) => any;
export type ResponseOnFulfilled = (
  response: AxiosResponse
) => AxiosResponse | Promise<AxiosResponse>;
export type ResponseOnRejected = (error: AxiosError) => any;

export class AxiosHttpClient {
  readonly __isAxios = true as const;
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create(config);
  }

  addRequestInterceptor(
    onFullfilled: RequestOnFulfilled,
    onRejected?: RequestOnRejected
  ): () => void {
    const id = this.instance.interceptors.request.use(onFullfilled, onRejected);
    return () => this.instance.interceptors.request.eject(id);
  }

  addResponseInterceptor(
    onFullfilled: ResponseOnFulfilled,
    onRejected?: ResponseOnRejected
  ): () => void {
    const id = this.instance.interceptors.response.use(
      onFullfilled,
      onRejected
    );
    return () => this.instance.interceptors.response.eject(id);
  }

  get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}
