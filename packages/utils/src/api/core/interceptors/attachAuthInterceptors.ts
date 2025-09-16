import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { AttachAuthConfig } from "../types";
import { AxiosHttpClient } from "../AxiosHttpClient";

export function attachAuthInterceptors(
  client: AxiosHttpClient,
  config: AttachAuthConfig
) {
  // We try to inizialize with an existing client, in this case only axios
  if (!((client as any)?.__isAxios === true)) {
    throw new Error(
      "attachAuthInterceptors require an existing axios based HttpClient."
    );
  }

  // Request interceptor
  const requestId = client.addRequestInterceptor(async (cfg) => {
    const token = config.getAccessToken();
    if (token) {
      cfg.headers =
        cfg.headers instanceof AxiosHeaders
          ? cfg.headers
          : new AxiosHeaders(cfg.headers);
      (cfg.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return cfg;
  });

  // Response 401 → refresh (single-fligth) → retry
  let refreshing: Promise<void> | null = null;

  const responseId = client.addResponseInterceptor(
    async (res) => res,
    async (error: AxiosError) => {
      const cfg = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;
      if (!cfg || cfg._retry) throw error;
      if (error.response?.status !== 401) throw error;
      if (config.isRefreshRequest?.(cfg)) throw error;

      cfg._retry = true;

      if (!refreshing) {
        refreshing = config.doRefresh().finally(() => {
          refreshing = null;
        });
      }
      await refreshing;

      // Reconfigurate the Authorization with the new token
      const token = config.getAccessToken();
      if (token) {
        cfg.headers instanceof AxiosHeaders
          ? cfg.headers
          : new AxiosHeaders(cfg.headers);
        (cfg.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
      }
      return cfg;
    }
  );

  return () => {
    requestId;
    responseId;
  };
}
