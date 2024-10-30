import { ConsoleFeedback, FileContentModel, FileModel, FilePaginationModel, FileTypes } from '@/features/editor/types';
import { getWorkspaceArray } from '@/features/editor/utils';
import { useSessionContext, useStatusContext } from '@/hooks';
import { axios, socket } from '@/lib';
import { Endpoints, Events } from '@/types';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import React, { createContext, useCallback, useEffect, useState } from 'react';

export interface WorkspaceContextProps {
  // File state properties
  file: FileModel;
  fileContent: FileContentModel;
  filePagination: FilePaginationModel;
  fileStateReset: () => void;
  fileStateUpdate: (file?: FileModel, fileContent?: FileContentModel, filePagination?: FilePaginationModel) => void;

  // File history state properties
  filesHistory: FileModel[];
  filesHistoryStateUpdate: (add?: FileModel, remove?: FileModel) => void;

  // File tree state properties
  fileTreeIsLoading: boolean;
  fileTree: TreeViewBaseItem<FileModel>[];
  fileTreeArray: FileModel[];

  // Console feedback state properties
  consoleFeedback: ConsoleFeedback[];
  consoleFeedbackReset: () => void;
  consoleFeedbackStateUpdate: (add: ConsoleFeedback) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextProps>({
  // File state defaults
  file: { id: '', label: '', type: FileTypes.FOLDER },
  fileContent: { columns: [], rows: [], aggregations: {}, sorts: {} },
  filePagination: { page: 0, rowsPerPage: 100, totalRows: 0 },
  fileStateReset: () => {},
  fileStateUpdate: () => {},

  // File history state defaults
  filesHistory: [],
  filesHistoryStateUpdate: () => {},

  // File tree state defaults
  fileTreeIsLoading: true,
  fileTree: [],
  fileTreeArray: [],

  // Console feedback state defaults
  consoleFeedback: [],
  consoleFeedbackReset: () => {},
  consoleFeedbackStateUpdate: () => {},
});

interface Props {
  children?: React.ReactNode;
}

/**
 * `WorkspaceContextProvider` component is a context provider that manages and provides the state for the editor's workspace.
 *
 * @description
 * The `WorkspaceContextProvider` encapsulates the logic and state management for:
 * - The currently selected file and its content.
 * - Pagination for the file content.
 * - A history of previously opened files.
 * - The hierarchical file tree representing the directory structure.
 *
 * This provider is responsible for:
 * - Fetching the file tree from the backend API and updating it in response to WebSocket events.
 * - Managing the state of the current file, including its content and pagination details.
 * - Maintaining a history of opened files, which allows users to navigate back to previously opened files.
 *
 * The component provides this state and functionality to its children through the `WorkspaceContext`.
 *
 * @component
 *
 * @example
 * // Wrap your components that need access to the workspace state within the WorkspaceContextProvider
 * import React from 'react';
 * import { WorkspaceContextProvider } from '@/features/editor/context/WorkspaceContext';
 * import MyEditorComponent from '@/features/editor/components/MyEditorComponent';
 *
 * const App = () => (
 *   <WorkspaceContextProvider>
 *     <MyEditorComponent />
 *   </WorkspaceContextProvider>
 * );
 *
 * @param {Props} props - The props object for this component.
 * @param {React.ReactNode} props.children - The child components that require access to the workspace context.
 *
 * @returns {JSX.Element} A context provider component that wraps its children with `WorkspaceContext`.
 *
 * @see {@link WorkspaceContext} for the context object that provides the workspace state and actions.
 */
export const WorkspaceContextProvider: React.FC<Props> = ({ children }) => {
  //
  // State management
  //

  // File state
  const [file, setFile] = useState<FileModel>({ id: '', label: '', type: FileTypes.FOLDER });
  const [fileContent, setFileContent] = useState<FileContentModel>({
    columns: [],
    rows: [],
    aggregations: {},
    sorts: {},
  });
  const [filePagination, setFilePagination] = useState<FilePaginationModel>({
    page: 0,
    rowsPerPage: 100,
    totalRows: 0,
  });

  const fileStateUpdate = (file?: FileModel, fileContent?: FileContentModel, filePagination?: FilePaginationModel) => {
    if (file) setFile(file);
    if (fileContent) setFileContent(fileContent);
    if (filePagination) setFilePagination(filePagination);
  };

  const fileStateReset = useCallback(() => {
    setFile({ id: '', label: '', type: FileTypes.FOLDER });
    setFileContent({ columns: [], rows: [], aggregations: {}, sorts: {} });
    setFilePagination({ page: 0, rowsPerPage: 100, totalRows: 0 });
  }, []);

  // File history state
  const [filesHistory, setFilesHistory] = useState<FileModel[]>([]);

  const filesHistoryStateUpdate = (add?: FileModel, remove?: FileModel) => {
    setFilesHistory((prevHistory) => {
      // Remove the file from the history
      if (remove) {
        prevHistory = prevHistory.filter((current) => current.id !== remove.id);

        // Check if the filed being removed was the current file
        if (file.id === remove?.id) {
          fileStateReset();
          // If there are files left in the history
          if (prevHistory.length !== 0) {
            // Set the state to the latest file in the history
            const latest_file = prevHistory[prevHistory.length - 1];
            setFile(latest_file);
            setFilePagination({ page: 0, rowsPerPage: 100, totalRows: 0 });
          }
        }
      }

      // Add the new file to the history
      if (add) {
        // Prevent adding directories to history
        if (add.type === FileTypes.FOLDER) return prevHistory;

        // Prevent adding duplicate files
        if (prevHistory.some((current) => current.id === add.id)) return prevHistory;

        // Add the new file to the history
        return [...prevHistory, add];
      }

      return prevHistory;
    });
  };

  // File tree state
  const [fileTreeIsLoading, setFileTreeIsLoading] = useState(true);
  const [fileTree, setFileTree] = useState<TreeViewBaseItem<FileModel>[]>([]);
  const [fileTreeArray, setFileTreeArray] = useState<FileModel[]>([]);

  const { blockedStateUpdate } = useStatusContext();

  const getWorkspace = useCallback(async () => {
    setFileTreeIsLoading(true);
    blockedStateUpdate(true);
    try {
      const response = await axios.get(Endpoints.WORKSPACE);
      setFileTree(response.data);
      setFileTreeArray(getWorkspaceArray(response.data));
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
    } finally {
      setFileTreeIsLoading(false);
      blockedStateUpdate(false);
    }
  }, []);

  //
  // Use effects for fetching data
  //

  const { connected } = useSessionContext();

  // File tree fetching effect
  useEffect(() => {
    if (connected) getWorkspace();

    socket.on(Events.WORKSPACE_UPDATE_FEEDBACK_EVENT, getWorkspace);

    return () => {
      socket.off(Events.WORKSPACE_UPDATE_FEEDBACK_EVENT);
    };
  }, [connected, getWorkspace]);

  // Console feedback state
  const [consoleFeedback, setConsoleFeedback] = useState<ConsoleFeedback[]>([]);
  
  const consoleFeedbackReset = () => {
    setConsoleFeedback([]);
  };

  const consoleFeedbackStateUpdate = (add: ConsoleFeedback) => {
    setConsoleFeedback((prev) => [...prev, add]);
  }

  const WorkspaceContextValue: WorkspaceContextProps = {
    file,
    fileContent,
    filePagination,
    fileStateReset,
    fileStateUpdate,

    filesHistory,
    filesHistoryStateUpdate,

    fileTreeIsLoading,
    fileTree,
    fileTreeArray,

    consoleFeedback,
    consoleFeedbackReset,
    consoleFeedbackStateUpdate,
  };

  return <WorkspaceContext.Provider value={WorkspaceContextValue}>{children}</WorkspaceContext.Provider>;
};
