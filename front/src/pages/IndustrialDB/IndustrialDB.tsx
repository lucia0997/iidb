import { Box } from "@mui/material";
import { FacetCard, FacetOption } from "../../components/FacetCard";
import { Typography } from "@airbus/components-react";
import { useState } from "react";

type FacetKey =
  | 'plant_or_programme'
  | 'plant_location'
  | 'programme'
  | 'status'
  | 'owner';

type FacetState = Record<FacetKey, string[]>;

const IndustrialDB = () => {
   // estado de seleccionados
   const [filters, setFilters] = useState<FacetState>({
    plant_or_programme: [],
    plant_location: [],
    programme: [],
    status: [],
    owner: [],
  });

  // datos FAKE (persisten sólo en memoria)
  const options: Record<FacetKey, FacetOption[]> = {
    plant_or_programme: [
      'Plants/Programmes', 'Plant Location A', 'Plant Location B', 'Programme Alpha', 'Programme Beta',
    ].map((l, i) => ({ id: `pp-${i}`, label: l })),
    plant_location: ['Getafe', 'Tablada', 'Illescas', 'Puerto Real', 'Sevilla']
      .map((l, i) => ({ id: `pl-${i}`, label: l })),
    programme: ['A320', 'A330', 'A350', 'A380']
      .map((l, i) => ({ id: `pr-${i}`, label: l })),
    status: ['Active', 'Paused', 'Archived']
      .map((l, i) => ({ id: `st-${i}`, label: l })),
    owner: ['Team Alpha', 'Team Beta', 'Team Gamma']
      .map((l, i) => ({ id: `ow-${i}`, label: l })),
  };

  return (
    <Box className="technologyContainer">
    <Typography variant="h2" align="center">Technology Roadmapping</Typography>

    <Box className="technologyContent">

      {/* Contenedor de filtros en 2 columnas auto-ajustables */}
      <Box
        className="technologyFilters"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 2.5,
        }}
      >
        <FacetCard
          title="Plants/Programmes"
          options={options.plant_or_programme}
          value={filters.plant_or_programme}
          onChange={(next) => setFilters(s => ({ ...s, plant_or_programme: next }))}
        />
        <FacetCard
          title="Plant Location"
          options={options.plant_location}
          value={filters.plant_location}
          onChange={(next) => setFilters(s => ({ ...s, plant_location: next }))}
        />
        <FacetCard
          title="Programme"
          options={options.programme}
          value={filters.programme}
          onChange={(next) => setFilters(s => ({ ...s, programme: next }))}
        />
        <FacetCard
          title="Status"
          options={options.status}
          value={filters.status}
          onChange={(next) => setFilters(s => ({ ...s, status: next }))}
        />
        <FacetCard
          title="Owner"
          options={options.owner}
          value={filters.owner}
          onChange={(next) => setFilters(s => ({ ...s, owner: next }))}
        />
      </Box>
    </Box>
  </Box>
  )
}

export default IndustrialDB