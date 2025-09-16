import React from "react";
import { ProtectedRouteProps } from "../ProtectedRoute";

export interface ProtectedContentProps extends ProtectedRouteProps {
  alt?: React.ReactNode;
}
