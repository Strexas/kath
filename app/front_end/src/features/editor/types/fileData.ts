type FileData = {
  page: number;
  header: string[];
  rows: string[][];
};

export type FileDataRequestDTO = FileData & {
  rowsPerPage: number;
};

export type FileDataResponseDTO = FileData & {
  totalRows: number;
};
