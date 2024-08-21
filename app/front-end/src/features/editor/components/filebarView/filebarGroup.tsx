import { List } from '@mui/material';

export interface FilebarGroupProps {
  children: React.ReactNode;
}

/**
 * `FilebarGroup` is a functional component that arranges its children in a horizontal list layout.
 *
 * @description This component is designed to group its child components in a horizontal row using Material-UI's `List` component.
 * It applies styles to ensure that the child elements are displayed in a flexible, row-wise layout that allows horizontal scrolling.
 *
 * @component
 *
 * @example
 * // Example usage of the FilebarGroup component
 * <FilebarGroup>
 *   <FilebarItem />
 *   <FilebarItem />
 * </FilebarGroup>
 *
 * @param {FilebarGroupProps} props - The props object for the FilebarGroup component.
 * @param {React.ReactNode} props.children - The child elements to be displayed inside the FilebarGroup.
 *
 * @returns {JSX.Element} The `List` component containing the grouped child elements.
 */
export const FilebarGroup: React.FC<FilebarGroupProps> = ({ children }) => {
  return (
    <List sx={{ display: 'flex', flexDirection: 'row', height: '100%', p: '0', overflowX: 'auto' }}>{children}</List>
  );
};
