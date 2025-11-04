import { Box, Checkbox, List, ListItemButton, ListItemText, Paper, Stack } from '@mui/material';
import { FacetCardProps } from './FacetCard.types';
import { Chip, IconButton, Typography } from '@airbus/components-react';
import { ClearAll } from '@mui/icons-material';

const FacetCard = ({ title, subtitle, options, value, onChange, disabled }: FacetCardProps) => {
  const toggle = (id: string) => {
    if (disabled) return;
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  const clear = () => onChange([]);

  return (
    <Paper elevation={0} className="facetCardContainer">
      <Box
        sx={{
          bgcolor: '#8D1AE0',
          color: '#ffffff',
          textAlign: 'center',
          px: 3,
          py: 2,
          borderRadius: '20px',
          width: '85%',
          mx: 'auto',
          mt: 2,
        }}
      >
        <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
          {title}
        </Typography>
        <Typography variant="subH6" sx={{ opacity: 0.9 }}>
          {subtitle}
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
        {value.length > 0 && (
          <IconButton size="small" onClick={clear}>
            <ClearAll fontSize="small" />
          </IconButton>
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
              <ListItemText 
              primary={<Typography fontWeight={600}>{opt.label}</Typography>}
                />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default FacetCard;
