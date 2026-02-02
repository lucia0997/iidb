import { Button, Typography } from '@airbus/components-react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ActionColors, ActionColorsHover, ColorVariants } from '../../constants';
import './createDB.css';

const TechnologyMenu = () => {
  const navigate = useNavigate();

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
        Technology Operations
      </Typography>
      
      <Box 
        className="createDBSection" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          alignItems: 'center',
          backgroundColor: 'white',
          border: `2px solid ${ColorVariants.technology.main}`,
          borderRadius: '8px',
          boxShadow: `0 4px 12px rgba(0, 174, 199, 0.2)`,
          margin: '0 auto',
          maxWidth: '600px',
          width: '100%',
          padding: '32px',
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            marginBottom: '24px',
            color: ColorVariants.technology.text,
            fontWeight: 500,
          }}
        >
          Select an operation
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
          <Box
            component="button"
            onClick={() => navigate('/create-database/technology/new')}
            sx={{
              width: '100%',
              maxWidth: '300px',
              padding: '16px 32px',
              backgroundColor: ColorVariants.technology.main,
              color: ColorVariants.technology.textLight,
              border: `2px solid ${ColorVariants.technology.dark}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: ColorVariants.technology.dark,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 8px rgba(0, 174, 199, 0.3)`,
              },
            }}
          >
            Create New Technology
          </Box>
          
          <Box
            component="button"
            onClick={() => navigate('/create-database/technology/edit')}
            sx={{
              width: '100%',
              maxWidth: '300px',
              padding: '16px 32px',
              backgroundColor: ActionColors.modify,
              color: 'white',
              border: `2px solid ${ActionColorsHover.modify}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: ActionColorsHover.modify,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 8px rgba(99, 153, 174, 0.3)`,
              },
            }}
          >
            Modify Existing Technology
          </Box>
        </Box>
        
        <Box sx={{ marginTop: '32px' }}>
          <Button
            variant="ghost"
            onClick={() => navigate('/create-database')}
          >
            Back to Database Operations
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TechnologyMenu;

