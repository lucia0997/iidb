export type Option = { id: string; label: string };

export type FilterCardProps = {
    title: string;
    subtitle?: string;
    value: Option[];
    onChange: (next: Option[]) => void;
    fetchOptions: (q: string) => Promise<Option[]>;
    allowCreate?: boolean;
    placeholder?: string;
    colorTitle: string
}