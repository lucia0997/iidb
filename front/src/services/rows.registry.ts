import type { FacetKey } from '../pages/IndustrialDB';
import { getProgrammeRows } from './programmes.service';
import { getTechnologyRows } from './technologies.service';

export type GetRowsFn = (
  api: any,
  keys: string[],
  pageSize?: number
) => Promise<{
  rows: any[];
  count: number;
}>;

export const rowsServiceByTable: Record<FacetKey, GetRowsFn> = {
  plants_programme: getProgrammeRows,
  technologies: getTechnologyRows,
  strategy: async () => ({ rows: [], count: 0 }),
  projects: async () => ({ rows: [], count: 0 }),
  processes: async () => ({ rows: [], count: 0 }),
};
