import { FileContentAggregationModel } from '@/features/editor/types';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

export interface EditorHeaderProps {
  columnName: string;
  gridColumnsAggregation: FileContentAggregationModel;
}

/**
 * `EditorHeader` component renders a customizable header for a column in the data grid.
 *
 * @description
 * The `EditorHeader` component is used to display the column header in the `DataGrid` component. It provides visual cues for data aggregation applied to the column, if any.
 *
 * - If aggregation data exists for the column, the header shows the aggregation action (e.g., sum, average) along with the column name and the aggregated value.
 * - If no aggregation data is available for the column, it simply displays the column name.
 *
 * The component utilizes Material-UI's `Box` and `Typography` for layout and styling, and `useTheme` to access theme colors.
 *
 * @component
 */
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
