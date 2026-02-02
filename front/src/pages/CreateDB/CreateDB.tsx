import { Typography } from '@airbus/components-react';
import { Box } from '@mui/material';
import { CreateTechnologyForm } from './CreateTechnologyForm';
import './createDB.css';

const CreateDB = () => {
  return (
    <Box className="createDBContainer">
      <Typography variant="h2" align="center" style={{ marginBottom: '32px' }}>
        Industrial Database Create
      </Typography>
      
      <Box className="createDBSection">
        <Typography variant="h3" style={{ marginBottom: '24px' }}>
          Create Technology
        </Typography>
        <CreateTechnologyForm />
      </Box>
    </Box>
  );
};

export default CreateDB;