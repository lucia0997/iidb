export interface AuthProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  options?: AuthProviderOptions;
}

export interface AuthProviderOptions {
  loginEndpoint?: string;
  userEndpoint?: string;
  refreshEndpoint?: string;
  proactiveRefresh?: ProactiveRefreshConfig;
}

export type ProactiveRefreshConfig =
  | { mode: "none" }
  | { mode: "skew"; skewMs?: number };
