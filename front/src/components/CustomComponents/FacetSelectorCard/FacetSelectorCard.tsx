import { useEffect, useMemo } from 'react';
import { FacetSelectorCardProps } from './FacetSelectorCard.types';
import { FacetCard } from '../FacetCard';

const FacetSelectorCard = ({
  title,
  value,
  onChange,
  disabled,
  onLabels,
  useOptionsHook,
}: FacetSelectorCardProps) => {
    
  const { data, isLoading, isError } = useOptionsHook();

  const options = useMemo(() => (data ?? []).map((o) => ({ id: o.key, label: o.label })), [data]);

  useEffect(() => {
    if (!onLabels) return;
    const map = Object.fromEntries(options.map((o) => [o.id, o.label]));
    onLabels(map);
  }, [onLabels, options]);

  return (
    <FacetCard
      title={title}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled || isLoading}
    />
  );
};

export default FacetSelectorCard;
