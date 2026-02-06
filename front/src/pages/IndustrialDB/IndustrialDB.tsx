import { Box, Tooltip } from '@mui/material';
import { Button, IconButton, Typography } from '@airbus/components-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './industrialDB.css';
import { FacetConfig, FacetKey, FacetState, SelectedByTable } from './IndustrialDB.types';
import { useProgrammeOptions } from '../../hooks/PlantsProgrammes/useProgrammeOptions';
import { FacetSelectorCard } from '../../components/CustomComponents/FacetSelectorCard';
import { useTechnologies } from '../../hooks/Technologies/useTechnologies';
import { useProcessesOptions } from '../../hooks/Processes/useProcessesOptions';
import { useProjectsOptions } from '../../hooks/Projects/useProjectsOptions';
import { useStrategiesOptions } from '../../hooks/Strategies/useStrategiesOptions';
import { ClearAll } from '@mui/icons-material';

const IndustrialDB = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('industrial_db');

  const FACETS_CONFIG: FacetConfig[] = [
    {
      key: 'plants_programme',
      title: t('plantsProgrammes'),
      useOptionsHook: useProgrammeOptions,
      color: '#a51890',
    },
    {
      key: 'technologies',
      title: t('technologies'),
      useOptionsHook: useTechnologies,
      color: '#e4022b',
    },
    {
      key: 'processes',
      title: t('processes'),
      useOptionsHook: useProcessesOptions,
      color: '#0285ad',
    },
    {
      key: 'projects',
      title: t('projects'),
      useOptionsHook: useProjectsOptions,
      color: '#ffbf00',
    },
    {
      key: 'strategies',
      title: t('strategies'),
      useOptionsHook: useStrategiesOptions,
      color: '#83be00',
    },
  ];

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
      const facetConfig = FACETS_CONFIG.find((f) => f.key === tableKey);

      acc[tableKey] = {
        title: facetConfig?.title ?? tableKey,
        columns: facets[tableKey].map((colKey) => ({
          key: colKey,
          label: labelMap[colKey] ?? colKey,
        })),
      };
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
    () => (selectedCount === 1 ? t('parameterSelected', { count: selectedCount }) : t('parametersSelected', { count: selectedCount })),
    [selectedCount, t]
  );

  return (
    <Box className="industrialDBContainer">
      <Typography variant="h2" align="center">
        {t('title')}
      </Typography>

      <Box className="infoContainer">
        <Typography variant="h6" className="tableSelect">
          {t('selectParametersToVisualize')}
        </Typography>
        {selectedCount > 0 ? (
          <Box className="headerInfo">
            <Typography variant="large" style={{ color: 'green' }}>
              {headerInfo}
            </Typography>
            <Tooltip
              title={t('clearAll')}
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
              {t('applyFilters')}
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
          {t('reset')}
        </Button>
        <Button type="button" onClick={handleApply} disabled={!canApply} className="applyBtn">
          {t('applyFilters')}
        </Button>
      </Box>
    </Box>
  );
};

export default IndustrialDB;
