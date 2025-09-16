import { Button, Stack, Typography } from "@airbus/components-react";
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
      <Stack spacing="2-x">
        <Typography variant="h1">Error 404: Not Found.</Typography>
        <Typography variant="small">Page not found.</Typography>
        <Button onClick={handleGoHomeClick}>Home Page</Button>
      </Stack>
    </div>
  );
};

export default Page403;
