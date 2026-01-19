import { Row } from "../../components/Features/ResultsTable";

export type ProjectsColumnOptionKey = "project_id" | "project_name" | "status" | "project_description" | "project_benefits" | "ads_group" | "programmes" | "synergies" | "project_leader" | "other_team_members" | "project_start_date" | "project_end_date" | "project_total_cost" | "project_funding_call" | "project_maturity" | "project_running_status";

export type ProjectsColumnOptionDTO = { key: ProjectsColumnOptionKey; label: string };

export interface ProjectsRowsApiResponse {
    results: Row[];
    count: number;
}