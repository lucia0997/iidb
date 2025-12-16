import { getProgrammeOptions } from '../../services/programmes.service';
import { makeUseFacetOptions } from '../FacetOptions/useFacetOptions';

export const useProgrammeOptions = makeUseFacetOptions(
  'programme-options',
  getProgrammeOptions

)