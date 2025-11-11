export type ColumnMeta = { key: string; label: string; type?: string };

export type RowDetailDrawerProps = {
    open: boolean;
    onClose: () => void;
    rowId: number | string | null;
    apiBase?: string;
}