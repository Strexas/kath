import { List, useTheme } from '@mui/material';

export interface ToolbarGroupProps {
  children: React.ReactNode;
}

/**
 * ToolbarGroup component renders a container for a group of toolbar items.
 *
 * @description This component uses the Material-UI `List` component to arrange toolbar items in a flexible, scrollable
 * container. The list is styled with a background color, padding, and flexbox properties to wrap items and handle overflow.
 * It allows children elements to be passed and displayed within the container.
 *
 * @component
 *
 * @example
 * // Example usage of the ToolbarGroup component
 * return (
 *   <ToolbarGroup>
 *     <ToolbarGroupItem group="group1" icon={SomeIcon} label="Item 1" onClick={handleClick} />
 *     <ToolbarGroupItem group="group1" icon={AnotherIcon} label="Item 2" onClick={handleClick} />
 *   </ToolbarGroup>
 * );
 *
 * @param {React.ReactNode} children - The child elements to be displayed inside the list.
 * @returns {JSX.Element} The rendered List component.
 */
export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children }) => {
  const Theme = useTheme();

  return (
    <List
      sx={{
        height: '75%',
        bgcolor: Theme.palette.background.paper,
        px: '1rem',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '1rem',
        overflow: 'auto',
        alignContent: 'flex-start',
      }}
    >
      {children}
    </List>
  );
};
