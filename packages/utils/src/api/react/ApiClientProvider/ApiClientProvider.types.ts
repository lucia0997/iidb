import { AxiosHttpClient } from "../../core";

export interface ApiClientProviderProps {
  client: AxiosHttpClient;
  children: React.ReactNode;
}
