import { RawFacetOption } from "../../components/CustomComponents/FacetSelectorCard";
import { ColState } from "../../components/Features/ResultsTable";

export type FacetKey = 'plants_programme' | 'technologies' | 'strategies' | 'projects' | 'processes';

export type FacetState = Record<FacetKey, string[]>;

export type FacetConfig = {
    key: FacetKey,
    title: string,
    useOptionsHook: () => {
        data?: RawFacetOption[];
        isLoading: boolean;
        isError: boolean;
      };
    color?: string
}

export type SelectedTableState = {
  title: string;
  columns: ColState[];
}

export type SelectedByTable = Record<FacetKey, SelectedTableState>