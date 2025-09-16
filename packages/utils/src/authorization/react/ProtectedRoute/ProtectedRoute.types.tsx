import React from "react";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: string[];
  loginPath?: string;
  noPermissionsPath?: string;
}
