import { Typography } from '@airbus/components-react';
import { useApiClient, useAuth } from '@df/utils';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './resultsTable.css';
import { DFTable, QueryState } from '@df/ui';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import type { ColObj, ResultsRouteState, Row } from './ResultTable.types';
import { Visibility } from '@mui/icons-material';
import { RowDetailDrawer } from '../RowDetailDrawer';
import type { FacetKey, SelectedByTable } from '../../../pages/IndustrialDB';
import { useQueries } from '@tanstack/react-query';
import { rowsServiceByTable } from '../../../services/rows.registry';

const ResultsTable = () => {
  const { i18n, t } = useTranslation('results_table');
  const { hasPermission } = useAuth();
  const location = useLocation();
  const api = useApiClient();

  const selectedByTable =
    (location.state as ResultsRouteState)?.selectedByTable ?? ({} as SelectedByTable);

  const tablesToShow = useMemo(
    () =>
      (Object.keys(selectedByTable) as FacetKey[]).filter(
        (k) => (selectedByTable[k]?.length ?? 0) > 0
      ),
    [selectedByTable]
  );

  const [defaultQuery, setDefaultQuery] = useState<QueryState>({
    pageIndex: 0,
    pageSize: 10,
    sorting: [],
    filters: [],
  });
  const [queryByTable, setQueryByTable] = useState<Record<FacetKey, QueryState>>({
    plants_programme: defaultQuery,
    technologies: defaultQuery,
    strategies: defaultQuery,
    projects: defaultQuery,
    processes: defaultQuery,
  });
  const [detailId, setDetailId] = useState<number | string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<FacetKey | null>(tablesToShow[0] ?? null);

  useEffect(() => {
    setActiveTable((prev) =>
      prev && tablesToShow.includes(prev) ? prev : (tablesToShow[0] ?? null)
    );
  }, [tablesToShow]);

  const normalizedByTable = useMemo(() => {
    return tablesToShow.reduce(
      (acc, tableKey) => {
        const cols = selectedByTable[tableKey] ?? [];
        const normalizedCols: ColObj[] = cols.map((c) =>
          typeof c === 'string' ? { key: c, label: c } : c
        );

        acc[tableKey] = {
          cols: normalizedCols,
          keys: normalizedCols.map((c) => c.key),
        };
        return acc;
      },
      {} as Record<FacetKey, { cols: ColObj[]; keys: string[] }>
    );
  }, [tablesToShow, selectedByTable]);

  const pageSize = 200;

  const queries = useQueries({
    queries: tablesToShow.map((tableKey) => {
      const { keys } = normalizedByTable[tableKey];
      const fn = rowsServiceByTable[tableKey];

      return {
        queryKey: ['rows', tableKey, keys, pageSize],
        enabled: keys.length > 0 && !!fn,
        queryFn: async () => {
          if (!fn) throw new Error(`No rows service for ${tableKey}`);
          return fn(api, keys, pageSize);
        },
      };
    }),
  });

  const handleView = (rowId: number | string) => {
    setDetailId(rowId);
    setOpen(true);
  };

  if (!tablesToShow.length || !activeTable) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="medium">No columns detected</Typography>
      </Box>
    );
  }

  const handleEdit = () => {};
  const handleDelete = () => {};
  const canCreate = hasPermission?.('users.edit_users') ?? false;

  return (
    <Box className="selectedColumnsContainer">
      <Typography variant="h3">{t('selectedData')}</Typography>
      {tablesToShow.length === 0 && (
        <Box sx={{ p: 6 }}>
          <Typography variant="medium">No columns detected</Typography>
        </Box>
      )}
      {tablesToShow.map((tableKey, idx) => {
        const { cols } = normalizedByTable[tableKey];
        const q = queries[idx];

        const columnDefs: MRT_ColumnDef<Row>[] = cols.map(({ key, label }) => ({
          accessorKey: String(key),
          header: String(label ?? key),
          size: 200,
        }));

        const rows = q.data?.rows ?? [];
        const rowCount = q.data?.count ?? 0;

        return (
          <Box key={tableKey} className="tableContainer">
            <Typography variant="medium">{tableKey}</Typography>
            <Typography variant="subH6">{`${t('selectedColumns')} ${cols.map((col) => col.label).join(', ')}`}</Typography>
            {q.isLoading && <p>Loading...</p>}
            {q.isError && <p>{(q.error as any)?.response?.data?.detail ?? 'Error loading data'}</p>}
            {!q.isLoading && !q.isError && (
              <DFTable<Row>
                // title="Results Page"
                columns={columnDefs}
                data={rows}
                loading={q.isLoading}
                rowCount={rowCount}
                query={queryByTable[tableKey]}
                onQueryChange={(next) => setQueryByTable((s) => ({ ...s, [tableKey]: next }))}
                onEditRow={canCreate ? handleEdit : undefined}
                onDeleteRow={canCreate ? handleDelete : undefined}
                actionsPosition="last"
                createLabel={t('create')}
                editLabel={t('edit')}
                deleteLabel={t('delete')}
                getRowActions={(row) => [
                  {
                    id: 'view',
                    label: t('view'),
                    icon: <Visibility />,
                    onClick: (row) => handleView(row.id),
                  },
                ]}
              />
            )}
          </Box>
        );
      })}

      <RowDetailDrawer open={open} onClose={() => setOpen(false)} rowId={detailId} />
    </Box>
  );
};

export default ResultsTable;
