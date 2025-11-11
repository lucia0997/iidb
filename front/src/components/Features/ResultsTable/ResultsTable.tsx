import { Typography } from '@airbus/components-react';
import { useApiClient, useAuth } from '@df/utils';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './resultsTable.css';
import { DFTable, QueryState } from '@df/ui';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import type { ColState, Row } from './ResultTable.types';
import { Visibility } from '@mui/icons-material';

//TODO: rewiew let use

const ResultsTable = () => {
  const { i18n, t } = useTranslation('results_table');
  const { hasPermission } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const api = useApiClient();
  const stateColumns: string[] | undefined = (location.state as any)?.columns;

  const raw = (location.state as any)?.columns as ColState[] | undefined;

  const normalized = useMemo(
    () => (raw ?? []).map((c) => (typeof c === 'string' ? { key: c, label: c } : c)),
    [raw]
  );

  const selectedKeys = useMemo(() => normalized.map((c) => c.key), [normalized]);
console.log('selectedKeys in results', selectedKeys);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [query, setQuery] = useState<QueryState>({
    pageIndex: 0,
    pageSize: 10,
    sorting: [],
    filters: [],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!selectedKeys.length) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/plants-programmes/rows/`, {
          params: { columns: selectedKeys.join(','), page_size: 200 },
        });

        const results = Array.isArray(data) ? data : (data.results ?? []);
        const count: number = results.data?.count ?? results.length;

        if (!cancelled) {
          setRows(results);
          setRowCount(count);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.detail || 'Error loading data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedKeys, api]);

  const columnDefs = useMemo<MRT_ColumnDef<Row>[]>(() => {
    return normalized.map(({ key, label }) => ({
      accessorKey: String(key),
      header: String(label ?? key),
      size: 200,
    }));
  }, [normalized]);

  console.log('columnDefs', columnDefs);
  

  if (!normalized.length) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="medium">No columns detected</Typography>
      </Box>
    );
  }

  const handleCreate = () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};
  const canCreate = hasPermission?.('users.edit_users') ?? false;

  return (
    <Box className="selectedColumnsContainer">
      <Typography variant="h3">{t('selectedData')}</Typography>
      <Typography variant="subH6">{`${t('selectedColumns')} ${columnDefs.map(col => col.header).join(', ')}`}</Typography>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <Box className="tableContainer">
          <DFTable<Row>
            // title="Results Page"
            columns={columnDefs}
            data={rows}
            loading={loading}
            rowCount={rowCount}
            query={query}
            onQueryChange={setQuery}
            onCreate={canCreate ? handleCreate : undefined}
            onEditRow={canCreate ? handleEdit : undefined}
            onDeleteRow={canCreate ? handleDelete : undefined}
            // getRowId={(r) => r.id}
            actionsPosition="last"
            createLabel={t('create')}
            editLabel={t('edit')}
            deleteLabel={t('delete')}
            getRowActions={(row) => [
              {
                id: 'view',
                label: t('view'),
                icon: <Visibility />,
                // onClick: () => openUserProfile(row.id),
              },
            ]}
          />
        </Box>
      )}
    </Box>
  );
};

export default ResultsTable;
