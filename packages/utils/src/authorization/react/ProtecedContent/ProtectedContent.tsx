import React from "react";
import { useAuth } from "../../../authentication/react";
import { LoadingScreen } from "@df/ui";
import { ProtectedContentProps } from "./ProtectedContent.types";

export default function ProtectedContent({
  children,
  permissions,
  alt = null,
}: ProtectedContentProps): React.JSX.Element {
  const { status, hasPermission } = useAuth();
  if (status == "bootstrapping") {
    return <LoadingScreen label="Validating credentials..." />;
  }

  if (
    (permissions && permissions.some((perm) => !hasPermission(perm))) ||
    status == "unauthenticated"
  ) {
    return <>{alt}</>;
  }

  return <>{children}</>;
}
