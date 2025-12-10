import { useApiClient } from '@df/utils';
import { useQuery } from '@tanstack/react-query';
import { getProgrammeOptions } from '../../services/programmes.service';

export function useProgrammeOptions() {
  const api = useApiClient();
  
  return useQuery({
    queryKey: ['programme-options'],
    queryFn: () => getProgrammeOptions(api),
  });
}
