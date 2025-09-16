import React from "react";
import { DFTableProps } from "./DFTable.types";

export const DFTable: React.FC<DFTableProps> = ({ data, onSelect }) => {
  return (
    <div>
      <h1>Esto es un ejemplo numero 1.1:</h1>
      <h2>{data}</h2>
    </div>
  );
};
