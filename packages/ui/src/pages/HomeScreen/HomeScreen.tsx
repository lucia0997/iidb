import { Typography } from "@airbus/components-react";
import React from "react";

const HomeScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography>Esta es la Home</Typography>
    </div>
  );
};

export default HomeScreen;
