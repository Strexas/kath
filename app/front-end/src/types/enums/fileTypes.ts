/**
 * `FileTypes` enumeration defines the different types of files and folders used in the application.
 *
 * @description This enum provides a set of constants representing various file types and folder categories. Each constant
 * maps to a string value that corresponds to a specific file or folder type. This enumeration helps in managing and distinguishing
 * between different file formats and organizational structures within the application.
 *
 * The enum includes:
 * - `FILE`: A generic type representing a file.
 * - `TXT`: Represents a plain text file with a `.txt` extension.
 * - `CSV`: Represents a comma-separated values file with a `.csv` extension.
 * - `DOC`: Represents a document file with a `.doc` extension.
 * - `FOLDER`: Represents a folder or directory.
 *
 * @enum {string}
 * @property {string} FILE - A generic type for files.
 * @property {string} TXT - The file type for plain text files.
 * @property {string} CSV - The file type for CSV (comma-separated values) files.
 * @property {string} DOC - The file type for document files.
 * @property {string} FOLDER - The type representing a folder or directory.
 *
 * @example
 * // Example usage of FileTypes
 * const fileType = FileTypes.TXT;
 * if (fileType === FileTypes.CSV) {
 *   console.log('This is a CSV file');
 * }
 */
export enum FileTypes {
  // generic
  FILE = 'file',
  
  TXT = 'txt',
  CSV = 'csv',
  DOC = 'doc',
  FOLDER = 'folder',
}
