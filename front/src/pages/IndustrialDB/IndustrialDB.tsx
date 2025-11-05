import { Box } from '@mui/material';
import { Button, Typography } from '@airbus/components-react';
import { useCallback, useMemo, useState } from 'react';
import PlantsProgrammes from '../../components/Features/PlantsProgrammes/PlantsProgrammes';
import { useNavigate } from 'react-router-dom';
import './industrialDB.css';
import { FacetKey, FacetState } from './IndustrialDB.types';


const ROOT = import.meta.env.VITE_ROOT_PATH ?? '';

const IndustrialDB = () => {
  const navigate = useNavigate();

  const [facets, setFacets] = useState<FacetState>({
    plants_programme: [],
    technologies: [],
    strategy: [],
    projects: [],
    processes: [],
  });

  const setFacet = useCallback(
    (key: FacetKey) => (next: string[]) => setFacets((s) => ({ ...s, [key]: next })),
    []
  );

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
  }, []);
  const reset = clearAll;

  const canApply = selectedCount > 0;

  const handleApply = useCallback(() => {
    if (!canApply) return;

    const params = new URLSearchParams();
    params.set('columns', selectedKeys.join(','));

    navigate(`${ROOT}/industrial-database/view?${params.toString()}`, {
      state: { columns: selectedKeys },
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
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} />
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} />
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} />
          <PlantsProgrammes value={facets.plants_programme} onChange={setFacet('plants_programme')} />
          {/* <PlantsProgrammes value={selectedColumns} onChange={setSelectedColumns} /> */}
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
