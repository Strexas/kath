import { FileContentAggregationModel } from '@/features/editor/types';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

/**
 * `FileContentModel` interface.
 *
 * @description This interface defines the structure of the FileContentModel object, which represents the content of a file.
 * The FileContentModel object contains the `columns`, `rows`, and `aggregations` of the file content.
 */
export interface FileContentModel {
  columns: GridColDef[];
  rows: GridRowsProp;
  aggregations: FileContentAggregationModel;
}
