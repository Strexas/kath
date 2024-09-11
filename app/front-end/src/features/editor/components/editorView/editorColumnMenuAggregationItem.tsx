import { FileContentAggregationActions } from '@/features/editor/types';
import { Functions as FunctionsIcon } from '@mui/icons-material';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import { MouseEvent, useState } from 'react';

export interface EditorColumnMenuAggregationItemProps {
  initialValue: FileContentAggregationActions;
  onClick: (event: MouseEvent) => void;
  onAction: (action: FileContentAggregationActions) => void;
}

/**
 * `EditorColumnMenuAggregationItem` renders a dropdown menu for selecting aggregation actions on a column.
 *
 * @description
 * This component provides a menu with various aggregation options (Sum, Average, Minimum, Maximum, Count) for a column in the data grid.
 *
 * The component:
 * - Displays an icon and a dropdown menu with aggregation options.
 * - Allows users to select an aggregation action from the dropdown.
 * - Calls `onAction` with the selected action when the selection changes.
 * - Calls `onClick` when a menu item is clicked.
 *
 * @component
 *
 * @param {FileContentAggregationActions} initialValue - The initial aggregation action to display in the dropdown.
 * @param {(event: MouseEvent) => void} onClick - Callback triggered when a menu item is clicked.
 * @param {(action: FileContentAggregationActions) => void} onAction - Callback triggered when an aggregation action is selected.
 *
 * @example
 * <EditorColumnMenuAggregationItem
 *   initialValue={FileContentAggregationActions.NONE}
 *   onClick={(event) => console.log('Menu item clicked')}
 *   onAction={(action) => console.log('Selected action:', action)}
 * />
 *
 * @returns {JSX.Element} The rendered dropdown menu for column aggregation.
 */
export const EditorColumnMenuAggregationItem: React.FC<EditorColumnMenuAggregationItemProps> = ({
  initialValue,
  onClick,
  onAction,
}) => {
  const Theme = useTheme();
  const [value, setValue] = useState<FileContentAggregationActions>(initialValue);

  const handleChange = (event: SelectChangeEvent) => {
    const action = event.target.value as FileContentAggregationActions;
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
          <MenuItem value={FileContentAggregationActions.NONE} onClick={onClick}>
            ...
          </MenuItem>
          <MenuItem value={FileContentAggregationActions.SUM} onClick={onClick}>
            Sum
          </MenuItem>
          <MenuItem value={FileContentAggregationActions.AVG} onClick={onClick}>
            Average
          </MenuItem>
          <MenuItem value={FileContentAggregationActions.MIN} onClick={onClick}>
            Minimum
          </MenuItem>
          <MenuItem value={FileContentAggregationActions.MAX} onClick={onClick}>
            Maximum
          </MenuItem>
          <MenuItem value={FileContentAggregationActions.COUNT} onClick={onClick}>
            Count
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
