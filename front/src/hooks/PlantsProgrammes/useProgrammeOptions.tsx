import { getProgrammeOptions } from '../../services/ProgrammeService/programmes.service';
import { makeUseFacetOptions } from '../FacetOptions/useFacetOptions';

export const useProgrammeOptions = makeUseFacetOptions(
  'programme-options',
  getProgrammeOptions

)