
/**
 * `FileTypes` enum defines the types of files that can be used in the application.
 */
export enum FileTypes {
  // generic
  FILE = 'file',
  FOLDER = 'folder',

  // specific
  CSV = 'csv',
  TXT = 'txt',
}


/**
 * `FileModel` interface.
 * 
 *  @description This interface defines the structure of the FileModel object, which represents a file in the application.
 *  The FileModel object contains the `id`, `label`, and `type` of the file.
 */
export interface FileModel {
  id: string;
  label: string;
  type: FileTypes;
  parent?: FileModel; 
}
