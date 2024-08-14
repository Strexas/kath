import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

/**
 * Editor component renders a DataGrid with sample data using Material-UI components.
 *
 * @description This component displays a `DataGrid` that is populated with demo data provided by the `useDemoData` hook.
 * It utilizes Material-UI's `Box` component for layout and theming with `useTheme`. The `DataGrid` is configured with a toolbar and
 * is editable. The data set is fetched using `useDemoData` with the 'Commodity' dataset and is configured to load 1000 rows.
 *
 * The component sets up a flexbox layout with a dynamic background color based on the current theme and occupies 60% of the available height.
 *
 * @component
 *
 * @example
 * // Example usage of the Editor component
 * return (
 *   <Editor />
 * );
 *
 * @returns {JSX.Element} The rendered Box component containing a DataGrid with demo data.
 */
export const Editor: React.FC = () => {
  // const rows: GridRowsProp = [
  //   { id: 1, col1: 'Hello', col2: 10 },
  //   { id: 2, col1: 'DataGridPro', col2: 2 },
  //   { id: 3, col1: 'MUI', col2: 52 },
  //   { id: 4, col1: 'Hello', col2: 10 },
  //   { id: 5, col1: 'DataGridPro', col2: 2 },
  //   { id: 6, col1: 'MUI', col2: 52 },
  // ];

  // const columns: GridColDef[] = [
  //   { field: 'col1', headerName: 'Column 1', width: 150 },
  //   { field: 'col2', headerName: 'Column 2', width: 150 },
  // ];

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    editable: true,
  });

  return (
    <>
      {/* <DataGrid rows={rows} columns={columns} slots={{ toolbar: GridToolbar }} /> */}
      <DataGrid {...data} loading={data.rows.length === 0} slots={{ toolbar: GridToolbar }} />
    </>
  );
};
