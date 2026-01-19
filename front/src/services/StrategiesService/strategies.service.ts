import type { AxiosHttpClient } from "@df/utils";
import { Row } from "../../components/Features/ResultsTable";
import { StrategiesColumnOptionDTO, StrategiesRowsApiResponse } from "./strategies.service.types";

export async function getStrategiesOptions(api: AxiosHttpClient): Promise<StrategiesColumnOptionDTO[]> {
    const { data } = await api.get<StrategiesColumnOptionDTO[]>('/strategies/columns/');
    return data;
}

export async function getStrategiesRows(
    api: AxiosHttpClient,
    selectedKeys: string[],
    pageSize = 200
): Promise<{ rows: Row[]; count: number }> {
    if (!selectedKeys.length) {
        return { rows: [], count: 0 }
    }

    const { data } = await api.get<Row[] | StrategiesRowsApiResponse>('/strategies/rows/', {
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

export async function getStrategiesRowDetail(
    api: AxiosHttpClient,
    rowId: number | string
): Promise<Row> {
    const { data } = await api.get<Row>(
        `/strategies/rows/${rowId}/`
    );
    return data;
}