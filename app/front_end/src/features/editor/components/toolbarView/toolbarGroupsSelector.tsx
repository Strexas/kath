import { List } from '@mui/material';

export interface ToolbarGroupsSelectorProps {
  children: React.ReactNode;
}

/**
 * ToolbarGroupsSelector component renders a list container that houses toolbar group items.
 *
 * @description This component is a wrapper around the Material-UI `List` component. It is used to display
 * a list of toolbar group items within a scrollable area. The height of the list is fixed at 25%, and
 * it has zero padding with an automatic overflow handling.
 *
 * @component
 *
 * @example
 * // Example usage of the ToolbarGroupsSelector component
 * return (
 *   <ToolbarGroupsSelector>
 *     <ToolbarGroupsSelectorItem id="1" label="Group 1" onClick={handleClick} />
 *     <ToolbarGroupsSelectorItem id="2" label="Group 2" onClick={handleClick} />
 *   </ToolbarGroupsSelector>
 * );
 *
 * @param {React.ReactNode} children - The child elements to be rendered inside the list.
 * @returns {JSX.Element} The rendered List component.
 */
export const ToolbarGroupsSelector: React.FC<ToolbarGroupsSelectorProps> = ({ children }) => {
  return <List sx={{ height: '20%', p: '0', overflow: 'auto' }}>{children}</List>;
};
