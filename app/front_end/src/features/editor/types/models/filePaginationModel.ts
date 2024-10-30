/**
 * `FilePaginationModel` interface.
 *
 * @description This interface defines the structure of the FilePaginationModel object, which represents the pagination of a file.
 * The FilePaginationModel object contains the `page`, `rowsPerPage`, and `totalRows` of the file.
 */
export interface FilePaginationModel {
  page: number;
  rowsPerPage: number;
  totalRows: number;
}
