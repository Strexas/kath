import { FileTreeViewItemProps } from '@/features/editor/types';
import { useSessionContext } from '@/hooks';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { Box, LinearProgress } from '@mui/material';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useEffect, useState } from 'react';
import { FileTreeItem } from './fileTreeItem';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

/**
 * FileTreeView component displays a hierarchical tree view of files and directories.
 *
 * @description This component renders a `RichTreeView` with items fetched from the workspace endpoint. It displays a loading
 * indicator while the data is being fetched and presents the tree view when the data is loaded. The tree view uses `FileTreeItem`
 * to represent each item. The component handles asynchronous data fetching and provides visual feedback using `LinearProgress`.
 *
 * The `RichTreeView` component from Material-UI's TreeView package is utilized to render the hierarchical structure, with
 * a custom `item` slot for rendering each tree node via the `FileTreeItem` component.
 *
 * @component
 *
 * @example
 * // Example usage of the FileTreeView component
 * return (
 *   <FileTreeView />
 * );
 *
 * @returns {JSX.Element} The rendered tree view component, displaying either a loading indicator or the file tree.
 */
export const FileTreeView: React.FC = () => {
  const { connected } = useSessionContext();

  const [fileTreeViewData, setFileTreeViewData] = useState<TreeViewBaseItem<FileTreeViewItemProps>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getWorkspace = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(Endpoints.WORKSPACE);
        setFileTreeViewData(response.data);
      } catch (error) {
        console.error('Failed to fetch workspace data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected) getWorkspace();
  }, [connected]);

  return (
    <>
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <RichTreeView
          items={fileTreeViewData}
          sx={{ height: 'fit-content', flexGrow: 1, overflowY: 'auto' }}
          slots={{ item: FileTreeItem }}
        />
      )}
    </>
  );
};
