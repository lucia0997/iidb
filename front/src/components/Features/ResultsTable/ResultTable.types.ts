import { SelectedByTable } from './../../../pages/IndustrialDB/IndustrialDB.types';
export type Row = { id: string | number } & Record<string, unknown>;

export type ColObj = { key: string; label: string }

export type ColState = ColObj | string;

export type ResultsRouteState = {
    selectedByTable: SelectedByTable;
}