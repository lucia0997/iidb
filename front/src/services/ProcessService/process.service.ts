import type { AxiosHttpClient } from "@df/utils";
import { Row } from "../../components/Features/ResultsTable";
import { ProcessColumnOptionDTO, ProcessColumnOptionKey, ProcessRowsApiResponse } from "./process.service.types";

export async function getProcessOptions(api: AxiosHttpClient): Promise<ProcessColumnOptionDTO[]> {
    const { data } = await api.get<ProcessColumnOptionDTO[]>('/processes/columns/');
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

    const { data } = await api.get<Row[] | ProcessRowsApiResponse>('/processes/rows/', {
        params: { columns: selectedKeys.join(','), page_size: pageSize },
    });

    if (Array.isArray(data)) {
        return {
            rows: data,
            count: data.length,
        }
    }

    const rows = data.results ?? [];
    const count = data.count ?? rows.length

    return { rows, count }
}

export async function getProcessRowDetail(
    api: AxiosHttpClient,
    rowId: number | string
): Promise<Row> {
    const { data } = await api.get<Row>(
        `/processes/rows/${rowId}/`
    );
    return data;
}