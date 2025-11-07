export type ColumnOptionKey = 'technology_name' | 'program' | 'business' | 'site';

export type ColumnOptionDTO = { key: ColumnOptionKey; label: string };

export type PlantsProgrammesProps = {
    value: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    title?: string;
    subtitle?: string;
    onLabels?: (map: Record<string, string>) => void;
}