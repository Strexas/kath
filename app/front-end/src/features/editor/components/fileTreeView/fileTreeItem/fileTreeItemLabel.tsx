import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TreeItem2Label } from '@mui/x-tree-view/TreeItem2';

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

const FileTreeItemLabelIcon = () => {
  const Theme = useTheme();
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: Theme.palette.primary.main,
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
};

const StyledFileTreeItemLabelTypography = styled(Typography)({
  color: 'inherit',
  fontSize: '1rem',
  fontWeight: 500,
  maxWidth: '100%',
  wordWrap: 'break-word',
}) as unknown as typeof Typography;

/**
 * FileTreeItemLabel component renders a custom label for a tree item, including optional icon and expandable indicator.
 *
 * @description This component is used to display the label for a tree item within a hierarchical file tree view. It integrates
 * with Material-UI's `TreeItem2Label` for consistent styling and layout. The label can include an optional icon and an indicator
 * for expandable items. It uses `Box` for layout and `Typography` for text styling.
 *
 * The component provides a flexible and styled label that adapts based on whether an icon is provided and whether the item
 * is expandable. It uses the theme from Material-UI for consistent color styling.
 *
 * @component
 *
 * @example
 * // Example usage of the FileTreeItemLabel component
 * return (
 *   <FileTreeItemLabel
 *     icon={FolderIcon}
 *     expandable={true}
 *   >
 *     Example Folder
 *   </FileTreeItemLabel>
 * );
 *
 * @param {Object} props - The props for the FileTreeItemLabel component.
 * @param {React.ElementType} [props.icon] - Optional icon component to be displayed alongside the label.
 * @param {boolean} [props.expandable] - Optional flag indicating if the item is expandable, which adds an expandable indicator.
 * @param {React.ReactNode} props.children - The text or content to be displayed in the label.
 * @param {Object} [props.other] - Additional props to be passed to the `TreeItem2Label` component.
 *
 * @returns {JSX.Element} The rendered label for the tree item, including the icon and expandable indicator if applicable.
 */
export const FileTreeItemLabel = ({ icon: Icon, expandable, children, ...other }: CustomLabelProps) => {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && <Box component={Icon} className='labelIcon' color='inherit' sx={{ mr: 1, fontSize: '1.2rem' }} />}

      <StyledFileTreeItemLabelTypography>{children}</StyledFileTreeItemLabelTypography>
      {expandable && <FileTreeItemLabelIcon />}
    </TreeItem2Label>
  );
};
