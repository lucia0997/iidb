import { useApiClient } from '@df/utils';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

type FetcherFn<TRaw> = (api: any) => Promise<TRaw>

export function makeUseFacetOptions<TRaw, TData = TRaw>(
    queryKey: string,
    fetcher: FetcherFn<TRaw>,
    select?: (raw: TRaw) => TData,
) {
    return function useFacetOptions(): UseQueryResult<TData> {
        const api = useApiClient();

        return useQuery({
            queryKey: [queryKey],
            queryFn: () => fetcher(api),
            select
        });
    }

}


