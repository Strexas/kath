import { EditorColumnMenuAggregationActions } from '@/features/editor/types';
import { Functions as FunctionsIcon } from '@mui/icons-material';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import { MouseEvent, useState } from 'react';

export interface EditorColumnMenuAggregationItemProps {
  initialValue: EditorColumnMenuAggregationActions;
  onClick: (event: MouseEvent) => void;
  onAction: (action: EditorColumnMenuAggregationActions) => void;
}

export const EditorColumnMenuAggregationItem: React.FC<EditorColumnMenuAggregationItemProps> = ({
  initialValue,
  onClick,
  onAction,
}) => {
  const Theme = useTheme();
  const [value, setValue] = useState<EditorColumnMenuAggregationActions>(initialValue);

  const handleChange = (event: SelectChangeEvent) => {
    const action = event.target.value as EditorColumnMenuAggregationActions;
    setValue(action);
    onAction(action);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        alignItems: 'center',
        px: '0.85rem',
        py: '1rem',
      }}
    >
      <FunctionsIcon sx={{ color: Theme.palette.text.secondary }} />
      <FormControl fullWidth>
        <InputLabel sx={{ color: Theme.palette.text.primary }}>Aggregation</InputLabel>
        <Select id={'aggregation-select'} label={'Aggregation'} value={value} onChange={handleChange}>
          <MenuItem value={EditorColumnMenuAggregationActions.NONE} onClick={onClick}>
            ...
          </MenuItem>
          <MenuItem value={EditorColumnMenuAggregationActions.SUM} onClick={onClick}>
            Sum
          </MenuItem>
          <MenuItem value={EditorColumnMenuAggregationActions.AVG} onClick={onClick}>
            Average
          </MenuItem>
          <MenuItem value={EditorColumnMenuAggregationActions.MIN} onClick={onClick}>
            Minimum
          </MenuItem>
          <MenuItem value={EditorColumnMenuAggregationActions.MAX} onClick={onClick}>
            Maximum
          </MenuItem>
          <MenuItem value={EditorColumnMenuAggregationActions.COUNT} onClick={onClick}>
            Count
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
