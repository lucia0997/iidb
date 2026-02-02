import { Typography, FormControl, Select } from '@airbus/components-react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApiClient } from '@df/utils';
import { getTechnology, getTechnologiesList, TechnologyListItem } from '../../services/TechnologiesService/technologies.service';
import { CreateTechnologyForm } from './CreateTechnologyForm';
import { ColorVariants } from '../../constants';
import './createDB.css';

const EditTechnologyPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const api = useApiClient();
  const [technologyName, setTechnologyName] = useState<string>('');
  const [loading, setLoading] = useState(!!id);
  const [technologiesList, setTechnologiesList] = useState<TechnologyListItem[]>([]);
  const [loadingList, setLoadingList] = useState(!id);
  const [selectedTechnologyId, setSelectedTechnologyId] = useState<string>(id || '');

  // Cargar lista de tecnologías cuando no hay ID
  useEffect(() => {
    if (!id) {
      const loadTechnologiesList = async () => {
        try {
          setLoadingList(true);
          const list = await getTechnologiesList(api);
          setTechnologiesList(list);
        } catch (err: any) {
          console.error('Error loading technologies list:', err);
          const errorMessage = err.response?.data?.detail || err.message || 'Error loading technologies list';
          console.error('Error details:', errorMessage);
        } finally {
          setLoadingList(false);
        }
      };
      loadTechnologiesList();
    }
  }, [id, api]);

  // Cargar nombre de tecnología cuando hay ID
  useEffect(() => {
    if (id) {
      const loadTechnology = async () => {
        try {
          setLoading(true);
          const technology = await getTechnology(api, id);
          setTechnologyName(technology.technology_name || '');
        } catch (err) {
          console.error('Error loading technology:', err);
        } finally {
          setLoading(false);
        }
      };
      loadTechnology();
    }
  }, [id, api]);

  const handleTechnologySelect = (value: any) => {
    // El Select puede pasar el objeto completo o el valor, manejamos ambos casos
    const technologyId = typeof value === 'string' ? value : (value?.value || value?.id || String(value));
    setSelectedTechnologyId(technologyId);
    if (technologyId && technologyId !== '') {
      navigate(`/create-database/technology/edit/${technologyId}`);
    }
  };

  return (
    <Box 
      className="createDBContainer" 
      sx={{ 
        backgroundColor: ColorVariants.technology.clear,
        minHeight: '100vh',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography 
        variant="h2" 
        align="center" 
        sx={{ 
          marginBottom: '32px',
          color: ColorVariants.technology.text,
          fontWeight: 600,
        }}
      >
        {loading ? 'Loading...' : (id && technologyName ? `Edit Technology: ${technologyName}` : (id ? 'Edit Technology' : 'Select Technology to Edit'))}
      </Typography>
      
      <Box 
        className="createDBSection" 
        sx={{ 
          backgroundColor: 'white',
          border: `2px solid ${ColorVariants.technology.main}`,
          borderRadius: '8px',
          boxShadow: `0 4px 12px rgba(0, 174, 199, 0.2)`,
          margin: '0 auto',
          maxWidth: '900px',
          width: '100%',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        {id ? (
          <CreateTechnologyForm technologyId={id} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ color: ColorVariants.technology.text, fontWeight: 500 }}>
              Select Technology to Edit
            </Typography>
            
            <FormControl 
              label="Technology" 
              required
              sx={{ width: '100%', maxWidth: '800px' }}
            >
              <Select
                value={selectedTechnologyId}
                onChange={(value) => handleTechnologySelect(value as string)}
                options={technologiesList.map((tech) => ({
                  value: String(tech.id),
                  label: tech.technology_name,
                }))}
                loading={loadingList}
                placeholder={loadingList ? 'Loading technologies...' : 'Select a technology'}
              />
            </FormControl>

            {technologiesList.length === 0 && !loadingList && (
              <Typography variant="medium" sx={{ color: ColorVariants.technology.text, opacity: 0.7 }}>
                No technologies available to edit.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EditTechnologyPage;
