import { Button, Typography } from "@airbus/components-react";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorPageProps } from "../types";

const Page403: React.FC = ({ homePath }: ErrorPageProps) => {
  const navigate = useNavigate();
  const handleGoHomeClick = useCallback(() => {
    navigate(homePath ?? "/");
  }, [homePath]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography variant="h1">Error 403: No Permissions.</Typography>
      <Typography variant="small">
        You do not have permission to access this page.
      </Typography>
      <Button onClick={handleGoHomeClick}>Go Home</Button>
    </div>
  );
};

export default Page403;
