import { Button, useTheme } from '@mui/material';
import { alpha } from '@mui/system';

export interface ToolbarGroupsSelectorItemProps {
  id: string;
  label: string;
  onClick: () => void;
  groupRef?: string;
}

/**
 * ToolbarGroupsSelectorItem component renders a button that represents an individual toolbar group.
 *
 * @description This component is a styled `Button` from Material-UI, used to represent an item in the toolbar groups selector.
 * The button's background color changes based on whether it is selected or not, determined by comparing its `id` with `groupRef`.
 * The button triggers a provided `onClick` function when clicked.
 *
 * @component
 *
 * @example
 * // Example usage of the ToolbarGroupsSelectorItem component
 * return (
 *   <ToolbarGroupsSelectorItem id="group1" label="Group 1" onClick={handleGroupClick} groupRef="group1" />
 * );
 *
 * @param {string} id - The unique identifier for the toolbar group item.
 * @param {string} label - The text label displayed inside the button.
 * @param {Function} onClick - The function to be called when the button is clicked.
 * @param {string} [groupRef] - An optional reference string used to determine if this item is the currently selected one.
 * @returns {JSX.Element} The rendered Button component.
 */
export const ToolbarGroupsSelectorItem: React.FC<ToolbarGroupsSelectorItemProps> = ({
  id,
  label,
  onClick,
  groupRef,
}) => {
  const Theme = useTheme();

  return (
    <Button
      id={id}
      sx={{
        height: '100%',
        bgcolor: groupRef === id ? Theme.palette.background.paper : Theme.palette.action.selected,
        borderRadius: '0rem',
        px: '3rem',
        fontWeight: 'bold',
        color: Theme.palette.text.primary,
        ':hover': {
          backgroundColor:
            groupRef === id ? Theme.palette.background.paper : alpha(Theme.palette.background.paper, 0.5),
        },
      }}
      onClick={() => onClick()}
    >
      {label}
    </Button>
  );
};
