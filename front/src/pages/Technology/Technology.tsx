import { Typography } from '@airbus/components-react';

import './technology.css';
import FilterCard from '../../components/FilterCard/FilterCard';
import { useCallback, useState } from 'react';
import { Option } from '../../components/FilterCard/FilterCard.types';
import { useApiClient } from '@df/utils';

const plantas = ['Getafe', 'Tablada']

const Technology = () => {
  const api = useApiClient();
  const [plants, setPlants] = useState<Option[]>([]);

  const fetchProgrammeOptions = useCallback(async (q: string) => {
    const { data } = await api.get('/programme-options', { params: q ? { q } : {} });
    const list = Array.isArray(data) ? data : (data.results ?? []);
    return list.map((x: any) => ({ id: String(x.id ?? x.slug), label: String(x.label ?? x.name) }));
  }, []);

  const fetchProgrammesOptions = useCallback(async (q: string) => {
    // Simulamos una llamada a API (puedes dejar el delay si quieres)
    await new Promise((res) => setTimeout(res, 300));
  
    const plantas = ['Getafe', 'Tablada', 'Illescas', 'San Pablo'];
    
    // Filtra por texto si el usuario escribe algo
    const filtered = q
      ? plantas.filter((p) => p.toLowerCase().includes(q.toLowerCase()))
      : plantas;
  
    return filtered.map((label, i) => ({ id: String(i + 1), label }));
  }, []);

  const fetchPlantsOptions = useCallback(async (q: string) => {
    try {
      const { data } = await api.get('/programme-options', { params: q ? { q } : {} });
      const list = Array.isArray(data) ? data : (data.results ?? []);
      if (!list.length) throw new Error('No data'); // fuerza fallback si no hay datos
      return list.map((x: any) => ({ id: String(x.id ?? x.slug), label: String(x.label ?? x.name) }));
    } catch (error) {
      console.warn('⚠️ usando datos fake de plantas');
      const plantas = ['Getafe', 'Tablada', 'Illescas', 'Puerto Real', 'Sevilla'];
      const filtered = q
        ? plantas.filter((p) => p.toLowerCase().includes(q.toLowerCase()))
        : plantas;
      return filtered.map((label, i) => ({ id: String(i + 1), label }));
    }
  }, []);
  return (
    <div className="technologyContainer">
      <div>
        <Typography variant="h2">Technology Roadmapping</Typography>
      </div>
      <div className="technologyContent">
        <div className="technologyMap">Europe Map</div>
        <div className="technologyFilters">
          <FilterCard
            title="Plants"
            subtitle="<Plants>"
            colorTitle='#8d1a8c'
            value={plants}
            onChange={setPlants}
            fetchOptions={fetchPlantsOptions}
            allowCreate
          />
          <FilterCard
            title="Programmes"
            subtitle="<Programmes>"
            colorTitle='#8d1a8c'
            value={plants}
            onChange={setPlants}
            fetchOptions={fetchProgrammeOptions}
            allowCreate
          />
        </div>
      </div>
    </div>
  );
};

export default Technology;
