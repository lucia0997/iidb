import React, { useMemo } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../../../authorization/react/ProtectedRoute";
import { flattenRoutes, selectElementByPath } from "../routerTools";

import { AppRouterProps } from "./AppRouter.types";

export default function AppRouter({
  structure,
  loginPath = "/login",
  noPermissionsPath = "/403",
  notFoundPath = "/404",
}: AppRouterProps) {
  const { pathname } = useLocation();
  const table = useMemo(() => flattenRoutes(structure), [structure]);
  const element = useMemo(
    () => selectElementByPath(table, pathname),
    [structure, pathname]
  );
  if (!element) {
    return <Navigate to={notFoundPath} replace />;
  }

  const permissions = (element.node.requiredPermissions ?? []) as string[];

  return (
    <ProtectedRoute
      permissions={permissions}
      loginPath={loginPath}
      noPermissionsPath={noPermissionsPath}
    >
      {element.node.element}
    </ProtectedRoute>
  );
}
