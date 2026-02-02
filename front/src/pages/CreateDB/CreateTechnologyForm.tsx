import { useState, FormEvent } from 'react';
import { Button, FormControl, Input, Typography } from '@airbus/components-react';
import { Box, TextField } from '@mui/material';
import { useApiClient } from '@df/utils';
import { useNavigate } from 'react-router-dom';
import { createTechnology, CreateTechnologyPayload } from '../../services/TechnologiesService/technologies.service';
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

      const response = await createTechnology(api, payload);

      if (response.created) {
        setSuccess(`Tecnología creada exitosamente con ID: ${response.id}`);
        // Limpiar formulario
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

        if (onSuccess) {
          onSuccess(response.id);
        }
      } else {
        setSuccess(`La tecnología ya existe con ID: ${response.id}`);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.errors ||
        err.message ||
        'Error al crear la tecnología';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="createTechnologyContainer">
      <Typography variant="h4" style={{ marginBottom: '24px' }}>
        Crear Nueva Tecnología
      </Typography>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Campos obligatorios */}
        <FormControl label="Technology Name" required error={!!error && !formData.technology_name}>
          <Input
            value={formData.technology_name}
            onChange={handleInputChange('technology_name')}
            placeholder="Nombre de la tecnología"
            required
          />
        </FormControl>

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

        {/* Campos opcionales */}
        <FormControl label="Physical Technology Cluster">
          <Input
            value={formData.physical_technology_cluster || ''}
            onChange={handleInputChange('physical_technology_cluster')}
            placeholder="Cluster físico de tecnología"
          />
        </FormControl>

        <FormControl label="Digital Technology Cluster">
          <Input
            value={formData.digital_technology_cluster || ''}
            onChange={handleInputChange('digital_technology_cluster')}
            placeholder="Cluster digital de tecnología"
          />
        </FormControl>

        <FormControl label="Product Roadmap">
          <Input
            value={formData.product_roadmap || ''}
            onChange={handleInputChange('product_roadmap')}
            placeholder="Roadmap del producto"
          />
        </FormControl>

        <FormControl label="Technology Roadmap">
          <Input
            value={formData.technology_roadmap || ''}
            onChange={handleInputChange('technology_roadmap')}
            placeholder="Roadmap de la tecnología"
          />
        </FormControl>

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
            placeholder="Descripción de la tecnología"
            fullWidth
          />
        </FormControl>

        <FormControl label="Dependencies (separadas por comas)">
          <Input
            value={dependenciesText}
            onChange={(e) => setDependenciesText(e.target.value)}
            placeholder="Dependencia 1, Dependencia 2, ..."
          />
        </FormControl>

        <FormControl label="FoM Type">
          <Input
            value={formData.fom_type || ''}
            onChange={handleInputChange('fom_type')}
            placeholder="Tipo de FoM"
          />
        </FormControl>

        <FormControl label="FoM Value (%)">
          <Input
            type="number"
            step="0.01"
            value={formData.fom_value_percent || ''}
            onChange={handleNumberChange('fom_value_percent')}
            placeholder="Valor porcentual"
          />
        </FormControl>

        <FormControl label="Targeted Programmes (separados por comas)">
          <Input
            value={targetedProgrammesText}
            onChange={(e) => setTargetedProgrammesText(e.target.value)}
            placeholder="Programa 1, Programa 2, ..."
          />
        </FormControl>

        <FormControl label="A/C Application">
          <Input
            value={formData.ac_application || ''}
            onChange={handleInputChange('ac_application')}
            placeholder="Aplicación de aeronave"
          />
        </FormControl>

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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Volver al Menú Principal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.technology_name || !formData.current_trl}
          >
            {loading ? 'Creando...' : 'Create Technology'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

