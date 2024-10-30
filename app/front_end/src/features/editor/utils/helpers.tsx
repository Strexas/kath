import { FileModel, FileTreeViewItemProps, FileTypes } from '@/features/editor/types';
import { Article as ArticleIcon, FolderRounded, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import { TreeViewBaseItem } from '@mui/x-tree-view';

export const isExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

export const getIconFromFileType = (fileType: FileTypes) => {
  switch (fileType) {
    case FileTypes.CSV:
      return ArticleIcon;
    case FileTypes.TXT:
      return ArticleIcon;
    case FileTypes.FOLDER:
      return FolderRounded;
    default:
      return InsertDriveFileIcon;
  }
};

export const doesFileExist = (fileTreeView: TreeViewBaseItem<FileTreeViewItemProps>[], path: string): boolean => {
  for (const item of fileTreeView) {
    const itemIdLowerCase = item.id.toLowerCase();
    const pathLowerCase = path.toLowerCase();

    if (itemIdLowerCase === pathLowerCase) {
      return true;
    }

    if (pathLowerCase.startsWith(itemIdLowerCase) && item.children) {
      if (doesFileExist(item.children, path)) {
        return true;
      }
    }
  }
  return false;
};

export const findUniqueFileName = (fileTreeView: TreeViewBaseItem<FileTreeViewItemProps>[], path: string): string => {
  const dotIndex = path.lastIndexOf('.');
  const filePath = path.substring(0, dotIndex);
  const fileExtension = path.substring(dotIndex + 1);

  let newFilePath = filePath;
  let newFullPath = `${newFilePath}.${fileExtension}`;

  let i = 1;

  while (doesFileExist(fileTreeView, newFullPath)) {
    newFilePath = `${filePath}(${i})`;
    newFullPath = `${newFilePath}.${fileExtension}`;
    i++;
  }

  const lastSlashIndex = newFullPath.lastIndexOf('/');
  const newFileName = newFullPath.substring(lastSlashIndex + 1);

  return newFileName;
};

export const getFileExtension = (filename: string): string => {
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex !== -1 ? filename.substring(dotIndex + 1).toLowerCase() : '';
};

export const getWorkspaceArray = (fileTreeView: TreeViewBaseItem<FileTreeViewItemProps>[], parent?: TreeViewBaseItem<FileTreeViewItemProps>): FileModel[] => {
  const workspaceArray: FileModel[] = [];
  fileTreeView.sort((a, b) => {
    if (a.fileType === FileTypes.FOLDER || b.fileType === FileTypes.FOLDER) {
      if (a.fileType === b.fileType) {
        return a.id.localeCompare(b.id);
      }

      return a.fileType === FileTypes.FOLDER ? 1 : -1;
    }

    return a.id.localeCompare(b.id);
  });

  for (const item of fileTreeView) {
    workspaceArray.push({ id: item.id, label: item.label, type: item.fileType, parent: parent ? { id: parent.id, label: parent.label, type: parent.fileType } : undefined });
    if (item.children && item.children.length !== 0) {
      workspaceArray.push(...getWorkspaceArray(item.children, item));
    }
  }

  return workspaceArray;
};

export const generateTimestamp = () => {
  const now = new Date();
  return (
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0') +
    '_' +
    String(now.getHours()).padStart(2, '0') +
    '-' +
    String(now.getMinutes()).padStart(2, '0') +
    '-' +
    String(now.getSeconds()).padStart(2, '0')
  );
};
