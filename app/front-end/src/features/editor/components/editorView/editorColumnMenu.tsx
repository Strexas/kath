import { styled } from '@mui/material/styles';
import { GridColumnMenuContainer, GridColumnMenuHideItem, GridColumnMenuProps } from '@mui/x-data-grid';

const StyledGridColumnMenuContainer = styled(GridColumnMenuContainer)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
}));

interface GridColumnMenuContainerProps extends GridColumnMenuProps {}

export const EditorColumnMenu: React.FC<GridColumnMenuContainerProps> = ({ hideMenu, colDef, ...other }) => {
  return (
    <StyledGridColumnMenuContainer hideMenu={hideMenu} colDef={colDef} {...other}>
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef!} />
    </StyledGridColumnMenuContainer>
  );
};
