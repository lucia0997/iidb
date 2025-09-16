import { createContext } from "react";
import { AxiosHttpClient } from "../core";

export const ApiClientContext = createContext<AxiosHttpClient | undefined>(
  undefined
);
