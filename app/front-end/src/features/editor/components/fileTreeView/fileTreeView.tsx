import { FileTreeViewMockData } from '@/features/editor/mockData';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { FileTreeItem } from './fileTreeItem';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

/**
 * FileTreeView component renders a tree view with sample file structure data using Material-UI components.
 *
 * @description This component displays a `RichTreeView` that is populated with mock file structure data provided by
 * `FileTreeViewMockData`. It leverages the `FileTreeItem` component to render each item in the tree view, allowing for
 * custom rendering and behavior of tree nodes. The tree view's layout is styled with the `sx` prop, ensuring it is responsive
 * and scrollable.
 *
 * The component sets up a tree view with a dynamic height based on its content, grows within its flex container,
 * and allows vertical scrolling when the content overflows.
 *
 * @component
 *
 * @example
 * // Example usage of the FileTreeView component
 * return (
 *   <FileTreeView />
 * );
 *
 * @returns {JSX.Element} The rendered RichTreeView component containing the file tree structure.
 */
export const FileTreeView: React.FC = () => {
  return (
    <RichTreeView
      items={FileTreeViewMockData}
      sx={{ height: 'fit-content', flexGrow: 1, overflowY: 'auto' }}
      slots={{ item: FileTreeItem }}
    />
  );
};
