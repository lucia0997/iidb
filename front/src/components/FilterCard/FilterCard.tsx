import {
  Autocomplete,
  ListItemText,
  Paper,
  Stack,
  Checkbox,
  Chip,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { FilterCardProps, Option } from './FilterCard.types';
import { useEffect, useState } from 'react';
import { Typography } from '@airbus/components-react';
import './filterCard.css'

const Card = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.grey[900]}`,
}));


const filter = createFilterOptions<Option | any>();

const FilterCard = ({
  title,
  subtitle,
  value,
  onChange,
  fetchOptions,
  allowCreate,
  placeholder,
  colorTitle
}: FilterCardProps) => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const time = setTimeout(async () => {
      setLoading(true);
      try {
        const opts = await fetchOptions(input);
        if (active) setOptions(opts);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(time);
    };
  }, [input, fetchOptions]);

  return (
    <Stack spacing={2}>
      <Box className='filterCardHeader' sx={{ backgroundColor: `${colorTitle}`}}>
        <Typography variant="h6" className="titleFilterCard">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="medium" className="subtitleFilterCard">
            {subtitle}
          </Typography>
        )}
      </Box>

      <Card elevation={0}>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={options}
          value={value}
          loading={loading}
          onChange={(_, newValue) => onChange(newValue as Option[])}
          onInputChange={(_, v) => setInput(v)}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          getOptionLabel={(o) => (typeof o === 'string' ? o : o.label)}
          noOptionsText={input ? 'Sin resultados' : 'Sin optiones'}
          freeSolo={allowCreate}
          filterOptions={(opts, params) => {
            if (!allowCreate) return filter(opts, params);
            const filtered = filter(opts, params);
            const exists = opts.some(
              (o) => o.label.toLowerCase() === params.inputValue.toLowerCase()
            );
            if (params.inputValue !== '' && !exists) {
              filtered.push({
                id: '__create__',
                label: `Añadir "${params.inputValue}"`,
                inputValue: params.inputValue,
              });
            }
            return filtered;
          }}
          renderOption={(props, option, { selected }) => {
            return (
              <li
                {...props}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <ListItemText primary={(option as Option).label} />
                <Checkbox checked={selected} />
              </li>
            );
          }}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, i) => (
              <Chip label={(option as Option).label} {...getTagProps({ index: i })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Card>
    </Stack>
  );
};

export default FilterCard;
