import { Typography } from '@airbus/components-react';
import { useApiClient } from '@df/utils';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './resultsTable.css';
import { DFTable } from '@df/ui';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef } from 'material-react-table';
import { ColState, Row } from './ResultTable.types';

const ResultsTable = () => {
  const { i18n, t } = useTranslation();
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

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        if (!cancelled) setRows(results);
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

  if (!normalized.length) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="medium">No columns detected</Typography>
      </Box>
    );
  }

  return (
    <Box className="selectedColumnsContainer">
      <Typography variant="h3">Selected data</Typography>
      <Typography variant="h6">Columns: {selectedKeys.join(', ')}</Typography>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <Box className="tableContainer">
          <DFTable<Row> title="Results Page" columns={columnDefs} data={rows} />
        </Box>
      )}
    </Box>
  );
};

export default ResultsTable;
