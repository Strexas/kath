import { ColumnAggregation } from '@/features/editor/types';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

export interface EditorHeaderProps {
  columnName: string;
  gridColumnsAggregation: ColumnAggregation;
}

export const EditorHeader: React.ElementType<EditorHeaderProps> = ({ columnName, gridColumnsAggregation }) => {
  const Theme = useTheme();

  if (!gridColumnsAggregation[columnName])
    return <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{columnName}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', alignItems: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: Theme.palette.primary.main,
          }}
        >
          {gridColumnsAggregation[columnName].action.toUpperCase()}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{columnName}</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: Theme.palette.primary.main }}>
        {gridColumnsAggregation[columnName].value}
      </Typography>
    </Box>
  );
};
