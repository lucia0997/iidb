import { Typography } from '@airbus/components-react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CreateTechnologyForm } from './CreateTechnologyForm';
import { ColorVariants } from '../../constants';
import './createDB.css';

const CreateTechnologyPage = () => {
  const { t } = useTranslation('create_db');

  return (
    <Box 
      className="createDBContainer" 
      sx={{ 
        backgroundColor: ColorVariants.technology.clear,
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
        {t('createTechnology')}
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
        }}
      >
        <CreateTechnologyForm />
      </Box>
    </Box>
  );
};

export default CreateTechnologyPage;

