import { useContext } from "react";
import { ApiClientContext } from "./ApiClientContext";
import { AxiosHttpClient } from "../core";

export function useApiClient(): AxiosHttpClient {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
}
