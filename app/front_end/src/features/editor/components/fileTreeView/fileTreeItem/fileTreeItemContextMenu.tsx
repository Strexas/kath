import { EditorConfirmLeave } from '@/features/editor/components/editorView';
import {
  FileTreeItemContextMenuConfirmationDialog,
  FileTreeItemContextMenuFileImportDialog,
  FileTreeItemContextMenuTextfieldDialog,
} from '@/features/editor/components/fileTreeView/fileTreeItem';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileTreeItemContextMenuActions, FileTreeViewItemProps, FileTypes } from '@/features/editor/types';
import { useStatusContext } from '@/hooks';
import { axios, socket } from '@/lib';
import { Endpoints, Events } from '@/types';
import { getSID, getUUID } from '@/utils';
import { Divider, Menu, MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';

export interface FileTreeItemContextMenuProps {
  item: FileTreeViewItemProps;
  anchorPosition: { top: number; left: number };
  open: boolean;
  onClose: () => void;
}

/**
 * `FileTreeItemContextMenu` component provides a context menu for file tree items with options for creating, renaming,
 * deleting files and folders, as well as other related actions.
 *
 * @description This component displays a context menu that allows users to perform various actions on file tree items,
 * such as creating new files or folders, renaming existing items, or deleting items. The menu items are conditionally
 * rendered based on the type of the selected file or folder. It also includes dialogs for entering information and
 * confirming actions.
 *
 * The component uses `FileTreeItemContextMenuTextfieldDialog` for dialogs requiring text input and `FileTreeItemContextMenuConfirmationDialog`
 * for actions requiring confirmation. The menu and dialogs are controlled via state hooks and props.
 *
 * @component
 *
 * @param {FileTreeItemContextMenuProps} props - The props for the component.
 * @param {FileTreeViewItemProps} props.item - The file or folder item for which the context menu is displayed.
 * @param {{ top: number; left: number }} props.anchorPosition - The position of the menu relative to the anchor.
 * @param {boolean} props.open - A boolean indicating whether the context menu is open or not.
 * @param {Function} props.onClose - The function to be called when the context menu is closed.
 *
 * @example
 * // Example usage of the FileTreeItemContextMenu component
 * <FileTreeItemContextMenu
 *   item={selectedItem}
 *   anchorPosition={{ top: 100, left: 200 }}
 *   open={isMenuOpen}
 *   onClose={handleCloseMenu}
 * />
 *
 * @returns {JSX.Element} The context menu component with various menu items and dialogs.
 */
export const FileTreeItemContextMenu: React.FC<FileTreeItemContextMenuProps> = ({
  item,
  anchorPosition,
  open,
  onClose,
}) => {
  const { file, fileStateUpdate, filesHistoryStateUpdate } = useWorkspaceContext();
  const { unsaved } = useStatusContext();
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [fileImportDialogOpen, setFileImportDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const menuItems = [];

  const [confirmAction, setConfirmAction] = useState<'rename' | 'export' | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleRenameClick = () => {
    if (item.id === file.id && unsaved) {
      setConfirmAction('rename');
      setIsConfirmDialogOpen(true);
    } else {
      handleActionContextMenu('rename');
    }
  };

  const handleExportClick = () => {
    if (item.id === file.id && unsaved) {
      setConfirmAction('export');
      setIsConfirmDialogOpen(true);
    } else {
      handleActionContextMenu('export');
    }
  };

  const handleRenameConfirm = () => {
    handleActionContextMenu('rename');
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleExportConfirm = () => {
    handleActionContextMenu('export');
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleConfirmDialogCancel = () => {
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  if (item.fileType === undefined || item.fileType === FileTypes.FOLDER) {
    menuItems.push(
      <MenuItem key='newFile' onClick={() => handleActionContextMenu('newFile')}>
        New file...
      </MenuItem>,
      <MenuItem key='newFolder' onClick={() => handleActionContextMenu('newFolder')}>
        New folder...
      </MenuItem>,
      <Divider key='divider-new' />,
      <MenuItem key='import' onClick={() => handleActionContextMenu('import')}>
        Import...
      </MenuItem>
    );
  } else {
    menuItems.push(
      <MenuItem key='export' onClick={handleExportClick}>
        Export...
      </MenuItem>,
      <Divider key='divider-export' />
    );
  }

  if (item.fileType === FileTypes.FOLDER) {
    menuItems.push(<Divider key='divider-import' />);
  }

  if (item.fileType !== undefined) {
    menuItems.push(
      <MenuItem key='rename' onClick={handleRenameClick}>
        Rename...
      </MenuItem>,
      <MenuItem key='delete' onClick={() => handleActionContextMenu('delete')}>
        Delete
      </MenuItem>
    );
  }

  const handleActionContextMenu = (action: string) => {
    onClose();
    switch (action) {
      case 'newFile':
        setNewFileDialogOpen(true);
        break;
      case 'newFolder':
        setNewFolderDialogOpen(true);
        break;
      case 'import':
        setFileImportDialogOpen(true);
        break;
      case 'export':
        handleExport();
        break;
      case 'rename':
        setRenameDialogOpen(true);
        break;
      case 'delete':
        setDeleteDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleNewFileSave = async (label: string) => {
    setNewFileDialogOpen(false);
    const data = { label, type: FileTypes.FILE };
    await axios.put(`${Endpoints.WORKSPACE_CREATE}/${item.id}`, data);
  };

  const handleNewFolderSave = async (label: string) => {
    setNewFolderDialogOpen(false);
    const data = { label, type: FileTypes.FOLDER };
    await axios.put(`${Endpoints.WORKSPACE_CREATE}/${item.id}`, data);
  };

  const handleRenameSave = async (label: string) => {
    setRenameDialogOpen(false);
    const data = { label, type: item.fileType === FileTypes.FOLDER ? FileTypes.FOLDER : FileTypes.FILE };
    const response = await axios.put(`${Endpoints.WORKSPACE_RENAME}/${item.id}`, data);
    filesHistoryStateUpdate(undefined, { id: item.id, label: item.label, type: item.fileType });
    if (file.id === item.id)
      fileStateUpdate(
        { id: response.data.newId, label: response.data.newLabel, type: response.data.newType || FileTypes.FILE },
        undefined,
        undefined
      );
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    const data = { type: item.fileType === FileTypes.FOLDER ? FileTypes.FOLDER : FileTypes.FILE };
    await axios.put(`${Endpoints.WORKSPACE_DELETE}/${item.id}`, data);
    filesHistoryStateUpdate(undefined, { id: item.id, label: item.label, type: item.fileType || FileTypes.FILE });
  };

  const handleExport = useCallback(async () => {
    try {
      const response = await axios.get(`${Endpoints.WORKSPACE_EXPORT}/${item.id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const fileName = item.id.match(/[^/\\]+$/)?.[0] || item.id; // Extracts only the file name, otherwise uses the full path

      const link = Object.assign(document.createElement('a'), {
        href: url,
        download: fileName,
      });

      link.click();
      window.URL.revokeObjectURL(url);

      socket.emit(Events.WORKSPACE_EXPORT_FEEDBACK_EVENT, {
        uuid: getUUID(),
        sid: getSID(),
        status: 'success',
        filePath: item.id,
      });
    } catch (error) {
      socket.emit(Events.WORKSPACE_EXPORT_FEEDBACK_EVENT, {
        uuid: getUUID(),
        sid: getSID(),
        status: 'failure',
        filePath: item.id,
      });
      console.error('Error exporting file:', error);
    }
  }, [item]);

  return (
    <>
      <Menu
        anchorReference='anchorPosition'
        anchorPosition={anchorPosition}
        open={open}
        onClose={onClose}
        sx={{ '& .MuiPaper-root': { width: '10%', minWidth: '10rem' } }}
      >
        {menuItems}
      </Menu>
      <FileTreeItemContextMenuFileImportDialog
        open={Boolean(fileImportDialogOpen)}
        onClose={() => setFileImportDialogOpen(false)}
        item={item}
      />
      <FileTreeItemContextMenuTextfieldDialog
        open={Boolean(newFileDialogOpen)}
        action={FileTreeItemContextMenuActions.NEW_FILE}
        title='New File'
        label='Name'
        item={item}
        onClose={() => setNewFileDialogOpen(false)}
        onSave={handleNewFileSave}
      />
      <FileTreeItemContextMenuTextfieldDialog
        open={Boolean(newFolderDialogOpen)}
        action={FileTreeItemContextMenuActions.NEW_FOLDER}
        title='New Folder'
        label='Name'
        item={item}
        onClose={() => setNewFolderDialogOpen(false)}
        onSave={handleNewFolderSave}
      />
      <FileTreeItemContextMenuTextfieldDialog
        open={Boolean(renameDialogOpen)}
        action={FileTreeItemContextMenuActions.RENAME}
        title='Rename'
        label='New name'
        item={item}
        onClose={() => setRenameDialogOpen(false)}
        onSave={handleRenameSave}
      />
      <FileTreeItemContextMenuConfirmationDialog
        open={Boolean(deleteDialogOpen)}
        action={FileTreeItemContextMenuActions.DELETE}
        content={{ text: 'Are you sure you want to delete ', boldText: item.label }}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      <EditorConfirmLeave
        isOpen={isConfirmDialogOpen}
        onClose={handleConfirmDialogCancel}
        onConfirm={confirmAction === 'rename' ? handleRenameConfirm : handleExportConfirm}
      />
    </>
  );
};
