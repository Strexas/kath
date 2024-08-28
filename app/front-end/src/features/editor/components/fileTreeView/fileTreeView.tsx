import { FileTreeItem, FileTreeItemContextMenu } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { FileTreeViewItemProps } from '@/features/editor/types';
import { useSessionContext } from '@/hooks';
import { axios, socket } from '@/lib';
import { Endpoints, Events } from '@/types';
import { Box, Button, LinearProgress } from '@mui/material';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useCallback, useEffect, useState } from 'react';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

/**
 * `FileTreeView` component renders a hierarchical tree view of files and directories.
 *
 * @description This component utilizes `RichTreeView` from Material-UI to display a hierarchical view of files and directories
 * fetched from the workspace endpoint. It handles loading states with `LinearProgress` and displays a context menu for file
 * operations. The context menu is controlled by state and provides options such as creating new files or folders.
 *
 * The component:
 * - Fetches file tree data asynchronously from the workspace API endpoint.
 * - Displays a loading indicator while data is being fetched.
 * - Renders the file tree using `FileTreeItem` for each item.
 * - Manages the state and position of a context menu that appears on right-click or button click.
 * - Listens for updates via WebSocket to refresh the file tree data.
 *
 * @component
 *
 * @example
 * // Example usage of the FileTreeView component
 * return (
 *   <FileTreeView />
 * );
 *
 * @returns {JSX.Element} The rendered tree view component, showing either a loading indicator or the file tree.
 */
export const FileTreeView: React.FC = () => {
  const { connected } = useSessionContext();

  const [fileTreeViewData, setFileTreeViewData] = useState<TreeViewBaseItem<FileTreeViewItemProps>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const handleOpenContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setContextMenu(event.currentTarget);
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setContextMenuPosition({ top: 0, left: 0 });
  };

  const getWorkspace = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(Endpoints.WORKSPACE);
      setFileTreeViewData(response.data);
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (connected) {
      getWorkspace();
    }

    socket.on(Events.WORKSPACE_UPDATE_FEEDBACK_EVENT, getWorkspace);

    return () => {
      socket.off(Events.WORKSPACE_UPDATE_FEEDBACK_EVENT);
    };
  }, [connected, getWorkspace]);

  return (
    <>
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <Button variant='outlined' onClick={(event) => handleOpenContextMenu(event)} sx={{ mb: '1.5rem' }}>
            New
          </Button>
          <FileTreeItemContextMenu
            item={{ id: '', label: '', fileType: undefined }}
            anchorPosition={contextMenuPosition}
            open={Boolean(contextMenu)}
            onClose={handleCloseContextMenu}
          />
          <RichTreeView
            items={fileTreeViewData}
            sx={{ height: 'fit-content', flexGrow: 1, overflowY: 'auto' }}
            slots={{ item: FileTreeItem }}
          />
        </>
      )}
    </>
  );
};
