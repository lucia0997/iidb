import type { ColumnOptionDTO } from "../components/Features/PlantsProgrammes";
import type { AxiosHttpClient } from "@df/utils";

export async function getProgrammeOptions(api: AxiosHttpClient): Promise<ColumnOptionDTO[]> {
    const { data } = await api.get<ColumnOptionDTO[]>('/programme-options');
    return data;
}