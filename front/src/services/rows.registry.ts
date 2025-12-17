import type { FacetKey } from '../pages/IndustrialDB';
import { getProcessRows } from './ProcessService/process.service';
import { getProgrammeRows } from './ProgrammeService/programmes.service';
import { getProjectsRows } from './ProjectsService/projects.service';
import { getStrategiesRows } from './StrategiesService/strategies.service';
import { getTechnologyRows } from './TechnologiesService/technologies.service';

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
  strategies: getStrategiesRows,
  projects: getProjectsRows,
  processes:getProcessRows,
};
