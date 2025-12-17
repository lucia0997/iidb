import { Row } from "../../components/Features/ResultsTable";

export type ColumnOptionKey = 'technology_name' | 'program' | 'business' | 'site';

export type ColumnOptionDTO = { key: ColumnOptionKey; label: string };

export interface PlantProgrammeRowsApiResponse {
    results: Row[];
    count: number;
}