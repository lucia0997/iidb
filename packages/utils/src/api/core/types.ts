import { AxiosInstance, AxiosRequestConfig } from "axios";

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export type AttachAuthConfig = {
  getAccessToken: () => string | null;
  doRefresh: () => Promise<void>;
  isRefreshRequest?: (config: AxiosRequestConfig) => boolean;
};
