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
        (k) => (selectedByTable[k]?.columns?.length ?? 0) > 0
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
    // Column defs y keys por tabla, con lógica especial para tecnologías + TRLs
    return tablesToShow.reduce(
      (acc, tableKey) => {
        const cols = selectedByTable[tableKey]?.columns ?? [];

        let normalizedCols: ColObj[] = cols.map((c) =>
          typeof c === 'string' ? { key: c, label: c } : c
        );

        // Si en tecnologías se ha seleccionado "TRLs" como columna,
        // expandimos a todas las columnas TRL year/cost.
        if (tableKey === 'technologies') {
          const hasTrls = normalizedCols.some((c) => c.key === 'trls');
          if (hasTrls) {
            normalizedCols = [
              // mantenemos el resto de columnas seleccionadas que no sean 'trls'
              ...normalizedCols.filter((c) => c.key !== 'trls'),
              // añadimos todas las columnas TRL (años y costes)
              { key: 'trl1_year', label: 'TRL1 Year' },
              { key: 'trl1_cost', label: 'TRL1 Cost' },
              { key: 'trl2_year', label: 'TRL2 Year' },
              { key: 'trl2_cost', label: 'TRL2 Cost' },
              { key: 'trl3_year', label: 'TRL3 Year' },
              { key: 'trl3_cost', label: 'TRL3 Cost' },
              { key: 'trl4_year', label: 'TRL4 Year' },
              { key: 'trl4_cost', label: 'TRL4 Cost' },
              { key: 'trl5_year', label: 'TRL5 Year' },
              { key: 'trl5_cost', label: 'TRL5 Cost' },
              { key: 'trl6_year', label: 'TRL6 Year' },
              { key: 'trl6_cost', label: 'TRL6 Cost' },
              { key: 'trl7_year', label: 'TRL7 Year' },
              { key: 'trl7_cost', label: 'TRL7 Cost' },
              { key: 'trl8_year', label: 'TRL8 Year' },
              { key: 'trl8_cost', label: 'TRL8 Cost' },
              { key: 'trl9_year', label: 'TRL9 Year' },
              { key: 'trl9_cost', label: 'TRL9 Cost' },
            ];
          }
        }

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

        const rows = q.data?.rows ?? [];
        const rowCount = q.data?.count ?? 0;

        // Filtrar columnas TRL: solo mostrar las que tienen al menos un valor no-null
        const visibleCols = useMemo(() => {
          if (tableKey !== 'technologies' || rows.length === 0) {
            return cols;
          }

          // Identificar columnas TRL (trlX_year, trlX_cost)
          const trlCols = cols.filter((c) => /^trl\d+_(year|cost)$/.test(c.key));
          const nonTrlCols = cols.filter((c) => !/^trl\d+_(year|cost)$/.test(c.key));

          // Para cada columna TRL, verificar si tiene al menos un valor no-null
          const trlColsWithData = trlCols.filter((col) => {
            return rows.some((row) => {
              const value = row[col.key];
              return value != null && value !== '';
            });
          });

          return [...nonTrlCols, ...trlColsWithData];
        }, [cols, rows, tableKey]);

        const columnDefs: MRT_ColumnDef<Row>[] = visibleCols.map(({ key, label }) => ({
          accessorKey: String(key),
          header: String(label ?? key),
          size: 200,
          Cell: ({ cell }) => {
            const value = cell.getValue<unknown>();

            if (Array.isArray(value)) return value.join(', ');
            if (value == null) return ''; 
            return String(value)
          }
        }));

        return (
          <Box key={tableKey} className="tableContainer">
            <Typography variant="medium" sx={{ mb: 4 }}>{selectedByTable[tableKey]?.title ?? tableKey}</Typography>
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
