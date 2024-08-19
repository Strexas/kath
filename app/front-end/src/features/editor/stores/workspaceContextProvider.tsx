import { FileTypes } from '@/types';
import React, { createContext, useState } from 'react';

export interface WorkspaceContextProps {
  fileId: string;
  fileLabel: string;
  fileType: FileTypes;
  update: (newId: string, newLabel: string, newType: FileTypes) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextProps>({
  fileId: '',
  fileLabel: '',
  fileType: FileTypes.FOLDER,
  update: () => {},
});

interface Props {
  children?: React.ReactNode;
}

/**
 * WorkspaceContextProvider component provides context for managing the current workspace file's state.
 *
 * @description This component sets up a React context for sharing workspace file information across components. It manages
 * the current file's ID, label, and type, and provides a function to update these values. The context is created using
 * `createContext` and provided to the component tree via `WorkspaceContext.Provider`. The context is intended for use in
 * scenarios where multiple components need access to or need to update the current workspace file's details.
 *
 * The context includes:
 * - `fileId`: The unique identifier for the current file.
 * - `fileLabel`: The label or name of the current file.
 * - `fileType`: The type of the file (e.g., folder, document).
 * - `update`: A function to update the current file's ID, label, and type.
 *
 * @component
 *
 * @example
 * // Example usage of the WorkspaceContextProvider component
 * return (
 *   <WorkspaceContextProvider>
 *     <YourComponent />
 *   </WorkspaceContextProvider>
 * );
 *
 * @param {Object} props - The props for the WorkspaceContextProvider component.
 * @param {React.ReactNode} [props.children] - Optional child components that will have access to the workspace context.
 *
 * @returns {JSX.Element} The `WorkspaceContext.Provider` with the current workspace context value.
 */
export const WorkspaceContextProvider: React.FC<Props> = ({ children }) => {
  const [fileId, setFileId] = useState<string>('');
  const [fileLabel, setFileLabel] = useState<string>('');
  const [fileType, setFileType] = useState<FileTypes>(FileTypes.FOLDER);

  const update = (newId: string, newLabel: string, newType: FileTypes) => {
    setFileId(newId);
    setFileLabel(newLabel);
    setFileType(newType);
  };

  const WorkspaceContextValue: WorkspaceContextProps = {
    fileId,
    fileLabel,
    fileType,
    update,
  };

  return <WorkspaceContext.Provider value={WorkspaceContextValue}>{children}</WorkspaceContext.Provider>;
};
