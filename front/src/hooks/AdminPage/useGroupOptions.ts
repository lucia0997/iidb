import { useApiClient, useOptions } from "@df/utils";

export type Option = { label: string, value: string };

export const useGroupOptions = () => {
    const api = useApiClient();

    const { 
        options: groupOptions, 
        loading: loadingGroups,
        error,
    } = useOptions('groups', async (): Promise<Option[]> => {
        const { data } = await api.get('users/groups/');
        const items = Array.isArray(data) ? data : (data?.results ?? []);
        return items.map((g: { id: number | string; name?: unknown }) => ({
          label: String(g?.name ?? ''),
          value: String(g?.id ?? ''),
        }));
      });

    return { groupOptions, loadingGroups, error }
}