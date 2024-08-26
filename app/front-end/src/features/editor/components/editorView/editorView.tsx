import { EditorColumnMenu, EditorToolbar } from '@/features/editor/components/editorView';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileDataRequestDTO, FileDataResponseDTO } from '@/features/editor/types';
import { useSessionContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { DataGrid, GridColDef, GridRowsProp, useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

/**
 * EditorView component renders a DataGrid with dynamic columns and rows fetched from a workspace file.
 *
 * @description This component utilizes the `DataGrid` from Material-UI to display tabular data. The data is fetched asynchronously
 * from a server endpoint based on the current workspace context. The file's content is parsed using `PapaParse`, with columns
 * and rows being dynamically created based on the parsed data. The grid supports editing, and includes a custom toolbar
 * provided by the `EditorToolbar` component. Data loading and saving functionalities are integrated, with state management
 * for loading status and grid data.
 *
 * The component initializes the grid with data fetched from a specified file in the workspace, handles the conversion of
 * this data into grid-compatible formats, and allows users to save modifications back to the server.
 *
 * The component uses `useGridApiRef` to interact with the DataGrid API and `useWorkspaceContext` to access workspace information.
 *
 * @component
 *
 * @example
 * // Example usage of the EditorView component
 * return (
 *   <EditorView />
 * );
 *
 * @returns {JSX.Element} The rendered DataGrid component populated with data from the workspace file.
 */
export const EditorView: React.FC = () => {
  const { connected } = useSessionContext();
  const gridApiRef = useGridApiRef();
  const Workspace = useWorkspaceContext();

  const [gridColumns, setgridColumns] = useState<GridColDef[]>([]);
  const [gridRows, setgridRows] = useState<GridRowsProp>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getWorkspaceFile = async () => {
      if (!Workspace.fileId) {
        setgridColumns([]);
        setgridRows([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await axios.get(`${Endpoints.WORKSPACE}/${Workspace.fileId}`, {
          params: {
            page: page,
            rowsPerPage: rowsPerPage,
          },
        });

        const { totalRows, header, rows } = response.data as FileDataResponseDTO;

        const parsedColumns = header.map((value) => {
          return {
            field: value,
            headerName: value,
            width: 150,
            editable: true,
          };
        });

        const parsedRows = rows.map((row, index) => {
          return {
            id: index,
            ...row.reduce((acc, value, index) => {
              return { ...acc, [header[index]]: value };
            }, {}),
          };
        });

        setgridColumns(parsedColumns || []);
        setgridRows(parsedRows || []);
        setTotalRows(totalRows);
      } catch (error) {
        console.error('Failed to fetch file content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected) getWorkspaceFile();
  }, [connected, Workspace.fileId, Workspace.fileType, page, rowsPerPage]);

  const handleSave = () => {
    const data: FileDataRequestDTO = {
      page: page,
      rowsPerPage: rowsPerPage,
      header: gridApiRef.current.getAllColumns().map((column) => column.field),
      rows: gridApiRef.current
        .getAllRowIds()
        .map((rowId) =>
          gridApiRef.current.getAllColumns().map((column) => gridApiRef.current.getCellValue(rowId, column.field))
        ),
    };

    axios.put(`${Endpoints.WORKSPACE}/${Workspace.fileId}`, data);
  };

  return (
    <DataGrid
      sx={{ height: '100%', border: 'none' }}
      loading={isLoading}
      rows={gridRows}
      columns={gridColumns}
      pagination
      paginationMode='server'
      rowCount={totalRows}
      disableColumnSorting
      initialState={{
        pagination: {
          paginationModel: { pageSize: rowsPerPage, page: page },
        },
      }}
      pageSizeOptions={[25, 50, 100]}
      onPaginationModelChange={(model) => {
        setPage(model.page);
        setRowsPerPage(model.pageSize);
      }}
      slots={{
        toolbar: (props) => <EditorToolbar {...props} disabled={isLoading} handleSave={handleSave} />,
        columnMenu: (props) => <EditorColumnMenu {...props} />,
      }}
      apiRef={gridApiRef}
    />
  );
};
