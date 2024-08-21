import { FilebarGroupItemProps } from '@/features/editor/components/filebarView';
import { FileTypes } from '@/types';
import React, { createContext, useState } from 'react';

export interface WorkspaceContextProps {
  fileId: string;
  fileLabel: string;
  fileType: FileTypes;
  update: (newId: string, newLabel: string, newType: FileTypes) => void;
  fileHistory: FilebarGroupItemProps[];
  remove: (fileId: string) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextProps>({
  fileId: '',
  fileLabel: '',
  fileType: FileTypes.FOLDER,
  update: () => {},
  fileHistory: [],
  remove: () => {},
});

interface Props {
  children?: React.ReactNode;
}

/**
 * `WorkspaceContextProvider` is a component that provides context for managing the current workspace file's state.
 *
 * @description This component sets up a React context for managing and sharing workspace file information across the
 * application. It tracks the current file's ID, label, and type, and provides an API to update these values. The context
 * also maintains a history of recently opened files (excluding folders) and supports removing files from this history.
 *
 * The context includes:
 * - `fileId`: The unique identifier for the current file.
 * - `fileLabel`: The label or name of the current file.
 * - `fileType`: The type of the file (e.g., folder, document).
 * - `update`: A function to update the current file's ID, label, and type, and add the file to the history.
 * - `fileHistory`: An array of recently opened files, excluding folders.
 * - `remove`: A function to remove a file from the history and update the current file if the removed file was active.
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
  const [fileHistory, setFileHistory] = useState<FilebarGroupItemProps[]>([]);

  const update = (newId: string, newLabel: string, newType: FileTypes) => {
    setFileId(newId);
    setFileLabel(newLabel);
    setFileType(newType);
    setFileHistory((prevHistory) => {
      // Prevent adding directories to history
      if (newType === FileTypes.FOLDER) {
        return prevHistory;
      }

      // Prevent adding duplicate files
      if (prevHistory.find((item) => item.fileId === newId)) {
        return prevHistory;
      }

      // Add the new file to the history
      return [...prevHistory, { fileId: newId, fileLabel: newLabel, fileType: newType }];
    });
  };

  const remove = (fileId_remove: string) => {
    setFileHistory((prevHistory) => {
      // Remove the file from the history
      const newHistory = prevHistory.filter((item) => item.fileId !== fileId_remove);

      // Check if the file being removed was the current file
      if (fileId === fileId_remove) {
        // If there are no files left, reset the file state
        if (newHistory.length === 0) {
          setFileId('');
          setFileLabel('');
          setFileType(FileTypes.FOLDER);
        } else {
          // Set the state to the latest file in the history
          const latest_file = newHistory[newHistory.length - 1];
          setFileId(latest_file.fileId);
          setFileLabel(latest_file.fileLabel);
          setFileType(latest_file.fileType);
        }
      }

      return newHistory;
    });
  };

  const WorkspaceContextValue: WorkspaceContextProps = {
    fileId,
    fileLabel,
    fileType,
    update,
    fileHistory,
    remove,
  };

  return <WorkspaceContext.Provider value={WorkspaceContextValue}>{children}</WorkspaceContext.Provider>;
};
