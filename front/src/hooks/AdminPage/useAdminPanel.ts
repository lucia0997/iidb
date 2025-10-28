import { useApiClient, useAuth, useToast } from "@df/utils";
import { AdminPanelAPI, User, UserDetail, UserFormValues } from "../../pages/AdminPage/AdminPage.types";
import { useGroupOptions } from "./useGroupOptions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MRT_ColumnDef } from "material-react-table";
import { useTranslation } from "react-i18next";
import { QueryState } from "@df/ui";

export const DEFAULT_INITIAL: UserFormValues = {
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  is_active: true,
  groups: [],
};

export const useAdminPanel = (): AdminPanelAPI => {
  const api = useApiClient();
  const { hasPermission } = useAuth();
  const { groupOptions } = useGroupOptions();
  const { showToast } = useToast();
  const { t, i18n } = useTranslation('admin_panel')

  type UIOption = (typeof groupOptions)[number];

  const idsToNames = (ids: readonly number[], options: readonly UIOption[]) => {
    const want = new Set(ids.map(String));
    return options.filter((o) => want.has(String(o.value))).map((o) => o.label);
  };

  const [query, setQuery] = useState<QueryState>({
    pageIndex: 0,
    pageSize: 10,
    sorting: [],
    filters: [],
  });

  const [rows, setRows] = useState<User[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editInitial, setEditInitial] = useState<Partial<UserFormValues> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'username', header: t('username') },
      { accessorKey: 'full_name', header: t('fullname') },
      { accessorKey: 'email', header: t('email') },
      {
        accessorKey: 'group_names',
        header: t('groups'),
        Cell: ({ cell }) => {
          const v = cell.getValue<string[] | undefined>();
          return Array.isArray(v) ? v.join(', ') : String(v ?? '');
        },
      },
      {
        accessorKey: 'is_active',
        header: t('active'),
        Cell: ({ cell }) => (cell.getValue<boolean>() ?  t('active') :  t('inactive')),
        filterVariant: 'select' as any,
        filterSelectOptions: [
          { label: t('active'), value: 'true' },
          { label: t('inactive'), value: 'false' },
        ],
        size: 100,
      },
    ],
    [t, i18n.language]
  );

  const mapDetailToInitial = (u: UserDetail): Partial<UserFormValues> => ({
    username: u.username,
    first_name: u.first_name ?? '',
    last_name: u.last_name ?? '',
    email: u.email ?? '',
    is_active: Boolean(u.is_active),
    groups: (u.groups ?? [])
      .map((g) => Number(g.id))
      .filter((n): n is number => Number.isFinite(n)),
  });

  const buildListParams = useCallback((q: QueryState) => {
    const ordering = (q.sorting ?? [])
      .map((s) => (s.desc ? `-${s.id}` : s.id))
      .filter(Boolean)
      .join(',');

    const filterParams = Object.fromEntries(
      (q.filters ?? [])
        .filter((f) => String(f.value ?? '').length > 0)
        .map((f) => [String(f.id), String(f.value)])
    );

    return {
      page: q.pageIndex + 1,
      page_size: q.pageSize,
      ...(ordering ? { ordering } : {}),
      ...filterParams,
    } as const;
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildListParams(query);
      const res = await api.get('/users/users/', { params });
      const results: User[] = res.data?.results ?? res.data ?? [];
      const count: number = res.data?.count ?? results.length;

      setRows(results);
      setRowCount(count);
    } finally {
      setLoading(false);
    }
  }, [api, buildListParams, query]);

  useEffect(() => {
    fetchUsers();
  }, [
    query.pageIndex,
    query.pageSize,
    JSON.stringify(query.sorting),
    JSON.stringify(query.filters),
  ]);

  const handleCreate = () => {
    setSelected(null);
    setIsEditMode(false);
    setOpenCreate(true);
  };

  const handleEdit = async (row: User) => {
    setSubmitting(true);
    try {
      const { data } = await api.get<UserDetail>(`/users/users/${row.id}/`);
      setEditInitial(mapDetailToInitial(data));
      setSelected(row);
      setIsEditMode(true);
      setOpenEdit(true);
    } catch (error) {
      console.error('Error loading user details', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (row: User) => {
    setSelected(row);
    setOpenDelete(true);
  };

  const submitCreate = async (v: UserFormValues) => {
    setSubmitting(true);
    try {
      const groupNames = idsToNames(v.groups, groupOptions);
      const payload = {
        username: v.username,
        groups: groupNames,
      };
      await api.post('/users/users/', payload);
      showToast( { message: `${t('user')} ${v.username} ${t('create_success')}.`, variant: 'success'});
      setOpenCreate(false);
      await fetchUsers();
    } catch (error: any) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async (v: UserFormValues) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const payload = {
        first_name: v.first_name,
        last_name: v.last_name,
        email: v.email,
        is_active: v.is_active,
        group_ids: v.groups,
      };
      await api.put(`/users/users/${selected.id}/`, payload);
      showToast( { message: `${t('user')} ${v.username} ${t('edit_success')}.`, variant: 'success'});
      setOpenEdit(false);
      await fetchUsers();
    } catch (error: any) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (userId: string) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.put(`/users/users/${userId}/`, { is_active: false });
      showToast( { message: `${t('user')} ${selected.username} ${t('edit_success')}.`, variant: 'success'});
      setOpenDelete(false);
      setSelected(null);
      await fetchUsers();
    } catch (error: any) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const closeCreateModal = () => {
    setOpenCreate(false);
    setEditInitial(null);
    setSelected(null);
  };
  const closeEditModal = () => {
    setOpenEdit(false);
    setEditInitial(null);
    setSelected(null);
  };
  const closeDeleteModal = () => {
    setOpenDelete(false);
    setSelected(null);
  };

  const canCreate = hasPermission?.('users.edit_users') ?? false;

  return {
    groupOptions,
    query,
    setQuery,
    rows,
    rowCount,
    loading,
    openCreate,
    handleCreate,
    closeCreateModal,
    openEdit,
    handleEdit,
    closeEditModal,
    openDelete,
    handleDelete,
    closeDeleteModal,
    selected,
    submitting,
    editInitial,
    columns,
    submitCreate,
    submitEdit,
    confirmDelete,
    canCreate,
    isEditMode,
    refresh: fetchUsers,
  };
};