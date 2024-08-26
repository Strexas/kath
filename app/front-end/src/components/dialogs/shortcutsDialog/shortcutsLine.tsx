import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

interface ShortcutLineProps {
  windowsKeys: string[];
  macOSKeys: string[];
  description?: string;
  macOS?: boolean;
}

export const ShortcutsLine: React.FC<ShortcutLineProps> = ({ windowsKeys, macOSKeys, description, macOS }) => {
  const macOSSymbols: { [key: string]: string } = {
    command: '⌘',
    option: '⌥',
    control: '⌃',
    shift: '⇧',
    delete: '⌫',
    return: '↩',
    escape: '⎋',
    capslock: '⇪',
  };

  const keys = macOS ? macOSKeys.map((key) => macOSSymbols[key.toLowerCase()] || key) : windowsKeys;

  return (
    <Grid container rowSpacing={2} alignItems='center'>
      <Grid item xs={7}>
        <Typography fontSize={'1rem'}>{description}</Typography>
      </Grid>
      <Grid item xs={5}>
        <Grid container alignItems='center'>
          {keys.map((key, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                  }}
                >
                  {key.toUpperCase()}
                </Typography>
                {index < keys.length - 1 && <Typography sx={{ marginX: '4px' }}>+</Typography>}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
