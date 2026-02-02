import type { AxiosHttpClient } from "@df/utils";
import { Row } from "../../components/Features/ResultsTable";
import { TechnologiesRowsApiResponse, TechnologyColumnOptionDTO } from "./technologies.service.types";

export async function getTechnologyOptions(api: AxiosHttpClient): Promise<TechnologyColumnOptionDTO[]> {
    const { data } = await api.get<TechnologyColumnOptionDTO[]>('/technologies/columns/');
    return data;
}

export async function getTechnologyRows(
    api: AxiosHttpClient,
    selectedKeys: string[],
    pageSize = 200
): Promise<{ rows: Row[]; count: number }> {
    if (!selectedKeys.length) {
        return { rows: [], count: 0 }
    }

    // Si en el front se ha seleccionado la columna "TRLs" (key 'trls') o cualquier
    // columna TRL (trlX_year / trlX_cost), mandamos ?trls=true para activar
    // el serializer especial en el backend.
    const hasTrlsColumn = selectedKeys.some(
        (key) => key === 'trls' || key.startsWith('trl')
    );

    const { data } = await api.get<Row[] | TechnologiesRowsApiResponse>('/technologies/rows/', {
        params: {
            columns: selectedKeys.join(','),
            page_size: pageSize,
            ...(hasTrlsColumn ? { trls: true } : {}),
        },
    });

    if (Array.isArray(data)) {
        return {
            rows: data,
            count: data.length,
        }
    }

    const rows = data.results ?? [];
    const count = data.count ?? rows.length

    return { rows, count}
}

export async function getTechnologyRowDetail(
    api: AxiosHttpClient,
    rowId: number | string
): Promise<Row> {
    const { data } = await api.get<Row>(
        `/technologies/rows/${rowId}/`
    );
    return data;
}

export interface CreateTechnologyPayload {
    technology_name: string;
    current_trl: number;
    physical_technology_cluster?: string;
    digital_technology_cluster?: string;
    product_roadmap?: string;
    technology_roadmap?: string;
    technology_description?: string;
    dependencies?: string[]; // Lista de strings
    fom_type?: string;
    fom_value_percent?: number;
    targeted_programmes?: string[]; // Lista de strings
    ac_application?: string;
}

export interface CreateTechnologyResponse {
    created: boolean;
    id: number;
    technology: any;
}

export async function createTechnology(
    api: AxiosHttpClient,
    payload: CreateTechnologyPayload
): Promise<CreateTechnologyResponse> {
    const { data } = await api.post<CreateTechnologyResponse>('/technologies/create/', payload);
    return data;
}