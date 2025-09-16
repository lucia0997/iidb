import { RootRouteNode } from "../types";

export interface AppRouterProps {
  structure: RootRouteNode[];
  loginPath?: string;
  noPermissionsPath?: string;
  notFoundPath?: string;
}
