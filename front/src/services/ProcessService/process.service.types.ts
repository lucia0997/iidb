import { Row } from "../../components/Features/ResultsTable";

export type ProcessColumnOptionKey = "group_processes" | "subgroup_processes" | "process_name" | "process_resp_name" | "technology_name";

export type ProcessColumnOptionDTO = { key: ProcessColumnOptionKey; label: string };

export interface ProcessRowsApiResponse {
    results: Row[];
    count: number;
}