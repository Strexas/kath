import { EditorColumnMenuAggregationItem, EditorColumnMenuSortItem } from '@/features/editor/components/editorView';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileContentAggregationActions, SortEnum } from '@/features/editor/types';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridColumnMenuContainer, GridColumnMenuHideItem, GridColumnMenuProps } from '@mui/x-data-grid';

const StyledGridColumnMenuContainer = styled(GridColumnMenuContainer)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
}));

interface GridColumnMenuContainerProps extends GridColumnMenuProps {
  disabled: boolean;
  handleAggregation: (column: string, action: FileContentAggregationActions) => void;
  handleSort: (column: string, sort: SortEnum) => void;
}

/**
 * `EditorColumnMenu` component provides a custom column menu for data grid columns,
 * allowing users to apply aggregations and hide columns.
 *
 * @description
 * The `EditorColumnMenu` is used within a `DataGrid` to offer additional options for column management.
 * It includes options for applying different aggregation actions (e.g., sum, average) to the column data,
 * and provides an option to hide the column.
 *
 * - **Aggregation:** Users can select from various aggregation actions (sum, average, minimum, maximum, count) for the column.
 * - **Hide Column:** Provides an option to hide the column from the data grid.
 *
 * This component leverages `EditorColumnMenuAggregationItem` to render the aggregation options and `GridColumnMenuHideItem` for hiding the column.
 *
 * @component
 */
export const EditorColumnMenu: React.FC<GridColumnMenuContainerProps> = ({
  disabled,
  handleAggregation,
  handleSort,
  hideMenu,
  colDef,
  ...other
}) => {
  const { fileContent } = useWorkspaceContext();
  const aggregationActiveAction = fileContent.aggregations[colDef.field]
    ? fileContent.aggregations[colDef.field].action
    : FileContentAggregationActions.NONE;

  return !disabled ? (
    <StyledGridColumnMenuContainer hideMenu={hideMenu} colDef={colDef} {...other}>
      <EditorColumnMenuSortItem
        onClick={hideMenu}
        onSort={(sort: SortEnum) => handleSort(colDef.field, sort)}
      ></EditorColumnMenuSortItem>
      <Divider />
      <EditorColumnMenuAggregationItem
        initialValue={aggregationActiveAction}
        onClick={hideMenu}
        onAction={(action) => handleAggregation(colDef.field, action)}
      />
      <Divider />
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef!} />
    </StyledGridColumnMenuContainer>
  ) : null;
};
