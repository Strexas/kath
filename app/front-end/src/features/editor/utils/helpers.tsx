import { Article as ArticleIcon, FolderRounded, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import { TreeViewBaseItem } from '@mui/x-tree-view';
import { FileTreeViewItemProps, FileTypes } from '../types';

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
