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

    // Si en el front se ha seleccionado la columna "trls" en la tabla Technology,
    // añadimos el parámetro ?trls=true para activar el serializer especial en el backend.
    const hasTrlsColumn = selectedKeys.includes('trls');

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