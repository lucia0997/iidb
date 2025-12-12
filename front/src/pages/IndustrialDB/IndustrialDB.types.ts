import { RawFacetOption } from "../../components/CustomComponents/FacetSelectorCard";

export type FacetKey = 'plants_programme' | 'technologies' | 'strategy' | 'projects' | 'processes';

export type FacetState = Record<FacetKey, string[]>;

export type FacetConfig = {
    key: FacetKey,
    title: string,
    useOptionsHook: () => {
        data?: RawFacetOption[];
        isLoading: boolean;
        isError: boolean;
      };
}