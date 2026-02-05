import { useState, FormEvent, useEffect } from 'react';
import { Button, FormControl, Input, Typography, Select } from '@airbus/components-react';
import { Box, TextField, Chip, IconButton } from '@mui/material';
import { Visibility, Close } from '@mui/icons-material';
import { DFModal, DFModalContent, DFModalFooter, DFModalHeader } from '@df/ui';
import { useApiClient } from '@df/utils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  createTechnology, 
  checkTechnologyName, 
  getTechnology, 
  updateTechnology, 
  CreateTechnologyPayload, 
  TRLData,
  OptionItem,
  getPhysicalTechnologyClusters,
  getDigitalTechnologyClusters,
  getProductRoadmaps,
  getTechnologyRoadmaps,
  getFoMTypes,
  getTargetedProgrammes,
  getACApplications
} from '../../services/TechnologiesService/technologies.service';
import { ColorVariants } from '../../constants';
import './createDB.css';

interface CreateTechnologyFormProps {
  onSuccess?: (technologyId: number) => void;
  technologyId?: number | string; // Si está presente, modo edición
}

export const CreateTechnologyForm = ({ onSuccess, technologyId }: CreateTechnologyFormProps) => {
  const api = useApiClient();
  const navigate = useNavigate();
  const { t } = useTranslation('create_db');
  const isEditMode = !!technologyId;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictTechnologyId, setConflictTechnologyId] = useState<number | null>(null);
  const [pendingPayload, setPendingPayload] = useState<CreateTechnologyPayload | null>(null);
  const [technologyName, setTechnologyName] = useState<string>('');
  
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
  const [trlNumberInput, setTrlNumberInput] = useState<string>('1');

  // Campos del formulario
  const [formData, setFormData] = useState<CreateTechnologyPayload>({
    technology_name: '',
    current_trl: 1,
    physical_technology_cluster: undefined,
    digital_technology_cluster: undefined,
    product_roadmap: undefined,
    technology_roadmap: undefined,
    technology_description: '',
    dependencies: [],
    fom_type: undefined,
    fom_value_percent: undefined,
    targeted_programmes: [],
    ac_application: undefined,
  });

  // Campos para listas (se convierten a arrays)
  const [dependenciesText, setDependenciesText] = useState('');
  const [targetedProgrammesText, setTargetedProgrammesText] = useState('');
  const [targetedProgrammesSelectValue, setTargetedProgrammesSelectValue] = useState<string>('');
  const [targetedProgrammesSelectKey, setTargetedProgrammesSelectKey] = useState<number>(0);

  // Opciones para los comboboxes
  const [physicalClusters, setPhysicalClusters] = useState<OptionItem[]>([]);
  const [digitalClusters, setDigitalClusters] = useState<OptionItem[]>([]);
  const [productRoadmaps, setProductRoadmaps] = useState<OptionItem[]>([]);
  const [technologyRoadmaps, setTechnologyRoadmaps] = useState<OptionItem[]>([]);
  const [fomTypes, setFomTypes] = useState<OptionItem[]>([]);
  const [targetedProgrammesOptions, setTargetedProgrammesOptions] = useState<OptionItem[]>([]);
  const [acApplications, setAcApplications] = useState<OptionItem[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Cargar opciones al inicio
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [
          physical,
          digital,
          product,
          technology,
          fom,
          targeted,
          ac
        ] = await Promise.all([
          getPhysicalTechnologyClusters(api),
          getDigitalTechnologyClusters(api),
          getProductRoadmaps(api),
          getTechnologyRoadmaps(api),
          getFoMTypes(api),
          getTargetedProgrammes(api),
          getACApplications(api),
        ]);
        
        setPhysicalClusters(physical);
        setDigitalClusters(digital);
        setProductRoadmaps(product);
        setTechnologyRoadmaps(technology);
        setFomTypes(fom);
        setTargetedProgrammesOptions(targeted);
        setAcApplications(ac);
      } catch (err: any) {
        console.error('Error loading options:', err);
        setError(t('errorLoadingOptions'));
      } finally {
        setLoadingOptions(false);
      }
    };
    
    loadOptions();
  }, [api, t]);

  // Cargar datos en modo edición
  useEffect(() => {
    if (technologyId) {
      const loadTechnology = async () => {
        try {
          setLoadingData(true);
          setError(null);
          const technology = await getTechnology(api, technologyId);
          
          // Establecer el nombre de la tecnología para mostrarlo en el título
          setTechnologyName(technology.technology_name);
          
          // Cargar datos del formulario
          // Los campos de opciones ahora vienen como objetos con id y name, o como números (IDs)
          const getOptionId = (value: any): number | undefined => {
            if (typeof value === 'number') {
              return value;
            }
            if (typeof value === 'object' && value !== null && 'id' in value) {
              return (value as { id: number }).id;
            }
            return undefined;
          };
          
          const physicalClusterId = getOptionId(technology.physical_technology_cluster);
          const digitalClusterId = getOptionId(technology.digital_technology_cluster);
          const productRoadmapId = getOptionId(technology.product_roadmap);
          const technologyRoadmapId = getOptionId(technology.technology_roadmap);
          const fomTypeId = getOptionId(technology.fom_type);
          const acApplicationId = getOptionId(technology.ac_application);
          
          // Para targeted_programmes, puede venir como array de objetos o array de números
          let targetedProgrammesIds: number[] = [];
          if (technology.targeted_programmes && Array.isArray(technology.targeted_programmes)) {
            targetedProgrammesIds = technology.targeted_programmes.map((tp: any) => 
              typeof tp === 'object' ? tp.id : (typeof tp === 'number' ? tp : undefined)
            ).filter((id: any) => id !== undefined);
          }
          
          setFormData({
            technology_name: technology.technology_name || '',
            current_trl: technology.current_trl || 1,
            physical_technology_cluster: physicalClusterId,
            digital_technology_cluster: digitalClusterId,
            product_roadmap: productRoadmapId,
            technology_roadmap: technologyRoadmapId,
            technology_description: technology.technology_description || '',
            dependencies: technology.dependencies || [],
            fom_type: fomTypeId,
            fom_value_percent: technology.fom_value_percent || undefined,
            targeted_programmes: targetedProgrammesIds,
            ac_application: acApplicationId,
          });
          
          // Cargar listas como texto
          if (technology.dependencies && Array.isArray(technology.dependencies)) {
            setDependenciesText(technology.dependencies.join(', '));
          }
          
          // Para targeted_programmes, mostrar los nombres si vienen como objetos
          if (technology.targeted_programmes && Array.isArray(technology.targeted_programmes)) {
            const names = technology.targeted_programmes.map((tp: any) => 
              typeof tp === 'object' ? tp.name : String(tp)
            );
            setTargetedProgrammesText(names.join(', '));
          }
          
          // Cargar TRLs
          if (technology.trls && Array.isArray(technology.trls)) {
            const trlsData: TRLData[] = technology.trls.map(trl => ({
              trl_number: trl.trl_number,
              trl_year: trl.trl_year,
              trl_cost: trl.trl_cost,
            }));
            setTrls(trlsData);
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.detail ||
            err.response?.data?.errors ||
            err.message ||
            t('errorLoadingTechnology');
          setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
          setLoadingData(false);
        }
      };
      
      loadTechnology();
    }
  }, [technologyId, api]);

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

  const handleFoMValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permitir vacío
    if (value === '') {
      setFormData((prev) => ({
        ...prev,
        fom_value_percent: undefined,
      }));
      return;
    }
    
    // Solo permitir números y un punto decimal
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return; // No actualizar si contiene caracteres inválidos
    }
    
    // Convertir a número
    const numValue = parseFloat(value);
    
    // Si es un número válido y está en el rango 0-100
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setFormData((prev) => ({
        ...prev,
        fom_value_percent: numValue,
      }));
    } else if (numValue > 100) {
      // Si es mayor a 100, limitar a 100
      setFormData((prev) => ({
        ...prev,
        fom_value_percent: 100,
      }));
      // Actualizar el input para mostrar 100
      e.target.value = '100';
    }
    // Si el valor es menor a 0 o no es un número válido, no hacer nada
  };

  const handleTrlNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números enteros (string) para que el usuario pueda borrar y reescribir
    if (!/^[0-9]*$/.test(value)) {
      return; // No actualizar si contiene caracteres inválidos
    }
    
    setTrlNumberInput(value);
  };

  const handleTrlYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permitir vacío
    if (value === '') {
      setTrlFormData((prev) => ({ ...prev, trl_year: undefined }));
      return;
    }
    
    // Solo permitir números enteros
    if (!/^[0-9]*$/.test(value)) {
      return; // No actualizar si contiene caracteres inválidos
    }
    
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue >= 0) {
      // Guardamos el número; las validaciones de rango se hacen en onBlur / handleAddTrl
      setTrlFormData((prev) => ({ ...prev, trl_year: numValue }));
    }
  };

  const handleTrlCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permitir vacío
    if (value === '') {
      setTrlFormData((prev) => ({ ...prev, trl_cost: undefined }));
      return;
    }
    
    // Solo permitir números y un punto decimal
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      return; // No actualizar si contiene caracteres inválidos
    }
    
    const numValue = parseFloat(value);
    
    // Permitir cualquier número positivo
    if (!isNaN(numValue) && numValue >= 0) {
      setTrlFormData((prev) => ({ ...prev, trl_cost: numValue }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // En modo edición, usar updateTechnology directamente
      if (isEditMode && technologyId) {
        const dependencies = dependenciesText
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        const payload: any = {
          technology_name: formData.technology_name,
          current_trl: formData.current_trl,
          trls: trls,
        };

        if (formData.physical_technology_cluster !== undefined && formData.physical_technology_cluster !== null) {
          payload.physical_technology_cluster = formData.physical_technology_cluster;
        }
        if (formData.digital_technology_cluster !== undefined && formData.digital_technology_cluster !== null) {
          payload.digital_technology_cluster = formData.digital_technology_cluster;
        }
        if (formData.product_roadmap !== undefined && formData.product_roadmap !== null) {
          payload.product_roadmap = formData.product_roadmap;
        }
        if (formData.technology_roadmap !== undefined && formData.technology_roadmap !== null) {
          payload.technology_roadmap = formData.technology_roadmap;
        }
        if (formData.technology_description) {
          payload.technology_description = formData.technology_description;
        }
        if (dependencies.length > 0) {
          payload.dependencies = dependencies;
        }
        if (formData.fom_type !== undefined && formData.fom_type !== null) {
          payload.fom_type = formData.fom_type;
        }
        if (formData.fom_value_percent !== undefined && formData.fom_value_percent !== null) {
          payload.fom_value_percent = formData.fom_value_percent;
        }
        if (formData.targeted_programmes && formData.targeted_programmes.length > 0) {
          payload.targeted_programmes = formData.targeted_programmes;
        }
        if (formData.ac_application !== undefined && formData.ac_application !== null) {
          payload.ac_application = formData.ac_application;
        }

        const response = await updateTechnology(api, technologyId, payload);
        setSuccess(t('technologyUpdatedSuccessfully'));
        
        if (onSuccess) {
          onSuccess(response.id);
        }
        return;
      }

      // Modo creación: verificar primero si ya existe una tecnología con ese nombre
      const checkResult = await checkTechnologyName(api, formData.technology_name);
      
      if (checkResult.exists && checkResult.id) {
        // Si existe, preparar el payload y mostrar el modal
        const dependencies = dependenciesText
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        const payload: any = {
          technology_name: formData.technology_name,
          current_trl: formData.current_trl,
        };

        if (formData.physical_technology_cluster !== undefined && formData.physical_technology_cluster !== null) {
          payload.physical_technology_cluster = formData.physical_technology_cluster;
        }
        if (formData.digital_technology_cluster !== undefined && formData.digital_technology_cluster !== null) {
          payload.digital_technology_cluster = formData.digital_technology_cluster;
        }
        if (formData.product_roadmap !== undefined && formData.product_roadmap !== null) {
          payload.product_roadmap = formData.product_roadmap;
        }
        if (formData.technology_roadmap !== undefined && formData.technology_roadmap !== null) {
          payload.technology_roadmap = formData.technology_roadmap;
        }
        if (formData.technology_description) {
          payload.technology_description = formData.technology_description;
        }
        if (dependencies.length > 0) {
          payload.dependencies = dependencies;
        }
        if (formData.fom_type !== undefined && formData.fom_type !== null) {
          payload.fom_type = formData.fom_type;
        }
        if (formData.fom_value_percent !== undefined && formData.fom_value_percent !== null) {
          payload.fom_value_percent = formData.fom_value_percent;
        }
        if (formData.targeted_programmes && formData.targeted_programmes.length > 0) {
          payload.targeted_programmes = formData.targeted_programmes;
        }
        if (formData.ac_application !== undefined && formData.ac_application !== null) {
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

      // Limpiar campos undefined y vacíos antes de enviar
      const payload: any = {
        technology_name: formData.technology_name,
        current_trl: formData.current_trl,
      };

      // Agregar solo campos que tengan valor (no undefined, no null, no 0 para números)
      if (formData.physical_technology_cluster !== undefined && formData.physical_technology_cluster !== null) {
        payload.physical_technology_cluster = formData.physical_technology_cluster;
      }
      if (formData.digital_technology_cluster !== undefined && formData.digital_technology_cluster !== null) {
        payload.digital_technology_cluster = formData.digital_technology_cluster;
      }
      if (formData.product_roadmap !== undefined && formData.product_roadmap !== null) {
        payload.product_roadmap = formData.product_roadmap;
      }
      if (formData.technology_roadmap !== undefined && formData.technology_roadmap !== null) {
        payload.technology_roadmap = formData.technology_roadmap;
      }
      if (formData.technology_description) {
        payload.technology_description = formData.technology_description;
      }
      if (dependencies.length > 0) {
        payload.dependencies = dependencies;
      }
      if (formData.fom_type !== undefined && formData.fom_type !== null) {
        payload.fom_type = formData.fom_type;
      }
      if (formData.fom_value_percent !== undefined && formData.fom_value_percent !== null) {
        payload.fom_value_percent = formData.fom_value_percent;
      }
      if (formData.targeted_programmes && formData.targeted_programmes.length > 0) {
        payload.targeted_programmes = formData.targeted_programmes;
      }
      if (formData.ac_application !== undefined && formData.ac_application !== null) {
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
        setSuccess(t('technologyCreatedSuccessfully'));
        // Clear form
        setFormData({
          technology_name: '',
          current_trl: 1,
          physical_technology_cluster: undefined,
          digital_technology_cluster: undefined,
          product_roadmap: undefined,
          technology_roadmap: undefined,
          technology_description: '',
          dependencies: [],
          fom_type: undefined,
          fom_value_percent: undefined,
          targeted_programmes: [],
          ac_application: undefined,
        });
        setTargetedProgrammesSelectKey(prev => prev + 1);
        setDependenciesText('');
        setTargetedProgrammesText('');
        setTrls([]);

        if (onSuccess) {
          onSuccess(response.id);
        }
      } else {
        setSuccess(t('technologyCreatedSuccessfully'));
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.errors ||
        err.message ||
        isEditMode ? t('errorUpdatingTechnology') : t('errorCreatingTechnology');
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
    setError(t('technologyExistsMessage', { name: formData.technology_name }));
  };

  // TRL management functions
  const handleOpenTrlModal = (trl?: TRLData) => {
    setTrlModalError(null);
    if (trl) {
      setEditingTrl(trl);
      setTrlFormData(trl);
      setTrlNumberInput(String(trl.trl_number ?? ''));
    } else {
      setEditingTrl(null);
      setTrlFormData({
        trl_number: 1,
        trl_year: undefined,
        trl_cost: undefined,
      });
      setTrlNumberInput('');
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
    setTrlNumberInput('1');
  };

  const handleAddTrl = () => {
    // Validar TRL Number (1-9) a partir del input de texto
    const parsedTrlNumber = parseInt(trlNumberInput, 10);
    if (isNaN(parsedTrlNumber) || parsedTrlNumber < 1 || parsedTrlNumber > 9) {
      setTrlModalError(
        t('trlNumberInvalid') ||
          'TRL Number inválido. Debe ser un número entero entre 1 y 9.'
      );
      return;
    }

    const newTrlData: TRLData = {
      ...trlFormData,
      trl_number: parsedTrlNumber,
    };

    // Validar que TRL Year esté informado y en rango válido (4 dígitos, 1900-2999)
    if (
      newTrlData.trl_year === undefined ||
      newTrlData.trl_year === null ||
      newTrlData.trl_year < 1900 ||
      newTrlData.trl_year >= 3000
    ) {
      setTrlModalError(t('trlYearInvalid'));
      return;
    }

    // Validar que TRL Cost sea obligatorio (no opcional)
    if (newTrlData.trl_cost === undefined || newTrlData.trl_cost === null) {
      setTrlModalError(
        t('trlCostRequired') || 'TRL Cost (K€) es obligatorio.'
      );
      return;
    }

    // Check if TRL number + year combination already exists (only when adding new, not editing)
    if (!editingTrl) {
      const existingTrl = trls.find(t => 
        t.trl_number === newTrlData.trl_number && 
        t.trl_year === newTrlData.trl_year
      );
      
      if (existingTrl) {
        setTrlModalError(t('trlNumberYearUnique'));
        return;
      }
    } else {
      // When editing, check if the new combination conflicts with another TRL (excluding the one being edited)
      const conflictingTrl = trls.find(t => 
        t.trl_number === newTrlData.trl_number && 
        t.trl_year === newTrlData.trl_year &&
        !(t.trl_number === editingTrl.trl_number && t.trl_year === editingTrl.trl_year)
      );
      
      if (conflictingTrl) {
        setTrlModalError(t('trlNumberYearUnique'));
        return;
      }
    }

    if (editingTrl) {
      // Update existing TRL - find by original trl_number and trl_year
      setTrls(trls.map(t => 
        t.trl_number === editingTrl.trl_number && t.trl_year === editingTrl.trl_year
          ? newTrlData 
          : t
      ));
    } else {
      // Add new TRL
      setTrls([...trls, newTrlData]);
    }
    
    setTrlModalError(null);
    handleCloseTrlModal();
  };

  const handleDeleteTrl = (trlNumber: number, trlYear?: number) => {
    setTrls(trls.filter(t => !(t.trl_number === trlNumber && t.trl_year === trlYear)));
  };

  return (
    <Box className="createTechnologyContainer" sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Fixed header with back button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem', flexShrink: 0 }}>
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
          {t('backToTechnologyOperations')}
        </Button>
      </Box>
      
      {/* Scrollable form content */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        paddingRight: '0.5rem',
        paddingLeft: '0.5rem',
        marginBottom: '1rem',
        minHeight: 0
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 8px' }}>
        {/* Technology Name */}
        <FormControl label={t('technologyName')} required error={!!error && !formData.technology_name}>
          <Input
            value={formData.technology_name}
            onChange={handleInputChange('technology_name')}
            placeholder={t('technologyNamePlaceholder')}
            required
          />
        </FormControl>
        
        {/* Physical Technology Cluster */}
        <FormControl label={t('physicalTechnologyCluster')}>
          <Select
            value={formData.physical_technology_cluster ? String(formData.physical_technology_cluster) : ''}
            onChange={(event: any) => {
              const value = event?.target?.value;
              setFormData((prev) => ({
                ...prev,
                physical_technology_cluster: value ? parseInt(value, 10) : undefined,
              }));
            }}
            options={physicalClusters.map((cluster) => ({
              value: String(cluster.id),
              label: cluster.name,
            }))}
            loading={loadingOptions}
            placeholder={t('physicalTechnologyClusterPlaceholder')}
          />
        </FormControl>

        {/* Digital Technology Cluster */}
        <FormControl label={t('digitalTechnologyCluster')}>
          <Select
            value={formData.digital_technology_cluster ? String(formData.digital_technology_cluster) : ''}
            onChange={(event: any) => {
              const value = event?.target?.value;
              setFormData((prev) => ({
                ...prev,
                digital_technology_cluster: value ? parseInt(value, 10) : undefined,
              }));
            }}
            options={digitalClusters.map((cluster) => ({
              value: String(cluster.id),
              label: cluster.name,
            }))}
            loading={loadingOptions}
            placeholder={t('digitalTechnologyClusterPlaceholder')}
          />
        </FormControl>

        {/* Product Roadmap */}
        <FormControl label={t('productRoadmap')}>
          <Select
            value={formData.product_roadmap ? String(formData.product_roadmap) : ''}
            onChange={(event: any) => {
              const value = event?.target?.value;
              setFormData((prev) => ({
                ...prev,
                product_roadmap: value ? parseInt(value, 10) : undefined,
              }));
            }}
            options={productRoadmaps.map((roadmap) => ({
              value: String(roadmap.id),
              label: roadmap.name,
            }))}
            loading={loadingOptions}
            placeholder={t('productRoadmapPlaceholder')}
          />
        </FormControl>

        {/* Technology Roadmap */}
        <FormControl label={t('technologyRoadmap')}>
          <Select
            value={formData.technology_roadmap ? String(formData.technology_roadmap) : ''}
            onChange={(event: any) => {
              const value = event?.target?.value;
              setFormData((prev) => ({
                ...prev,
                technology_roadmap: value ? parseInt(value, 10) : undefined,
              }));
            }}
            options={technologyRoadmaps.map((roadmap) => ({
              value: String(roadmap.id),
              label: roadmap.name,
            }))}
            loading={loadingOptions}
            placeholder={t('technologyRoadmapPlaceholder')}
          />
        </FormControl>

        {/* Technology Description */}
        <FormControl label={t('technologyDescription')}>
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
            placeholder={t('technologyDescriptionPlaceholder')}
            fullWidth
          />
        </FormControl>

        {/* Current TRL (1-9) */}
        <FormControl label={t('currentTrl')} required error={!!error && (!formData.current_trl || formData.current_trl < 1 || formData.current_trl > 9)}>
          <Input
            type="number"
            min="1"
            max="9"
            value={formData.current_trl}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setFormData((prev) => ({ ...prev, current_trl: value }));
            }}
            placeholder={t('currentTrlPlaceholder')}
            required
          />
        </FormControl>

        {/* TRL Data Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: ColorVariants.technology.clear, borderRadius: '4px', border: `1px solid ${ColorVariants.technology.main}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="medium" sx={{ color: ColorVariants.technology.text, fontWeight: 500 }}>
              {t('trlsData')}
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
              {t('addTrlData')}
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
              {t('noTrlDataAdded')}
            </Typography>
          )}
        </Box>

        {/* FoM Type */}
        <FormControl label={t('fomType')}>
          <Select
            value={formData.fom_type ? String(formData.fom_type) : ''}
            onChange={(event: any) => {
              const value = event?.target?.value;
              setFormData((prev) => ({
                ...prev,
                fom_type: value ? parseInt(value, 10) : undefined,
              }));
            }}
            options={fomTypes.map((fomType) => ({
              value: String(fomType.id),
              label: fomType.name,
            }))}
            loading={loadingOptions}
            placeholder={t('fomTypePlaceholder')}
          />
        </FormControl>

        {/* FoM Value (%) */}
        <FormControl label={t('fomValue')}>
          <Input
            type="text"
            inputMode="decimal"
            value={formData.fom_value_percent !== undefined && formData.fom_value_percent !== null ? String(formData.fom_value_percent) : ''}
            onChange={handleFoMValueChange}
            onKeyDown={(e) => {
              // Permitir: números, punto, backspace, delete, tab, escape, enter, y teclas de navegación
              const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
              const isNumber = /^[0-9]$/.test(e.key);
              const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.');
              const isAllowedKey = allowedKeys.includes(e.key);
              
              if (!isNumber && !isDecimal && !isAllowedKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
              }
            }}
            placeholder={t('fomValuePlaceholder')}
            min={0}
            max={100}
          />
        </FormControl>

        {/* Targeted Programmes */}
        <FormControl label={t('targetedProgrammes')}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Select
              key={`targeted-programmes-${targetedProgrammesSelectKey}`}
              value=""
              onChange={(event: any) => {
                const value = event?.target?.value;
                if (value && value !== '') {
                  const id = parseInt(value, 10);
                  if (!isNaN(id) && !formData.targeted_programmes?.includes(id)) {
                    setFormData((prev) => ({
                      ...prev,
                      targeted_programmes: [...(prev.targeted_programmes || []), id],
                    }));
                    // Forzar re-render del Select para limpiarlo
                    setTargetedProgrammesSelectKey(prev => prev + 1);
                  }
                }
              }}
              options={targetedProgrammesOptions
                .filter(opt => !formData.targeted_programmes?.includes(opt.id))
                .map((programme) => ({
                  value: String(programme.id),
                  label: programme.name,
                }))}
              loading={loadingOptions}
              placeholder={t('targetedProgrammesPlaceholder')}
            />
            {formData.targeted_programmes && formData.targeted_programmes.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {formData.targeted_programmes.map((id) => {
                  const option = targetedProgrammesOptions.find(opt => opt.id === id);
                  return option ? (
                    <Chip
                      key={id}
                      label={option.name}
                      onDelete={() => {
                        setFormData((prev) => ({
                          ...prev,
                          targeted_programmes: prev.targeted_programmes?.filter(pid => pid !== id) || [],
                        }));
                      }}
                      sx={{
                        backgroundColor: ColorVariants.technology.light,
                        color: ColorVariants.technology.text,
                        border: `1px solid ${ColorVariants.technology.main}`,
                      }}
                    />
                  ) : null;
                })}
              </Box>
            )}
          </Box>
        </FormControl>

        {/* A/C Application */}
        <FormControl label={t('acApplication')}>
          <Select
            value={formData.ac_application ? String(formData.ac_application) : ''}
            onChange={(event: any) => {
              const value = event?.target?.value;
              setFormData((prev) => ({
                ...prev,
                ac_application: value ? parseInt(value, 10) : undefined,
              }));
            }}
            options={acApplications.map((application) => ({
              value: String(application.id),
              label: application.name,
            }))}
            loading={loadingOptions}
            placeholder={t('acApplicationPlaceholder')}
          />
        </FormControl>

        {/* Dependencies */}
        <FormControl label={t('dependencies')} sx={{ marginBottom: '24px' }}>
          <Input
            value={dependenciesText}
            onChange={(e) => setDependenciesText(e.target.value)}
            placeholder={t('dependenciesPlaceholder')}
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
            {loading ? (isEditMode ? t('modifying') : t('creating')) : (isEditMode ? t('modifyButton') : t('createTechnologyButton'))}
          </Box>
        </Box>
      </Box>

      {/* TRL Modal */}
      <DFModal open={showTrlModal} onClose={handleCloseTrlModal} size="m">
        <DFModalHeader 
          title={editingTrl ? t('editTrl', { number: editingTrl.trl_number, year: editingTrl.trl_year ? ` (${editingTrl.trl_year})` : '' }) : t('addTrlDataTitle')} 
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
            
            <FormControl label={t('trlNumber')} required>
              <Input
                type="text"
                inputMode="numeric"
                value={trlNumberInput}
                onChange={handleTrlNumberChange}
                onKeyDown={(e) => {
                  // Permitir: números, backspace, delete, tab, escape, enter, y teclas de navegación
                  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                  const isNumber = /^[0-9]$/.test(e.key);
                  const isAllowedKey = allowedKeys.includes(e.key);
                  
                  if (!isNumber && !isAllowedKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                  }
                }}
                placeholder={t('trlNumberPlaceholder')}
                required
                disabled={!!editingTrl}
                min={1}
                max={9}
              />
            </FormControl>

            <FormControl label={t('trlYear')} required>
              <Input
                type="text"
                inputMode="numeric"
                value={trlFormData.trl_year !== undefined && trlFormData.trl_year !== null ? String(trlFormData.trl_year) : ''}
                onChange={handleTrlYearChange}
                onKeyDown={(e) => {
                  // Permitir: números, backspace, delete, tab, escape, enter, y teclas de navegación
                  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                  const isNumber = /^[0-9]$/.test(e.key);
                  const isAllowedKey = allowedKeys.includes(e.key);
                  
                  if (!isNumber && !isAllowedKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                  }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  // Validar solo cuando el campo pierde el foco
                  const inputValue = e.target.value;
                  if (inputValue !== '') {
                    const parsedValue = parseInt(inputValue, 10);
                    const isFourDigits = inputValue.length === 4;
                    if (
                      isNaN(parsedValue) ||
                      !isFourDigits ||
                      parsedValue < 1900 ||
                      parsedValue >= 3000
                    ) {
                      setTrlModalError(t('trlYearInvalid'));
                      setTrlFormData((prev) => ({ ...prev, trl_year: undefined }));
                    } else {
                      setTrlModalError(null);
                    }
                  }
                }}
                placeholder={t('trlYearPlaceholder')}
                required
                min={1900}
              />
            </FormControl>

            <FormControl label={t('trlCost')} required>
              <Input
                type="text"
                inputMode="decimal"
                value={trlFormData.trl_cost !== undefined && trlFormData.trl_cost !== null ? String(trlFormData.trl_cost) : ''}
                onChange={handleTrlCostChange}
                onKeyDown={(e) => {
                  // Permitir: números, punto, backspace, delete, tab, escape, enter, y teclas de navegación
                  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                  const isNumber = /^[0-9]$/.test(e.key);
                  const isDecimal = e.key === '.' && !e.currentTarget.value.includes('.');
                  const isAllowedKey = allowedKeys.includes(e.key);
                  
                  if (!isNumber && !isDecimal && !isAllowedKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                  }
                }}
                placeholder={t('trlCostPlaceholder')}
                required
                step="0.01"
              />
            </FormControl>
          </Box>
        </DFModalContent>
        <DFModalFooter>
          <Button
            variant="secondary"
            onClick={handleCloseTrlModal}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleAddTrl}
          >
            {editingTrl ? t('update') : t('add')}
          </Button>
        </DFModalFooter>
      </DFModal>

      <DFModal open={showConflictModal} onClose={() => setShowConflictModal(false)} size="m">
        <DFModalHeader 
          title={t('technologyAlreadyExists')} 
          onClose={() => setShowConflictModal(false)} 
        />
        <DFModalContent>
          <Typography variant="medium">
            {t('technologyExistsMessage', { name: formData.technology_name })}
            <br />
            <br />
            {t('whatWouldYouLikeToDo')}
          </Typography>
        </DFModalContent>
        <DFModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowConflictModal(false)}
            disabled={loading}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="secondary"
            onClick={handleRename}
            disabled={loading}
          >
            {t('rename')}
          </Button>
          <Button
            variant="primary"
            onClick={handleModifyExisting}
            disabled={loading}
          >
            {t('modifyExisting')}
          </Button>
        </DFModalFooter>
      </DFModal>
    </Box>
  );
};

