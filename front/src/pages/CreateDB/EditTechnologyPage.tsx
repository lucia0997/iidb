import { Typography } from '@airbus/components-react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import './createDB.css';

const EditTechnologyPage = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <Box className="createDBContainer">
      <Typography variant="h2" align="center" style={{ marginBottom: '32px' }}>
        Modificar Tecnología
      </Typography>
      
      <Box className="createDBSection">
        <Typography variant="h3" style={{ marginBottom: '24px' }}>
          {id ? `Editar Tecnología ID: ${id}` : 'Seleccionar Tecnología para Editar'}
        </Typography>
        <Typography variant="medium">
          Esta funcionalidad estará disponible próximamente.
        </Typography>
      </Box>
    </Box>
  );
};

export default EditTechnologyPage;
