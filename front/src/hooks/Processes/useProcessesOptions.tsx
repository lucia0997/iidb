import { getProcessOptions } from '../../services/ProcessService/process.service';
import { makeUseFacetOptions } from '../FacetOptions/useFacetOptions';

export const useProcessesOptions = makeUseFacetOptions(
  'processes-options',
  getProcessOptions

)