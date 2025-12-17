import { getProjectsOptions } from '../../services/ProjectsService/projects.service';
import { makeUseFacetOptions } from '../FacetOptions/useFacetOptions';

export const useProjectsOptions = makeUseFacetOptions(
  'projects-options',
  getProjectsOptions
)