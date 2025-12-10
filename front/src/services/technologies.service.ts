import type { AxiosHttpClient } from "@df/utils";
import { Row } from "../components/Features/ResultsTable";
import { TechnologiesRowsApiResponse, TechnologyColumnOptionDTO } from "../components/Features/Technologies";

export async function getTechnologyOptions(api: AxiosHttpClient): Promise<TechnologyColumnOptionDTO[]> {
    const { data } = await api.get<TechnologyColumnOptionDTO[]>('/technologies/columns/');
    return data;
}

export async function getProgrammeRows(
    api: AxiosHttpClient,
    selectedKeys: string[],
    pageSize = 200
): Promise<{ rows: Row[]; count: number }> {
    if (!selectedKeys.length) {
        return { rows: [], count: 0 }
    }

    const { data } = await api.get<Row[] | TechnologiesRowsApiResponse>('/technologies/rows/', {
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

export async function getProgrammeRowDetail(
    api: AxiosHttpClient,
    rowId: number | string
): Promise<Row> {
    const { data } = await api.get<Row>(
        `/technologies/rows/${rowId}/`
    );
    return data;
}