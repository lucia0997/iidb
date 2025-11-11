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
        let alive = true;
        (async () => {
            try {
                setError(null);
                setLoading(true);
                const [colsRes, rowRes] = await Promise.all([
                    fetch(`${apiBase}/plants-programmes/columns`),
                    fetch(`${apiBase}/plants-programmes/rows/${rowId}`)
                ]);
                if (!colsRes.ok) throw new Error("Error fetching columns");
                if (!rowRes.ok) throw new Error("Error fetching rows");

            }
        })
    })

  return <div>RowDetailDrawer</div>;
};

export default RowDetailDrawer;
