// authentication
export { AuthProvider, AuthContext, useAuth } from "./authentication/react";
export { AuthService, TokenService } from "./authentication/core";

// authorization
export { ProtectedRoute, ProtectedContent } from "./authorization/react/";

// api
export { ApiClientContext, ApiClientProvider, useApiClient } from "./api/react";
export { AxiosHttpClient, attachAuthInterceptors } from "./api/core";

// router
export {
  AppRouter,
  AppHeader,
  EndTab,
  ClickableTab,
  GroupTab,
  TabList,
  flattenRoutes,
  extractTabs,
  orderTabs,
  selectElementByPath,
} from "./router/react";

/* types */
// authentication
export type {
  AuthProviderProps,
  AuthProviderOptions,
  AuthContextProps,
} from "./authentication/react";
export type {
  User,
  LoginPayload,
  AuthTokens,
  AuthStatus,
  LoginResponse,
} from "./authentication/core";

// authorization
export type {
  ProtectedRouteProps,
  ProtectedContentProps,
} from "./authorization/react";

// api
export type { ApiClientProviderProps } from "./api/react";
export type { HttpRequestConfig, AttachAuthConfig } from "./api/core";

// router
export type {
  AppRouterProps,
  AppHeaderProps,
  AppHeaderOptions,
  AppHeaderInfoProps,
  AppHeaderNotificationsProps,
  PageDepth,
  BasePageProps,
  RouteProps,
  TabProps,
  PageNodeProps,
  Page,
  RoutePage,
  RouteGroup,
  TabGroup,
  RouteNode,
  RouteRenderNode,
  RootRouteNode,
  FlattenRoute,
  TabElement,
  TabLevelSizeLimits,
  BuildTabsOptions,
  HeaderTabProps,
  HeaderTabsProps,
} from "./router/react";
