import { useStatusContext } from '@/hooks';
import { SvgIconComponent } from '@mui/icons-material';
import { alpha, Box, Button, useTheme } from '@mui/material';

export interface ToolbarGroupItemProps {
  group: string;
  icon: SvgIconComponent;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * ToolbarGroupItem component renders a button item within a toolbar group.
 *
 * @description This component represents an individual item in the toolbar group. It uses Material-UI's `Button` component
 * with an icon and label. The button's styling is based on the theme, with hover effects applied. The button triggers
 * a provided `onClick` function when clicked.
 *
 * @component
 *
 * @example
 * // Example usage of the ToolbarGroupItem component
 * return (
 *   <ToolbarGroupItem
 *     group="group1"
 *     icon={SomeIcon}
 *     label="Item 1"
 *     onClick={handleClick}
 *   />
 * );
 *
 * @param {string} group - The group identifier to which this item belongs.
 * @param {SvgIconComponent} icon - The icon component to be displayed at the start of the button.
 * @param {string} label - The text label displayed inside the button.
 * @param {Function} onClick - The function to be called when the button is clicked.
 * @returns {JSX.Element} The rendered Button component with an icon and label.
 */
export const ToolbarGroupItem: React.FC<ToolbarGroupItemProps> = ({ icon: Icon, label, onClick, disabled }) => {
  const Theme = useTheme();
  const { blocked } = useStatusContext();

  return (
    <Box sx={{ height: '40%', alignContent: 'center' }}>
      <Button
        startIcon={<Icon sx={{ color: disabled || blocked ? Theme.palette.action.disabled : Theme.palette.text.primary }} />}
        disabled={disabled || blocked}
        onClick={() => onClick()}
        sx={{
          color: Theme.palette.text.primary,
          backgroundColor: alpha(Theme.palette.action.selected, 0.5),
          borderRadius: '0.625rem',
          px: '1rem',
          '&:hover': {
            backgroundColor: Theme.palette.action.selected,
          },
          textTransform: 'none',
        }}
      >
        {label}
      </Button>
    </Box>
  );
};
