import { useMemo } from "react";
import { useProgrammeOptions } from "../../../hooks/PlantsProgrammes/useProgrammeOptions"
import { PlantsProgrammesProps } from "./PlantsProgrammes.types"
import { FacetCard } from "../../CustomComponents/FacetCard";

const PlantsProgrammes = ({
    value,
    onChange,
    disabled,
    title = 'Plants/Programmes',
    // subtitle = 'Select the columns to display'
}: PlantsProgrammesProps) => {

    const { data, isLoading, isError } = useProgrammeOptions();

    const options = useMemo(
        () => (data ?? []).map((o) => ({ id: o.key, label: o.label})),
        [data]
    );

  return (
    <FacetCard 
        title={title}
        // subtitle={isLoading ? 'Loading...' : (isError ? 'Could not load options' : subtitle)}
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled || isLoading}
    />
  )
}

export default PlantsProgrammes