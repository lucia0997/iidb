import { Row } from "../ResultsTable";

export type TechnologyColumnOptionKey = 
            "technology_cluster" |
            "coc_expert_name" |
            "product_domains" |
            "technology_domains" |
            "tdm_names" |
            "technology_name" |
            "technology_description" |
            "current_trl" |
            "trl1_year" |
            "trl2_year" |
            "trl3_year" |
            "trl4_year" |
            "trl5_year" |
            "trl6_year" |
            "trl7_year" |
            "trl8_year" |
            "trl9_year" |
            "trl1_cost" |
            "trl2_cost" |
            "trl3_cost" |
            "trl4_cost" |
            "trl5_cost" |
            "trl6_cost" |
            "trl7_cost" |
            "trl8_cost" |
            "trl9_cost" |
            "tech_cluster_dependencies" |
            "fom_type" |
            "fom_value_percent" |
            "targeted_programmes" |
            "ac_application";

export type TechnologyColumnOptionDTO = { key: TechnologyColumnOptionKey; label: string };

export type TechnologiesProps = {
    value: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    title?: string;
    subtitle?: string;
    onLabels?: (map: Record<string, string>) => void;
}

export type TechnologiesRow = Record<string, unknown>

export interface TechnologiesRowsApiResponse {
    results: Row[];
    count: number;
}