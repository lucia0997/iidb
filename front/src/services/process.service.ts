import { ColumnOptionDTO, PlantProgrammeRowsApiResponse } from "../components/Features/PlantsProgrammes";
import type { AxiosHttpClient } from "@df/utils";
import { Row } from "../components/Features/ResultsTable";

export async function getProcessOptions(api: AxiosHttpClient): Promise<ColumnOptionDTO[]> {
    const { data } = await api.get<ColumnOptionDTO[]>('/plants-programmes/columns/');
    return data;
}

export async function getProcessRows(
    api: AxiosHttpClient,
    selectedKeys: string[],
    pageSize = 200
): Promise<{ rows: Row[]; count: number }> {
    if (!selectedKeys.length) {
        return { rows: [], count: 0 }
    }

    const { data } = await api.get<Row[] | PlantProgrammeRowsApiResponse>('/plants-programmes/rows/', {
        params: { columns: selectedKeys.join(','), page_size: pageSize},
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

export async function getProcessRowDetail(
    api: AxiosHttpClient,
    rowId: number | string
): Promise<Row> {
    const { data } = await api.get<Row>(
        `/plants-programmes/rows/${rowId}/`
    );
    return data;
}