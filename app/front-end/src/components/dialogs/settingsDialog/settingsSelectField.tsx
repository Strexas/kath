import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material';
import React from 'react';

interface Setting {
  value: string | undefined;
  label: string;
}

interface SettingsSelectFieldProps {
  title: string;
  description: string;
  settings: Setting[];
  value: string | undefined;
  onChange: (event: SelectChangeEvent) => void;
}

export const SettingsSelectField: React.FC<SettingsSelectFieldProps> = ({
  title,
  description,
  settings,
  value,
  onChange,
}) => {
  const Theme = useTheme();

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <Grid item xs={8}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: '500' }}>{title}</Typography>
        <Typography sx={{ fontSize: '0.9rem', color: Theme.palette.text.secondary }}>{description}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Box display='flex' justifyContent='flex-end'>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={value}
              onChange={onChange}
              displayEmpty
              size='small'
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.value} value={setting.value}>
                  {setting.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};
