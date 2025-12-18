import { Box, Tooltip } from '@mui/material';
import { Button, IconButton, Typography } from '@airbus/components-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './industrialDB.css';
import { FacetConfig, FacetKey, FacetState, SelectedByTable } from './IndustrialDB.types';
import { useProgrammeOptions } from '../../hooks/PlantsProgrammes/useProgrammeOptions';
import { FacetSelectorCard } from '../../components/CustomComponents/FacetSelectorCard';
import { useTechnologies } from '../../hooks/Technologies/useTechnologies';
import { useProcessesOptions } from '../../hooks/Processes/useProcessesOptions';
import { useProjectsOptions } from '../../hooks/Projects/useProjectsOptions';
import { useStrategiesOptions } from '../../hooks/Strategies/useStrategiesOptions';
import { ClearAll } from '@mui/icons-material';

const FACETS_CONFIG: FacetConfig[] = [
  {
    key: 'plants_programme',
    title: 'Plants / Programmes',
    useOptionsHook: useProgrammeOptions,
    color: '#a51890',
  },
  {
    key: 'technologies',
    title: 'Technologies',
    useOptionsHook: useTechnologies,
    color: '#e4022b',
  },
  {
    key: 'processes',
    title: 'Processes',
    useOptionsHook: useProcessesOptions,
    color: '#0285ad',
  },
  {
    key: 'projects',
    title: 'Projects',
    useOptionsHook: useProjectsOptions,
    color: '#ffbf00',
  },
  {
    key: 'strategies',
    title: 'Strategies',
    useOptionsHook: useStrategiesOptions,
    color: '#83be00',
  },
];

const IndustrialDB = () => {
  const navigate = useNavigate();

  const [facets, setFacets] = useState<FacetState>({
    plants_programme: [],
    technologies: [],
    strategies: [],
    projects: [],
    processes: [],
  });

  const [labelMap, setLabelMap] = useState<Record<string, string>>({});

  const setFacet = useCallback(
    (key: FacetKey) => (next: string[]) => setFacets((s) => ({ ...s, [key]: next })),
    []
  );

  const onLabels = useCallback((map: Record<string, string>) => {
    setLabelMap((prev) => ({ ...prev, ...map }));
  }, []);

  const selectedKeys = useMemo(() => {
    const all = Object.values(facets).flat();
    return Array.from(new Set(all));
  }, [facets]);

  const selectedCount = selectedKeys.length;

  const clearAll = useCallback(() => {
    setFacets({
      plants_programme: [],
      technologies: [],
      strategies: [],
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
    }, {} as SelectedByTable);
    console.log('selectedBy', selectedByTable);

    const params = new URLSearchParams();
    params.set('columns', selectedKeys.join(','));

    navigate(`/industrial-database/view?${params}`, {
      state: { selectedByTable },
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
        {selectedCount > 0 ? (
          <Box className="headerInfo">
            <Typography variant="large" style={{ color: 'green' }}>
              {headerInfo}
            </Typography>
            <Tooltip
              title="Clear all"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton size="small" onClick={clearAll}>
                <ClearAll fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button type="button" onClick={handleApply} disabled={!canApply} className="applyBtn">
              Apply Filters
            </Button>
          </Box>
        ) : (
          ''
        )}
        <Box
          className=""
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
              color={facet.color}
            />
          ))}
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
