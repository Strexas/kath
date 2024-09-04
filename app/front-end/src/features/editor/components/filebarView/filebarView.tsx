import { FilebarGroup, FilebarGroupItem } from '@/features/editor/components/filebarView';
import { useWorkspaceContext } from '@/features/editor/hooks';

/**
 * `FilebarView` is a functional component that renders a group of file items currently open in the workspace.
 *
 * @description This component utilizes the `FilebarGroup` and `FilebarGroupItem` components to display the files
 * that have been recently opened in the workspace. It maps over the `fileHistory` from the workspace context to generate
 * individual `FilebarGroupItem` components for each file.
 *
 * @component
 *
 * @example
 * // Example usage of the FilebarView component
 * <FilebarView />
 *
 * @returns {JSX.Element} A `FilebarGroup` component containing a list of `FilebarGroupItem` components.
 */
export const FilebarView: React.FC = () => {
  const { filesHistory } = useWorkspaceContext();

  return (
    <FilebarGroup>
      {filesHistory.map((file, index) => (
        <FilebarGroupItem key={index} {...file} />
      ))}
    </FilebarGroup>
  );
};
