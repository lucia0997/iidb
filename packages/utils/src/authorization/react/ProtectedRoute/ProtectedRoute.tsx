import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../authentication/react";
import { ProtectedRouteProps } from "./ProtectedRoute.types";
import { LoadingScreen } from "@df/ui";

export default function ProtectedRoute({
  children,
  permissions,
  loginPath = "/login",
  noPermissionsPath = "/403",
}: ProtectedRouteProps): React.JSX.Element {
  const { status, hasPermission } = useAuth();
  const location = useLocation();

  if (status == "bootstrapping") {
    return <LoadingScreen label="Validating credentials..." />;
  }

  if (status == "unauthenticated") {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (permissions && permissions.some((perm) => !hasPermission(perm))) {
    return <Navigate to={noPermissionsPath} replace />;
  }

  return <>{children}</>;
}
