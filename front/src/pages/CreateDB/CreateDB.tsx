import { Button, Typography } from '@airbus/components-react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TableColors, TableColorsHover } from '../../constants';
import './createDB.css';

const CreateDB = () => {
  const navigate = useNavigate();

  return (
    <Box className="createDBContainer">
      <Typography variant="h2" align="center" style={{ marginBottom: '32px' }}>
        Industrial Database Operations
      </Typography>
      
      <Box className="createDBSection" sx={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Typography variant="h3" style={{ marginBottom: '24px' }}>
          Select a table
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
            Technologies
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
            Strategies
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
            Processes
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
            Projects
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
            Plant Programmes
          </Box>
        </Box>
        
        <Box sx={{ marginTop: '32px' }}>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Back to Main Menu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateDB;