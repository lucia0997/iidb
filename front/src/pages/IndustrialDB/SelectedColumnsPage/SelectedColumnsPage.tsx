import { Typography } from "@airbus/components-react";
import { useApiClient } from "@df/utils";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import './selectedColumnsPage.css'

type Row = Record<string, unknown>;

const SelectedColumnsPage = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const api = useApiClient();
    const stateColumns: string[] | undefined = (location.state as any)?.columns;

    const columns = useMemo(() => {
        const qs = searchParams.get('columns');
        if (stateColumns && stateColumns.length) return stateColumns;
        if (qs) return qs.split(',').map(s => s.trim()).filter(Boolean);
        return []
    }, [searchParams, stateColumns]);

    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!columns.length) return;
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get(`/plants-programmes/rows/`, {
                    params: { columns: columns.join(','), page_size: 200},
                });
                const results = Array.isArray(data) ? data : data.results ?? [];
                if (!cancelled) setRows(results)
            } catch (e: any) {
                if (!cancelled) setError(e?.response?.data?.detail || 'Error loading data')
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        }
    }, [columns]);

    if (!columns.length) {
        return (
            <Box sx={{ p: 6}}>
                <Typography variant="medium">No columns detected</Typography>
            </Box>
        )
    }

  return (
    <Box className='selectedColumnsContainer'>
    <Typography variant="h3">
        Selected data
    </Typography>
    <Typography variant="h6">
        Columns: {columns.join(', ')}
    </Typography>
    {loading && <p>Loading...</p>}
    {error && <p>{error}</p>}

    {!loading && !error && (
        <Box className='tableContainer'>
            <table>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, idx) => (
                        <tr key={(r.id as string) ?? idx}>
                            {columns.map(col => (
                    <td key={col} className="px-4 py-2 text-slate-800">
                      {String(r[col] ?? '')}
                    </td>
                  ))}
                        </tr>
                    ))}
                    {!rows.length && (
                        <tr>
                            <td>
                                No data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </Box>
    )}
    </Box>
  )
}

export default SelectedColumnsPage