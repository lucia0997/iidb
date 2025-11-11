import { useEffect, useMemo, useState } from 'react';
import { ColumnMeta, RowDetailDrawerProps } from './RowDetailDrawer.types';

//TODO: review let use

const RowDetailDrawer = ({ open, onClose, rowId, apiBase = '' }: RowDetailDrawerProps) => {
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState<ColumnMeta[]>([]);
    const [data, setData] = useState<Record<string, unknown> | null>(null);
    const [error, setError] = useState<string | null>(null);

    const labelByKey = useMemo(() => {
        const map = new Map<string, string>();
        columns.forEach(col => map.set(col.key, col.label || col.key));
        return map;
    }, [columns]);

    useEffect(() => {
        if (!open || rowId == null) return;
        let alive = true
    })

  return <div>RowDetailDrawer</div>;
};

export default RowDetailDrawer;
