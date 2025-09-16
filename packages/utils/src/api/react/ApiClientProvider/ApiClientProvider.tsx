import { ApiClientProviderProps } from "./ApiClientProvider.types";
import { ApiClientContext } from "../ApiClientContext";

export function ApiClientProvider({
  client,
  children,
}: ApiClientProviderProps) {
  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}
