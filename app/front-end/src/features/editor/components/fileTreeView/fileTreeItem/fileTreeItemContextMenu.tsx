import {
  FileTreeItemContextMenuConfirmationDialog,
  FileTreeItemContextMenuTextfieldDialog,
} from '@/features/editor/components/fileTreeView/fileTreeItem';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileTreeViewItemProps } from '@/features/editor/types';
import { axios } from '@/lib';
import { Endpoints, FileTypes } from '@/types';
import { Divider, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

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
  const Workspace = useWorkspaceContext();
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const menuItems = [];

  if (item.fileType === undefined) {
    menuItems.push(
      <MenuItem key='newFile' onClick={() => handleActionContextMenu('newFile')}>
        New file...
      </MenuItem>,
      <MenuItem key='newFolder' onClick={() => handleActionContextMenu('newFolder')}>
        New folder...
      </MenuItem>,
      <Divider key='divider-new' />,
      <MenuItem key='import' onClick={() => handleActionContextMenu('import')} disabled>
        Import...
      </MenuItem>
    );
  } else {
    if (item.fileType === FileTypes.FOLDER || item.fileType === undefined) {
      menuItems.push(
        <MenuItem key='newFile' onClick={() => handleActionContextMenu('newFile')}>
          New file...
        </MenuItem>,
        <MenuItem key='newFolder' onClick={() => handleActionContextMenu('newFolder')}>
          New folder...
        </MenuItem>,
        <Divider key='divider-new' />,
        <MenuItem key='import' onClick={() => handleActionContextMenu('import')} disabled>
          Import...
        </MenuItem>,
        <Divider key='divider-import' />
      );
    } else {
      menuItems.push(
        <MenuItem key='export' onClick={() => handleActionContextMenu('export')} disabled>
          Export...
        </MenuItem>,
        <Divider key='divider-export' />
      );
    }

    menuItems.push(
      <MenuItem key='rename' onClick={() => handleActionContextMenu('rename')}>
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
        // TODO: Implement file import
        console.log('import');
        break;
      case 'export':
        // TODO: Implement file export
        console.log('export');
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
    Workspace.remove(item.id);
    if (Workspace.fileId === item.id)
      Workspace.update(response.data.newId, response.data.newLabel, response.data.newType || FileTypes.FILE);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    const data = { type: item.fileType === FileTypes.FOLDER ? FileTypes.FOLDER : FileTypes.FILE };
    await axios.put(`${Endpoints.WORKSPACE_DELETE}/${item.id}`, data);
    Workspace.remove(item.id);
  };

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
      <FileTreeItemContextMenuTextfieldDialog
        open={Boolean(newFileDialogOpen)}
        title='New File'
        label='Name'
        onClose={() => setNewFileDialogOpen(false)}
        onSave={handleNewFileSave}
      />
      <FileTreeItemContextMenuTextfieldDialog
        open={Boolean(newFolderDialogOpen)}
        title='New Folder'
        label='Name'
        onClose={() => setNewFolderDialogOpen(false)}
        onSave={handleNewFolderSave}
      />
      <FileTreeItemContextMenuTextfieldDialog
        open={Boolean(renameDialogOpen)}
        title='Rename'
        label='New name'
        item={item}
        onClose={() => setRenameDialogOpen(false)}
        onSave={handleRenameSave}
      />
      <FileTreeItemContextMenuConfirmationDialog
        open={Boolean(deleteDialogOpen)}
        action='Delete'
        content={{ text: 'Are you sure you want to delete ', boldText: item.label }}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};