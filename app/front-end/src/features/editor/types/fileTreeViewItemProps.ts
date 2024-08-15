import { FileTypes } from '@/types/enums';

export type FileTreeViewItemProps = {
  fileType?: FileTypes;
  id: string;
  label: string;
};
