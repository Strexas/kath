import { EditorToolbar } from '@/features/editor/components/editorView';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { axios, socket } from '@/lib';
import { Endpoints, FileTypes } from '@/types';
import { getUUID } from '@/utils';
import { DataGrid, GridColDef, GridRowsProp, useGridApiRef } from '@mui/x-data-grid';
import Papa from 'papaparse';
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
  const gridApiRef = useGridApiRef();
  const Workspace = useWorkspaceContext();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getWorkspaceFile = async () => {
      if (Workspace.fileType === FileTypes.FOLDER) return;

      setIsLoading(true);

      try {
        const response = await axios.get(`${Endpoints.WORKSPACE}/${Workspace.fileId}`);
        const data = response.data;
        const result = Papa.parse(data, { header: true, skipEmptyLines: true });

        const columns = result.meta.fields?.map((field, index) => ({
          field: `col${index}`,
          headerName: field,
          width: 150,
          editable: true,
        }));

        // TODO: might need to adress this with type declaration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = result.data.map((row: any, index) => ({
          id: index,
          ...result.meta.fields?.reduce((acc, field, index) => ({ ...acc, [`col${index}`]: row[field] }), {}),
        }));

        setColumns(columns || []);
        setRows(rows || []);
      } catch (error) {
        console.error('Failed to fetch file content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getWorkspaceFile();
  }, [Workspace.fileId, Workspace.fileType]);

  const handleSave = () => {
    const header = gridApiRef.current
      .getAllColumns()
      .map((column) => column.headerName)
      .join(',')
      .concat('\n');

    const rows = gridApiRef.current
      .getAllRowIds()
      .map((rowId) => {
        return gridApiRef.current
          .getAllColumns()
          .map((column) => {
            const cellValue = gridApiRef.current.getCellValue(rowId, column.field);

            // If the cell value contains a comma, wrap it in quotes
            return cellValue.includes(',') ? `"${cellValue}"` : cellValue;
          })
          .join(',');
      })
      .join('\n');

    const content = header.concat(rows);

    socket.emit('workspace_file_update', {
      uuid: getUUID(),
      fileId: Workspace.fileId,
      content: content,
    });
  };

  return (
    <DataGrid
      sx={{ height: '100%' }}
      loading={isLoading}
      rows={rows}
      columns={columns}
      slots={{ toolbar: (props) => <EditorToolbar {...props} disabled={isLoading} handleSave={handleSave} /> }}
      apiRef={gridApiRef}
    />
  );
};
