import { styled } from '@mui/material/styles';
import { GridColumnMenuContainer, GridColumnMenuHideItem, GridColumnMenuProps } from '@mui/x-data-grid';

const StyledGridColumnMenuContainer = styled(GridColumnMenuContainer)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
}));

interface GridColumnMenuContainerProps extends GridColumnMenuProps {}

/**
 * `EditorColumnMenu` component customizes the column menu in a DataGrid with a styled container.
 *
 * @description This component extends the default column menu functionality of the DataGrid by applying custom styles
 * to the menu container. The `StyledGridColumnMenuContainer` applies a background color from the theme's secondary palette
 * to the menu. The menu includes a `GridColumnMenuHideItem` for hiding the column, which invokes the `hideMenu` function
 * when clicked.
 *
 * @component
 *
 * @param {GridColumnMenuContainerProps} props - The props for the component.
 * @param {() => void} props.hideMenu - A callback function to hide the column menu.
 * @param {object} props.colDef - Column definition object passed to the menu.
 * @param {GridColumnMenuProps} [other] - Other props that are passed to the `GridColumnMenuContainer`.
 *
 * @example
 * // Example usage of the EditorColumnMenu component
 * <EditorColumnMenu
 *   hideMenu={() => console.log('Hide menu')}
 *   colDef={columnDefinition}
 * />
 *
 * @returns {JSX.Element} A styled `GridColumnMenuContainer` containing a `GridColumnMenuHideItem`.
 */
export const EditorColumnMenu: React.FC<GridColumnMenuContainerProps> = ({ hideMenu, colDef, ...other }) => {
  return (
    <StyledGridColumnMenuContainer hideMenu={hideMenu} colDef={colDef} {...other}>
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef!} />
    </StyledGridColumnMenuContainer>
  );
};
