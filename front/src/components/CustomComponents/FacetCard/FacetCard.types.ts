export type FacetOption = { id: string; label: string };

export type FacetCardProps = {
    title: string;
    color?: string;
    options: FacetOption[];
    value: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
}
