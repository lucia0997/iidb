export type FacetOption = { id: string; label: string };

export type FacetCardProps = {
    title: string;
    options: FacetOption[];
    value: string[];
    onChange: (next: string[]) => void;
    subtitle?: string;
    disabled?: boolean;
}
