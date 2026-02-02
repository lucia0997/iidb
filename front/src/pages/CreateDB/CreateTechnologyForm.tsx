import { useState, FormEvent } from 'react';
import { Button, FormControl, Input, Typography } from '@airbus/components-react';
import { Box, TextField, Chip, IconButton } from '@mui/material';
import { Visibility, Close } from '@mui/icons-material';
import { DFModal, DFModalContent, DFModalFooter, DFModalHeader } from '@df/ui';
import { useApiClient } from '@df/utils';
import { useNavigate } from 'react-router-dom';
import { createTechnology, checkTechnologyName, CreateTechnologyPayload, TRLData } from '../../services/TechnologiesService/technologies.service';
import { ColorVariants } from '../../constants';
import './createDB.css';

interface CreateTechnologyFormProps {
  onSuccess?: (technologyId: number) => void;
}

export const CreateTechnologyForm = ({ onSuccess }: CreateTechnologyFormProps) => {
  const api = useApiClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictTechnologyId, setConflictTechnologyId] = useState<number | null>(null);
  const [pendingPayload, setPendingPayload] = useState<CreateTechnologyPayload | null>(null);
  
  // TRL management
  const [trls, setTrls] = useState<TRLData[]>([]);
  const [showTrlModal, setShowTrlModal] = useState(false);
  const [editingTrl, setEditingTrl] = useState<TRLData | null>(null);
  const [trlFormData, setTrlFormData] = useState<TRLData>({
    trl_number: 1,
    trl_year: undefined,
    trl_cost: undefined,
  });
  const [trlModalError, setTrlModalError] = useState<string | null>(null);

  // Campos del formulario
  const [formData, setFormData] = useState<CreateTechnologyPayload>({
    technology_name: '',
    current_trl: 1,
    physical_technology_cluster: '',
    digital_technology_cluster: '',
    product_roadmap: '',
    technology_roadmap: '',
    technology_description: '',
    dependencies: [],
    fom_type: '',
    fom_value_percent: undefined,
    targeted_programmes: [],
    ac_application: '',
  });

  // Campos para listas (se convierten a arrays)
  const [dependenciesText, setDependenciesText] = useState('');
  const [targetedProgrammesText, setTargetedProgrammesText] = useState('');

  const handleInputChange = (field: keyof CreateTechnologyPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const handleNumberChange = (field: keyof CreateTechnologyPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Verificar primero si ya existe una tecnología con ese nombre
      const checkResult = await checkTechnologyName(api, formData.technology_name);
      
      if (checkResult.exists && checkResult.id) {
        // Si existe, preparar el payload y mostrar el modal
        const dependencies = dependenciesText
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        const targetedProgrammes = targetedProgrammesText
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        const payload: CreateTechnologyPayload = {
          technology_name: formData.technology_name,
          current_trl: formData.current_trl,
        };

        if (formData.physical_technology_cluster) {
          payload.physical_technology_cluster = formData.physical_technology_cluster;
        }
        if (formData.digital_technology_cluster) {
          payload.digital_technology_cluster = formData.digital_technology_cluster;
        }
        if (formData.product_roadmap) {
          payload.product_roadmap = formData.product_roadmap;
        }
        if (formData.technology_roadmap) {
          payload.technology_roadmap = formData.technology_roadmap;
        }
        if (formData.technology_description) {
          payload.technology_description = formData.technology_description;
        }
        if (dependencies.length > 0) {
          payload.dependencies = dependencies;
        }
        if (formData.fom_type) {
          payload.fom_type = formData.fom_type;
        }
        if (formData.fom_value_percent !== undefined && formData.fom_value_percent !== null) {
          payload.fom_value_percent = formData.fom_value_percent;
        }
        if (targetedProgrammes.length > 0) {
          payload.targeted_programmes = targetedProgrammes;
        }
        if (formData.ac_application) {
          payload.ac_application = formData.ac_application;
        }
        
        // Add TRLs to payload
        if (trls.length > 0) {
          payload.trls = trls.map(trl => ({
            trl_number: trl.trl_number,
            trl_year: trl.trl_year,
            trl_cost: trl.trl_cost,
          }));
        }

        setPendingPayload(payload);
        setConflictTechnologyId(checkResult.id);
        setShowConflictModal(true);
        setLoading(false);
        return;
      }
      // Convertir campos de texto a arrays
      const dependencies = dependenciesText
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const targetedProgrammes = targetedProgrammesText
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // Limpiar campos undefined y vacíos antes de enviar
      const payload: CreateTechnologyPayload = {
        technology_name: formData.technology_name,
        current_trl: formData.current_trl,
      };

      // Agregar solo campos que tengan valor
      if (formData.physical_technology_cluster) {
        payload.physical_technology_cluster = formData.physical_technology_cluster;
      }
      if (formData.digital_technology_cluster) {
        payload.digital_technology_cluster = formData.digital_technology_cluster;
      }
      if (formData.product_roadmap) {
        payload.product_roadmap = formData.product_roadmap;
      }
      if (formData.technology_roadmap) {
        payload.technology_roadmap = formData.technology_roadmap;
      }
      if (formData.technology_description) {
        payload.technology_description = formData.technology_description;
      }
      if (dependencies.length > 0) {
        payload.dependencies = dependencies;
      }
      if (formData.fom_type) {
        payload.fom_type = formData.fom_type;
      }
      if (formData.fom_value_percent !== undefined && formData.fom_value_percent !== null) {
        payload.fom_value_percent = formData.fom_value_percent;
      }
      if (targetedProgrammes.length > 0) {
        payload.targeted_programmes = targetedProgrammes;
      }
      if (formData.ac_application) {
        payload.ac_application = formData.ac_application;
      }
      
      // Add TRLs to payload
      if (trls.length > 0) {
        payload.trls = trls.map(trl => ({
          trl_number: trl.trl_number,
          trl_year: trl.trl_year,
          trl_cost: trl.trl_cost,
        }));
      }

      const response = await createTechnology(api, payload);

      if (response.created) {
        setSuccess(`Technology created successfully with ID: ${response.id}`);
        // Clear form
        setFormData({
          technology_name: '',
          current_trl: 1,
          physical_technology_cluster: '',
          digital_technology_cluster: '',
          product_roadmap: '',
          technology_roadmap: '',
          technology_description: '',
          dependencies: [],
          fom_type: '',
          fom_value_percent: undefined,
          targeted_programmes: [],
          ac_application: '',
        });
        setDependenciesText('');
        setTargetedProgrammesText('');
        setTrls([]);

        if (onSuccess) {
          onSuccess(response.id);
        }
      } else {
        setSuccess(`Technology already exists with ID: ${response.id}`);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.errors ||
        err.message ||
        'Error creating technology';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleModifyExisting = () => {
    if (conflictTechnologyId) {
      setShowConflictModal(false);
      navigate(`/create-database/technology/edit/${conflictTechnologyId}`);
    }
  };

  const handleRename = () => {
    setShowConflictModal(false);
    setConflictTechnologyId(null);
    setPendingPayload(null);
    // User can modify the name and try again
    setError(`A technology with the name "${formData.technology_name}" already exists. Please modify the name.`);
  };

  // TRL management functions
  const handleOpenTrlModal = (trl?: TRLData) => {
    setTrlModalError(null);
    if (trl) {
      setEditingTrl(trl);
      setTrlFormData(trl);
    } else {
      setEditingTrl(null);
      setTrlFormData({
        trl_number: 1,
        trl_year: undefined,
        trl_cost: undefined,
      });
    }
    setShowTrlModal(true);
  };

  const handleCloseTrlModal = () => {
    setShowTrlModal(false);
    setEditingTrl(null);
    setTrlModalError(null);
    setTrlFormData({
      trl_number: 1,
      trl_year: undefined,
      trl_cost: undefined,
    });
  };

  const handleAddTrl = () => {
    // Validate that TRL Year is provided
    if (!trlFormData.trl_year) {
      setTrlModalError('TRL Year is required. Please provide a year.');
      return;
    }

    // Check if TRL number + year combination already exists (only when adding new, not editing)
    if (!editingTrl) {
      const existingTrl = trls.find(t => 
        t.trl_number === trlFormData.trl_number && 
        t.trl_year === trlFormData.trl_year
      );
      
      if (existingTrl) {
        setTrlModalError(`TRL ${trlFormData.trl_number} for year ${trlFormData.trl_year} already exists. Please edit the existing one or choose a different TRL number/year combination.`);
        return;
      }
    } else {
      // When editing, check if the new combination conflicts with another TRL (excluding the one being edited)
      const conflictingTrl = trls.find(t => 
        t.trl_number === trlFormData.trl_number && 
        t.trl_year === trlFormData.trl_year &&
        !(t.trl_number === editingTrl.trl_number && t.trl_year === editingTrl.trl_year)
      );
      
      if (conflictingTrl) {
        setTrlModalError(`TRL ${trlFormData.trl_number} for year ${trlFormData.trl_year} already exists. Please choose a different TRL number/year combination.`);
        return;
      }
    }

    if (editingTrl) {
      // Update existing TRL - find by original trl_number and trl_year
      setTrls(trls.map(t => 
        t.trl_number === editingTrl.trl_number && t.trl_year === editingTrl.trl_year
          ? trlFormData 
          : t
      ));
    } else {
      // Add new TRL
      setTrls([...trls, trlFormData]);
    }
    
    setTrlModalError(null);
    handleCloseTrlModal();
  };

  const handleDeleteTrl = (trlNumber: number, trlYear?: number) => {
    setTrls(trls.filter(t => !(t.trl_number === trlNumber && t.trl_year === trlYear)));
  };

  return (
    <Box className="createTechnologyContainer" sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Fixed header with back button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', flexShrink: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/create-database/technology')}
          disabled={loading}
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
      
      {/* Scrollable form content */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        paddingRight: '8px',
        marginBottom: '16px'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Technology Name */}
        <FormControl label="Technology Name" required error={!!error && !formData.technology_name}>
          <Input
            value={formData.technology_name}
            onChange={handleInputChange('technology_name')}
            placeholder="Technology name"
            required
          />
        </FormControl>
        
        {/* Physical Technology Cluster */}
        <FormControl label="Physical Technology Cluster">
          <Input
            value={formData.physical_technology_cluster || ''}
            onChange={handleInputChange('physical_technology_cluster')}
            placeholder="Physical technology cluster"
          />
        </FormControl>

        {/* Digital Technology Cluster */}
        <FormControl label="Digital Technology Cluster">
          <Input
            value={formData.digital_technology_cluster || ''}
            onChange={handleInputChange('digital_technology_cluster')}
            placeholder="Digital technology cluster"
          />
        </FormControl>

        {/* Product Roadmap */}
        <FormControl label="Product Roadmap">
          <Input
            value={formData.product_roadmap || ''}
            onChange={handleInputChange('product_roadmap')}
            placeholder="Roadmap del producto"
          />
        </FormControl>

        {/* Technology Roadmap */}
        <FormControl label="Technology Roadmap">
          <Input
            value={formData.technology_roadmap || ''}
            onChange={handleInputChange('technology_roadmap')}
            placeholder="Roadmap de la tecnología"
          />
        </FormControl>

        {/* Technology Description */}
        <FormControl label="Technology Description">
          <TextField
            multiline
            rows={4}
            value={formData.technology_description || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                technology_description: e.target.value || undefined,
              }))
            }
            placeholder="Technology description"
            fullWidth
          />
        </FormControl>

        {/* Current TRL (1-9) */}
        <FormControl label="Current TRL (1-9)" required error={!!error && (!formData.current_trl || formData.current_trl < 1 || formData.current_trl > 9)}>
          <Input
            type="number"
            min="1"
            max="9"
            value={formData.current_trl}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setFormData((prev) => ({ ...prev, current_trl: value }));
            }}
            placeholder="1-9"
            required
          />
        </FormControl>

        {/* TRL Data Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: ColorVariants.technology.clear, borderRadius: '4px', border: `1px solid ${ColorVariants.technology.main}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="medium" sx={{ color: ColorVariants.technology.text, fontWeight: 500 }}>
              TRL Data
            </Typography>
            <Box
              component="button"
              type="button"
              onClick={() => handleOpenTrlModal()}
              sx={{
                padding: '8px 16px',
                backgroundColor: ColorVariants.technology.main,
                color: ColorVariants.technology.textLight,
                border: `1px solid ${ColorVariants.technology.dark}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: ColorVariants.technology.dark,
                },
              }}
            >
              Add TRL Data
            </Box>
          </Box>
          
          {trls.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {trls.map((trl) => (
                <Box
                  key={`trl-${trl.trl_number}-${trl.trl_year || 'no-year'}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: ColorVariants.technology.light,
                    color: ColorVariants.technology.text,
                    border: `1px solid ${ColorVariants.technology.main}`,
                    borderRadius: '16px',
                    fontSize: '14px',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleOpenTrlModal(trl)}
                    sx={{
                      color: ColorVariants.technology.main,
                      padding: '2px',
                      '&:hover': {
                        backgroundColor: ColorVariants.technology.clear,
                      },
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <Typography variant="small" sx={{ color: ColorVariants.technology.text }}>
                    TRL {trl.trl_number}{trl.trl_year ? ` (${trl.trl_year})` : ''}{trl.trl_cost ? ` - ${Math.round(trl.trl_cost).toLocaleString('es-ES')} K€` : ''}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTrl(trl.trl_number, trl.trl_year)}
                    sx={{
                      color: ColorVariants.technology.text,
                      padding: '2px',
                      '&:hover': {
                        backgroundColor: ColorVariants.technology.clear,
                        color: '#d32f2f',
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          {trls.length === 0 && (
            <Typography variant="small" sx={{ color: ColorVariants.technology.text, fontStyle: 'italic', opacity: 0.7 }}>
              No TRL data added yet. Click "Add TRL Data" to add TRL information.
            </Typography>
          )}
        </Box>

        {/* FoM Type */}
        <FormControl label="FoM Type">
          <Input
            value={formData.fom_type || ''}
            onChange={handleInputChange('fom_type')}
            placeholder="Tipo de FoM"
          />
        </FormControl>

        {/* FoM Value (%) */}
        <FormControl label="FoM Value (%)">
          <Input
            type="number"
            step="0.01"
            value={formData.fom_value_percent || ''}
            onChange={handleNumberChange('fom_value_percent')}
            placeholder="Percentage value"
          />
        </FormControl>

        {/* Targeted Programmes */}
        <FormControl label="Targeted Programmes (comma-separated)">
          <Input
            value={targetedProgrammesText}
            onChange={(e) => setTargetedProgrammesText(e.target.value)}
            placeholder="Programme 1, Programme 2, ..."
          />
        </FormControl>

        {/* A/C Application */}
        <FormControl label="A/C Application">
          <Input
            value={formData.ac_application || ''}
            onChange={handleInputChange('ac_application')}
            placeholder="Aircraft application"
          />
        </FormControl>

        {/* Dependencies */}
        <FormControl label="Dependencies (comma-separated)">
          <Input
            value={dependenciesText}
            onChange={(e) => setDependenciesText(e.target.value)}
            placeholder="Dependency 1, Dependency 2, ..."
          />
        </FormControl>
        </form>
      </Box>

      {/* Fixed footer with messages and action buttons */}
      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {error && (
          <Box sx={{ color: 'error.main', padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            <Typography variant="medium" sx={{ color: 'error.main' }}>
              {error}
            </Typography>
          </Box>
        )}

        {success && (
          <Box sx={{ color: 'success.main', padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <Typography variant="medium" sx={{ color: 'success.main' }}>
              {success}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <Box
            component="button"
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.technology_name || !formData.current_trl}
            sx={{
              padding: '12px 24px',
              backgroundColor: ColorVariants.technology.main,
              color: ColorVariants.technology.textLight,
              border: `2px solid ${ColorVariants.technology.dark}`,
              borderRadius: '4px',
              cursor: loading || !formData.technology_name || !formData.current_trl ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              opacity: loading || !formData.technology_name || !formData.current_trl ? 0.6 : 1,
              '&:hover': {
                backgroundColor: loading || !formData.technology_name || !formData.current_trl ? ColorVariants.technology.main : ColorVariants.technology.dark,
                transform: loading || !formData.technology_name || !formData.current_trl ? 'none' : 'translateY(-2px)',
                boxShadow: loading || !formData.technology_name || !formData.current_trl ? 'none' : `0 4px 8px rgba(0, 174, 199, 0.3)`,
              },
            }}
          >
            {loading ? 'Creating...' : 'Create Technology'}
          </Box>
        </Box>
      </Box>

      {/* TRL Modal */}
      <DFModal open={showTrlModal} onClose={handleCloseTrlModal} size="m">
        <DFModalHeader 
          title={editingTrl ? `Edit TRL ${editingTrl.trl_number}${editingTrl.trl_year ? ` (${editingTrl.trl_year})` : ''}` : "Add TRL Data"} 
          onClose={handleCloseTrlModal} 
        />
        <DFModalContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trlModalError && (
              <Box sx={{ color: 'error.main', padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                <Typography variant="medium" sx={{ color: 'error.main' }}>
                  {trlModalError}
                </Typography>
              </Box>
            )}
            
            <FormControl label="TRL Number (1-9)" required>
              <Input
                type="number"
                min="1"
                max="9"
                value={trlFormData.trl_number}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setTrlFormData((prev) => ({ ...prev, trl_number: value }));
                }}
                placeholder="1-9"
                required
                disabled={!!editingTrl}
              />
            </FormControl>

            <FormControl label="TRL Year" required>
              <Input
                type="number"
                min="1900"
                step="1"
                value={trlFormData.trl_year || ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '') {
                    setTrlFormData((prev) => ({ ...prev, trl_year: undefined }));
                    return;
                  }
                  // Permitir escribir números (incluyendo números parciales mientras se escribe)
                  const parsedValue = parseInt(inputValue, 10);
                  if (!isNaN(parsedValue) && parsedValue >= 0) {
                    setTrlFormData((prev) => ({ ...prev, trl_year: parsedValue }));
                  }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  // Validar solo cuando el campo pierde el foco
                  const inputValue = e.target.value;
                  if (inputValue !== '') {
                    const parsedValue = parseInt(inputValue, 10);
                    if (isNaN(parsedValue) || parsedValue < 1900) {
                      setTrlModalError("TRL Year must be a valid year (1900 or later).");
                      setTrlFormData((prev) => ({ ...prev, trl_year: undefined }));
                    } else {
                      setTrlModalError(null);
                    }
                  }
                }}
                placeholder="Year (e.g., 2024)"
                required
              />
            </FormControl>

            <FormControl label="TRL Cost (K€)">
              <Input
                type="number"
                step="0.01"
                value={trlFormData.trl_cost || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  setTrlFormData((prev) => ({ ...prev, trl_cost: value }));
                }}
                placeholder="Cost in K€ (e.g., 1000.00)"
              />
            </FormControl>
          </Box>
        </DFModalContent>
        <DFModalFooter>
          <Button
            variant="secondary"
            onClick={handleCloseTrlModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddTrl}
          >
            {editingTrl ? 'Update' : 'Add'}
          </Button>
        </DFModalFooter>
      </DFModal>

      <DFModal open={showConflictModal} onClose={() => setShowConflictModal(false)} size="m">
        <DFModalHeader 
          title="Technology Already Exists" 
          onClose={() => setShowConflictModal(false)} 
        />
        <DFModalContent>
          <Typography variant="medium">
            A technology with the name <strong>"{formData.technology_name}"</strong> already exists.
            <br />
            <br />
            What would you like to do?
          </Typography>
        </DFModalContent>
        <DFModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowConflictModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleRename}
            disabled={loading}
          >
            Rename
          </Button>
          <Button
            variant="primary"
            onClick={handleModifyExisting}
            disabled={loading}
          >
            Modify Existing
          </Button>
        </DFModalFooter>
      </DFModal>
    </Box>
  );
};

