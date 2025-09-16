import { SpinnerProps } from "@airbus/components-react/dist/components/Spinner";

export type LoadingScreenPresets = "loading" | "processing" | "dots";

export interface LoadingScreenProps extends SpinnerProps {
  preset?: LoadingScreenPresets;
  fullscreen?: boolean;
}
