import { getStrategiesOptions } from '../../services/StrategiesService/strategies.service';
import { makeUseFacetOptions } from '../FacetOptions/useFacetOptions';

export const useStrategiesOptions = makeUseFacetOptions(
  'strategies-options',
  getStrategiesOptions
)