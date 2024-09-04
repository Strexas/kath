import { EditorColumnMenu, EditorHeader, EditorToolbar } from '@/features/editor/components/editorView';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileContentAggregationActions, FileDataRequestDTO, FileDataResponseDTO } from '@/features/editor/types';
import { useSessionContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

/**
 * `EditorView` component is a data grid view that allows users to interact with and manipulate file content within the editor.
 *
 * @description
 * The `EditorView` component:
 * - Displays a data grid with file content, including rows and columns.
 * - Allows users to edit the file content and save changes.
 * - Supports pagination and data aggregation functionalities.
 * - Utilizes the `DataGrid` component from Material-UI's X Data Grid library to render and manage the grid.
 *
 * The component integrates with:
 * - `WorkspaceContext` to manage the file state, content, and pagination.
 * - `SessionContext` to handle connection status.
 * - Axios for making API requests to fetch and save file content.
 * - WebSocket for real-time updates.
 *
 * Key functionalities include:
 * - Fetching file content from the backend and updating the grid when the file or pagination changes.
 * - Handling pagination changes and updating the file state accordingly.
 * - Supporting data aggregation actions like sum, average, etc., which can be triggered via the column menu.
 * - Saving changes to the file content and updating the server with new data and aggregations.
 *
 * @component
 *
 * @example
 * // Usage of the EditorView component within a parent component
 * import React from 'react';
 * import { EditorView } from '@/features/editor/components/editorView';
 *
 * const MyEditorPage = () => (
 *   <div style={{ height: '600px', width: '100%' }}>
 *     <EditorView />
 *   </div>
 * );
 *
 * export default MyEditorPage;
 *
 * @returns {JSX.Element} The rendered data grid view component.
 */
export const EditorView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileContentResponse, setFileContentResponse] = useState<FileDataResponseDTO>({
    totalRows: 0,
    header: [],
    rows: [],
    page: 0,
  });

  const { connected } = useSessionContext();
  const { file, fileContent, filePagination, fileStateReset, fileStateUpdate } = useWorkspaceContext();
  const ref = useGridApiRef();

  const handleSave = async () => {
    const data: FileDataRequestDTO = {
      page: filePagination.page,
      rowsPerPage: filePagination.rowsPerPage,
      header: ref.current.getAllColumns().map((column) => column.field),
      rows: ref.current
        .getAllRowIds()
        .map((rowId) => ref.current.getAllColumns().map((column) => ref.current.getCellValue(rowId, column.field))),
    };

    try {
      const fileContentResponse = await axios.put<FileDataResponseDTO>(`${Endpoints.WORKSPACE_FILE}/${file.id}`, data);
      setFileContentResponse(fileContentResponse.data);

      const responseAggregate = await axios.get(`${Endpoints.WORKSPACE_AGGREGATE}/all/${file.id}`, {
        params: {
          columnsAggregation: JSON.stringify(fileContent.aggregations),
        },
      });

      const { columnsAggregation: responseColumnsAggregation } = responseAggregate.data;
      fileStateUpdate(undefined, { ...fileContent, aggregations: responseColumnsAggregation }, undefined);
    } catch (error) {
      console.error('Failed to save file content:', error);
    }
  };

  const handleAggregation = async (column: string, action: FileContentAggregationActions) => {
    switch (action) {
      case FileContentAggregationActions.NONE:
        const { [column]: _, ...rest } = fileContent.aggregations;
        fileStateUpdate(undefined, { ...fileContent, aggregations: rest }, undefined);
        break;
      default:
        {
          const response = await axios.get(`${Endpoints.WORKSPACE_AGGREGATE}/${file.id}`, {
            params: {
              field: column,
              action: action,
            },
          });

          const { field: responseField, action: responseAction, value: responseValue } = response.data;

          const newAggregations = {
            ...fileContent.aggregations,
            [responseField]: { action: responseAction, value: responseValue },
          };
          fileStateUpdate(undefined, { ...fileContent, aggregations: newAggregations }, undefined);
        }
        break;
    }
  };

  const getWorkspaceFile = useCallback(async () => {
    if (!file.id) {
      setFileContentResponse({ totalRows: 0, header: [], rows: [], page: 0 });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get<FileDataResponseDTO>(`${Endpoints.WORKSPACE_FILE}/${file.id}`, {
        params: {
          page: filePagination.page,
          rowsPerPage: filePagination.rowsPerPage,
        },
      });

      setFileContentResponse(response.data);
    } catch (error) {
      console.error('Failed to fetch file content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [file.id, filePagination.page, filePagination.rowsPerPage]);

  // File content fetching effect
  useEffect(() => {
    if (connected) getWorkspaceFile();
  }, [connected, getWorkspaceFile]);

  // Aggregation reset effect
  useEffect(() => {
    fileStateUpdate(undefined, { columns: fileContent.columns, rows: fileContent.rows, aggregations: {} }, undefined);
  }, [file.id]);

  // Parse file content response effect
  useEffect(() => {
    const { totalRows, header, rows } = fileContentResponse;

    if (!header) {
      fileStateUpdate(undefined, { columns: [], rows: [], aggregations: {} }, undefined);
      return;
    }

    const parsedColumns = header.map((value) => {
      return {
        field: value,
        headerName: value,
        flex: 1,
        minWidth: 150,
        editable: true,
        renderHeader: () => <EditorHeader columnName={value} gridColumnsAggregation={fileContent.aggregations} />,
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

    fileStateUpdate(
      undefined,
      { columns: parsedColumns, rows: parsedRows, aggregations: fileContent.aggregations },
      { page: filePagination.page, rowsPerPage: filePagination.rowsPerPage, totalRows: totalRows }
    );
  }, [fileContentResponse, fileContent.aggregations]);

  return (
    <DataGrid
      sx={{ height: '100%', border: 'none' }}
      loading={isLoading}
      rows={fileContent.rows}
      columns={fileContent.columns}
      pagination
      paginationMode='server'
      rowCount={filePagination.totalRows}
      disableColumnSorting
      initialState={{
        pagination: {
          paginationModel: { pageSize: filePagination.rowsPerPage, page: filePagination.page },
        },
      }}
      pageSizeOptions={[25, 50, 100]}
      onPaginationModelChange={(model) => {
        fileStateUpdate(undefined, undefined, {
          page: model.page,
          rowsPerPage: model.pageSize,
          totalRows: filePagination.totalRows,
        });
      }}
      slots={{
        toolbar: (props) => <EditorToolbar {...props} disabled={isLoading} handleSave={handleSave} />,
        columnMenu: (props) => <EditorColumnMenu {...props} handleAggregation={handleAggregation} />,
      }}
      slotProps={{
        toolbar: {},
      }}
      apiRef={ref}
    />
  );
};
