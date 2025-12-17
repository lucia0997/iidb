import { useEffect, useMemo, useState } from 'react';
import { ColumnMeta, RowDetailDrawerProps } from './RowDetailDrawer.types';
import { Button, Chip, Divider, Drawer, IconButton, Typography } from '@airbus/components-react';
import { Box, CircularProgress, Grid, Stack } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import './rowDetailDrawer.css'
import { useApiClient } from '@df/utils';
import { getProgrammeOptions, getProgrammeRowDetail } from '../../../services/ProgrammeService/programmes.service';

//TODO: review let use

const RowDetailDrawer = ({ open, onClose, rowId }: RowDetailDrawerProps) => {
    const api = useApiClient()
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnMeta[]>([]);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labelByKey = useMemo(() => {
    const map = new Map<string, string>();
    columns.forEach((col) => map.set(col.key, col.label || col.key));
    return map;
  }, [columns]);

  useEffect(() => {
    if (!open || rowId == null) return;
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const [colsRes, rowDetail] = await Promise.all([
          getProgrammeOptions(api),
          // api.get<ColumnMeta[]>("/plants-programmes/columns/"),
          // api.get<Record<string, unknown>>(`/plants-programmes/rows/${rowId}/`),
          getProgrammeRowDetail(api, rowId)
        ]);
        if (!alive) return;
        setColumns(colsRes);
        setData(rowDetail);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? 'Unknown error');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, rowId, api]);

  const entries = useMemo(() => {
    if (!data) return [];
    const knownOrder = columns.map((col) => col.key);
    const keys = Array.from(new Set(['id', ...knownOrder, ...Object.keys(data)]));
    return keys
      .filter((k) => k in data)
      .map((k) => ({ key: k, label: labelByKey.get(k) ?? k, value: (data as any)[k] }));
  }, [data, columns, labelByKey]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} className="drawerContainer">
      <Box className="drawerBox">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Detalle de Fila</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <Divider className='drawerDivider' />

        {loading && (
            <Stack alignItems='center' justifyContent='center' sx={{ py: 6 }}>
                <CircularProgress />
            </Stack>
        )}

        {error && (
            <Typography color='tertiary' variant='xsmall'>{error}</Typography>
        )}

        {!loading && !error && data && (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Grid container spacing={2}>
                    {entries.map(({ key, label, value}) => (
                        <Grid key={key}>
                            <Typography variant='medium' className='drawerLabel'>
                                {label}
                            </Typography>
                            <ValueRender value={value} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )}
        <Divider className='drawerDivider' />
        <Stack direction='row' justifyContent='flex-end' gap={1}>
            <Button onClick={onClose}>Cerrar</Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default RowDetailDrawer;

function ValueRender({value}: {value: unknown}) {
    if (value == null || value === '') {
        return <Typography variant='medium'>-</Typography>
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return <Typography variant='medium'>-</Typography>;
        return (
            <Stack direction='row' flexWrap='wrap' gap={1} sx={{ mt: 0.5}}>
                {value.map((v, i) => (
                    <Chip key={i} label={String(v ?? "-")} size='small' />
                ))}
            </Stack>
        )
    }
    if (typeof value === 'object') {
        return (
            <Box component='pre' sx={{ whiteSpace: 'pre-wrap', fontSize: 12, p: 1, borderRadius: 1, bgcolor: '#000'}}>
                {JSON.stringify(value, null, 2)}
            </Box>
        )
    }
    return <Typography variant='medium'>{String(value)}</Typography>
}
