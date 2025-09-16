import React from "react";
import { Spinner } from "@airbus/components-react";
import {
  LoadingScreenPresets,
  LoadingScreenProps,
} from "./LoadingScreen.types";
import { SpinnerProps } from "@airbus/components-react/dist/components/Spinner";

const BASE = {
  label: "Loading...",
  size: "medium",
  showPercentage: false,
  dots: false,
} satisfies SpinnerProps;

/* Define here new presets configurations */
const PRESETS: Record<LoadingScreenPresets, Partial<SpinnerProps>> = {
  loading: {},
  processing: { label: "In process...", showPercentage: true },
  dots: { label: "", dots: true },
};

function pick<T>(
  caller: T | undefined,
  preset: T | undefined,
  base: T | undefined
) {
  return caller !== undefined ? caller : preset !== undefined ? preset : base;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  preset = "loading",
  fullscreen = true,
  ...p
}) => {
  const spinnerProps: SpinnerProps = {
    label: pick(p.label, PRESETS[preset].label, BASE.label),
    size: pick(p.size, PRESETS[preset].size, BASE.size),
    dots: pick(p.dots, PRESETS[preset].dots, BASE.dots),
    showPercentage:
      p.percentage == undefined
        ? false
        : pick(
            p.showPercentage,
            PRESETS[preset].showPercentage,
            BASE.showPercentage
          ),
  };

  return (
    <div
      style={
        fullscreen
          ? {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: "calc(100vh - 60px)",
            }
          : {}
      }
    >
      <Spinner
        dots={spinnerProps.dots}
        showPercentage={spinnerProps.showPercentage}
        label={spinnerProps.label}
        percentage={p.percentage}
        size={spinnerProps.size}
      />
    </div>
  );
};

export default LoadingScreen;
