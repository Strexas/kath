import { FileTypes } from '@/types/enums';
import { Article as ArticleIcon, FolderRounded, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';

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
    case FileTypes.DOC:
      return ArticleIcon;
    case FileTypes.FOLDER:
      return FolderRounded;
    default:
      return InsertDriveFileIcon;
  }
};
