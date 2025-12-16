import type { AxiosHttpClient } from "@df/utils";
import { Row } from "../../components/Features/ResultsTable";
import { ProjectsColumnOptionDTO, ProjectsRowsApiResponse } from "./projects.service.types";

export async function getProjectsOptions(api: AxiosHttpClient): Promise<ProjectsColumnOptionDTO[]> {
    const { data } = await api.get<ProjectsColumnOptionDTO[]>('/projects/columns/');
    return data;
}

export async function getProjectsRows(
    api: AxiosHttpClient,
    selectedKeys: string[],
    pageSize = 200
): Promise<{ rows: Row[]; count: number }> {
    if (!selectedKeys.length) {
        return { rows: [], count: 0 }
    }

    const { data } = await api.get<Row[] | ProjectsRowsApiResponse>('/projects/rows/', {
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

export async function getProjectsRowDetail(
    api: AxiosHttpClient,
    rowId: number | string
): Promise<Row> {
    const { data } = await api.get<Row>(
        `/projects/rows/${rowId}/`
    );
    return data;
}