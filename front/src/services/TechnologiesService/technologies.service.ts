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

export interface TRLData {
    trl_number: number;
    trl_year?: number;
    trl_cost?: number;
}

export interface OptionItem {
    id: number;
    name: string;
}

export interface CreateTechnologyPayload {
    technology_name: string;
    current_trl: number;
    physical_technology_cluster?: number; // ID en lugar de string
    digital_technology_cluster?: number; // ID en lugar de string
    product_roadmap?: number; // ID en lugar de string
    technology_roadmap?: number; // ID en lugar de string
    technology_description?: string;
    dependencies?: string[]; // Lista de strings
    fom_type?: number; // ID en lugar de string
    fom_value_percent?: number;
    targeted_programmes?: number[]; // Lista de IDs en lugar de strings
    ac_application?: number; // ID en lugar de string
    trls?: TRLData[]; // Lista de TRLs
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

export interface CheckTechnologyNameResponse {
    exists: boolean;
    id: number | null;
    technology_name: string;
}

export async function checkTechnologyName(
    api: AxiosHttpClient,
    technologyName: string
): Promise<CheckTechnologyNameResponse> {
    const { data } = await api.get<CheckTechnologyNameResponse>('/technologies/check-name/', {
        params: { name: technologyName },
    });
    return data;
}

export interface Technology extends CreateTechnologyPayload {
    id: number;
    trls?: Array<{
        id: number;
        trl_number: number;
        trl_year?: number;
        trl_cost?: number;
    }>;
}

export async function getTechnology(
    api: AxiosHttpClient,
    id: number | string
): Promise<Technology> {
    const { data } = await api.get<Technology>(`/technologies/${id}/`);
    return data;
}

export async function updateTechnology(
    api: AxiosHttpClient,
    id: number | string,
    payload: CreateTechnologyPayload
): Promise<{ id: number; technology: Technology }> {
    const { data } = await api.put<Technology>(`/technologies/${id}/`, payload);
    return {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
        technology: data,
    };
}

export interface TechnologyListItem {
    id: number;
    technology_name: string;
}

export async function getTechnologiesList(
    api: AxiosHttpClient
): Promise<TechnologyListItem[]> {
    try {
        // Intentar primero con el endpoint simple
        try {
            const { data } = await api.get<TechnologyListItem[]>('/technologies/list-simple/');
            if (Array.isArray(data)) {
                return data;
            }
        } catch (simpleError: any) {
            // Si el endpoint simple no existe, usar el endpoint estándar
            console.warn('Simple endpoint not available, using standard endpoint');
        }
        
        // Fallback al endpoint estándar con paginación
        const { data } = await api.get<any>('/technologies/', {
            params: {
                page_size: 1000, // Obtener todas las tecnologías en una sola petición
            },
        });
        
        // El endpoint puede devolver paginación, así que manejamos ambos casos
        if (Array.isArray(data)) {
            return data.map((tech: any) => ({
                id: tech.id,
                technology_name: tech.technology_name,
            }));
        }
        
        // Si viene paginado (formato estándar de DRF)
        if (data.results && Array.isArray(data.results)) {
            return data.results.map((tech: any) => ({
                id: tech.id,
                technology_name: tech.technology_name,
            }));
        }
        
        return [];
    } catch (error: any) {
        console.error('Error fetching technologies list:', error);
        throw error;
    }
}

// Funciones para obtener las opciones de las tablas
export async function getPhysicalTechnologyClusters(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/physical-technology-clusters/');
    return data;
}

export async function getDigitalTechnologyClusters(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/digital-technology-clusters/');
    return data;
}

export async function getProductRoadmaps(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/product-roadmaps/');
    return data;
}

export async function getTechnologyRoadmaps(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/technology-roadmaps/');
    return data;
}

export async function getFoMTypes(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/fom-types/');
    return data;
}

export async function getTargetedProgrammes(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/targeted-programmes/');
    return data;
}

export async function getACApplications(api: AxiosHttpClient): Promise<OptionItem[]> {
    const { data } = await api.get<OptionItem[]>('/ac-applications/');
    return data;
}