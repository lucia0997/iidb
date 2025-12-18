import {
  Box,
  Checkbox,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import { FacetCardProps } from './FacetCard.types';
import { Chip, IconButton, Typography } from '@airbus/components-react';
import { ClearAll, DoneAll } from '@mui/icons-material';

const FacetCard = ({ title, color, options, value, onChange, disabled }: FacetCardProps) => {
  const toggle = (id: string) => {
    if (disabled) return;
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  const allSelected = value.length === options.length;

  const handleSelectAll = () => {
    onChange(allSelected ? [] : options.map((o) => o.id));
  };
  const clear = () => onChange([]);

  return (
    <Paper elevation={0} className="facetCardContainer">
      <Box
        sx={{
          bgcolor: color ? color : '#8D1AE0',
          textAlign: 'center',
          py: 2,
          borderRadius: '10px',
          width: '85%',
          mx: 'auto',
          mt: 2,
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: '#ffffff',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.2,
            display: 'block',
          }}
        >
          {title}
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, pt: 2 }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {value.slice(0, 3).map((id) => {
            const opt = options.find((o) => o.id === id);
            return <Chip key={id} size="small" label={opt?.label ?? id} />;
          })}
          {value.length > 3 && <Chip size="small" label={`+${value.length - 3}`} />}
        </Stack>
        {value.length === 0 ? (
          <Tooltip title="Select all">
            <IconButton size="small" onClick={handleSelectAll}>
              <DoneAll fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Clear all">
            <IconButton size="small" onClick={clear}>
              <ClearAll fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
       
      </Stack>
      <List sx={{ p: 2, pt: 1 }}>
        {options.map((opt) => {
          const selected = value.includes(opt.id);
          return (
            <ListItemButton
              key={opt.id}
              onClick={() => toggle(opt.id)}
              disabled={disabled}
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: 3,
                mb: 1.5,
                bgcolor: selected ? '#F3F4F6' : '#fff',
              }}
            >
              <Checkbox
                edge="start"
                checked={selected}
                tabIndex={-1}
                disableRipple
                sx={{ mr: 1.5 }}
              />
              <ListItemText primary={<Typography fontWeight={600}>{opt.label}</Typography>} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default FacetCard;
