export type RawFacetOption = {
  key: string;
  label: string;
};

export type FacetSelectorCardProps = {
  title: string;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  onLabels?: (map: Record<string, string>) => void;
  useOptionsHook: () => {
    data?: RawFacetOption[];
    isLoading: boolean;
    isError: boolean;
  };
  color?: string;
};
