import { Box } from '@mui/material';
import { Button, Typography } from '@airbus/components-react';
import { useCallback, useMemo, useState } from 'react';
import PlantsProgrammes from '../../components/Features/PlantsProgrammes/PlantsProgrammes';
import { useNavigate } from 'react-router-dom';
import './industrialDB.css';
import { FacetConfig, FacetKey, FacetState, SelectedByTable } from './IndustrialDB.types';
import { useProgrammeOptions } from '../../hooks/PlantsProgrammes/useProgrammeOptions';
import { FacetSelectorCard } from '../../components/CustomComponents/FacetSelectorCard';
import { useTechnologies } from '../../hooks/Technologies/useTechnologies';

const FACETS_CONFIG: FacetConfig[] = [
  {
    key: 'plants_programme',
    title: 'Plants / Programmes',
    useOptionsHook: useProgrammeOptions
  },
  {
    key: 'technologies',
    title: 'Technologies',
    useOptionsHook: useTechnologies
  },
]

const IndustrialDB = () => {
  const navigate = useNavigate();

  const [facets, setFacets] = useState<FacetState>({
    plants_programme: [],
    technologies: [],
    strategy: [],
    projects: [],
    processes: [],
  });

  const [labelMap, setLabelMap] = useState<Record<string, string>>({});

  const setFacet = useCallback(
    (key: FacetKey) => (next: string[]) => setFacets((s) => ({ ...s, [key]: next })),
    []
  );

  const onLabels = useCallback((map: Record<string, string>) => {
    setLabelMap((prev) => ({ ...prev, ...map }))
  }, [])

  const selectedKeys = useMemo(() => {
    const all = Object.values(facets).flat();
    return Array.from(new Set(all));
  }, [facets]);

  const selectedCount = selectedKeys.length;

  console.log('selectedKeys', selectedKeys);

  const clearAll = useCallback(() => {
    setFacets({
      plants_programme: [],
      technologies: [],
      strategy: [],
      projects: [],
      processes: [],
    });
    setLabelMap({});
  }, []);
  const reset = clearAll;

  const canApply = selectedCount > 0;

  const handleApply = useCallback(() => {
    if (!canApply) return;

    const selectedByTable = (Object.keys(facets) as FacetKey[]).reduce((acc, tableKey) => {
       acc[tableKey] = facets[tableKey].map((key) => ({
        key,
        label: labelMap[key] ?? key,
       }));
       return acc;
    }, {} as SelectedByTable)

    console.log('selectedByTable', selectedByTable);
    

    const params = new URLSearchParams();
    params.set('columns', selectedKeys.join(','));

    const columnsState = selectedKeys.map((key) => ({
      key,
      label: labelMap[key] ?? key,
    }))

    navigate(`/industrial-database/view?${params}`, {
      // state: { columns: columnsState },
      state: {selectedByTable },
      replace: false,
    });
  }, [canApply, navigate, selectedKeys]);

  const headerInfo = useMemo(
    () => (selectedCount === 1 ? '1 parameter selected' : `${selectedCount} parameters selected`),
    [selectedCount]
  );

  return (
    <Box className="industrialDBContainer">
      <Typography variant="h2" align="center">
        Industrial Database Mapping
      </Typography>

      <Box className="infoContainer">
        <Typography variant="h6" className="tableSelect">
          Select Parameters to be visualized:
        </Typography>
        <Box className="headerInfo">
          <span>{headerInfo}</span>
          <Button type="button" onClick={clearAll} className="clearAllBtn">
            Clear all
          </Button>
        </Box>
        <Box
          className=""
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 2.5,
          }}
        >
          {FACETS_CONFIG.map((facet) => (
            <FacetSelectorCard
              key={facet.key}
              title={facet.title}
              value={facets[facet.key]}
              onChange={setFacet(facet.key)}
              onLabels={onLabels}
              useOptionsHook={facet.useOptionsHook}
            />
          ))}
          {/* <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} onLabels={onLabels}/>
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} onLabels={onLabels}/>
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} onLabels={onLabels}/>
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} onLabels={onLabels}/> */}
        </Box>
      </Box>
      <Box className="footerBtns">
        <Button type="button" onClick={reset} className="resetBtn">
          Reset
        </Button>
        <Button type="button" onClick={handleApply} disabled={!canApply} className="applyBtn">
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default IndustrialDB;