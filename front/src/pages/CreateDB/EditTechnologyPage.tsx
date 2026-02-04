import { Typography, FormControl, Select, Button } from '@airbus/components-react';
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        marginBottom: '16px',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto 16px auto',
      }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/create-database/technology')}
          disabled={loading || loadingList}
          sx={{
            color: ColorVariants.technology.text,
            '&:hover': {
              backgroundColor: ColorVariants.technology.light,
            },
          }}
        >
          Back to Technology Operations
        </Button>
      </Box>
      
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <Typography variant="h3" sx={{ color: ColorVariants.technology.text, fontWeight: 500, textAlign: 'center' }}>
              Select Technology to Edit
            </Typography>
            
            <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <FormControl 
                label="Technology" 
                required
                sx={{ width: '100%' }}
              >
                <Select
                  value={selectedTechnologyId}
                  onChange={(event: any) => {
                    // El Select de Airbus Components pasa el evento sintético
                    // El valor está en event.target.value
                    let id = '';
                    
                    if (event?.target?.value !== undefined && event?.target?.value !== null) {
                      id = String(event.target.value);
                    } else if (typeof event === 'string') {
                      id = event;
                    } else if (event?.value !== undefined) {
                      id = String(event.value);
                    }
                    
                    // Limpiar y validar
                    id = id.trim();
                    if (id === '[object Object]' || id === 'undefined' || id === 'null' || id === '') {
                      id = '';
                    }
                    
                    setSelectedTechnologyId(id);
                  }}
                  options={technologiesList.map((tech) => ({
                    value: String(tech.id),
                    label: tech.technology_name,
                  }))}
                  loading={loadingList}
                  placeholder={loadingList ? 'Loading technologies...' : 'Select a technology'}
                />
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%', maxWidth: '800px', margin: '0 auto', alignItems: 'center' }}>
              <Button
                variant="primary"
                onClick={() => {
                  // Validar que el ID sea válido antes de navegar
                  let validId = selectedTechnologyId;
                  
                  // Si es un objeto, intentar extraer el value
                  if (validId && typeof validId === 'object') {
                    const obj = validId as any;
                    validId = obj.value || obj.id || String(obj.value || obj.id || '');
                  }
                  
                  // Convertir a string y limpiar
                  validId = String(validId || '').trim();
                  
                  // Validar que no sea un valor inválido
                  if (validId && 
                      validId !== '' && 
                      validId !== 'undefined' && 
                      validId !== 'null' && 
                      validId !== '[object Object]' &&
                      !isNaN(Number(validId))) {
                    navigate(`/create-database/technology/edit/${validId}`);
                  }
                }}
                disabled={!selectedTechnologyId || 
                         selectedTechnologyId === '' || 
                         String(selectedTechnologyId) === '[object Object]' ||
                         loadingList}
                sx={{
                  minWidth: '200px',
                  padding: '12px 24px',
                }}
              >
                Edit Technology
              </Button>
            </Box>

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
