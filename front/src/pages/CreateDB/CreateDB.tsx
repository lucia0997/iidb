import { Button, Typography } from '@airbus/components-react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableColors, TableColorsHover } from '../../constants';
import './createDB.css';

const CreateDB = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('create_db');

  return (
    <Box className="createDBContainer">
      <Typography variant="h2" align="center" style={{ marginBottom: '32px' }}>
        {t('title')}
      </Typography>
      
      <Box className="createDBSection" sx={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Typography variant="h3" style={{ marginBottom: '24px' }}>
          {t('selectTable')}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
          <Box
            component="button"
            onClick={() => navigate('/create-database/technology')}
            sx={{
              minWidth: '200px',
              padding: '16px 32px',
              backgroundColor: TableColors.technologies,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: TableColorsHover.technologies,
              },
            }}
          >
            {t('technologies')}
          </Box>
          
          <Box
            component="button"
            disabled
            sx={{
              minWidth: '200px',
              padding: '16px 32px',
              backgroundColor: TableColors.strategies,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
              fontSize: '16px',
              fontWeight: 500,
              opacity: 0.6,
            }}
          >
            {t('strategies')}
          </Box>
          
          <Box
            component="button"
            disabled
            sx={{
              minWidth: '200px',
              padding: '16px 32px',
              backgroundColor: TableColors.processes,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
              fontSize: '16px',
              fontWeight: 500,
              opacity: 0.6,
            }}
          >
            {t('processes')}
          </Box>
          
          <Box
            component="button"
            disabled
            sx={{
              minWidth: '200px',
              padding: '16px 32px',
              backgroundColor: TableColors.projects,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
              fontSize: '16px',
              fontWeight: 500,
              opacity: 0.6,
            }}
          >
            {t('projects')}
          </Box>
          
          <Box
            component="button"
            disabled
            sx={{
              minWidth: '200px',
              padding: '16px 32px',
              backgroundColor: TableColors.plantProgrammes,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
              fontSize: '16px',
              fontWeight: 500,
              opacity: 0.6,
            }}
          >
            {t('plantProgrammes')}
          </Box>
        </Box>
        
        <Box sx={{ marginTop: '32px' }}>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            {t('backToMainMenu')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateDB;