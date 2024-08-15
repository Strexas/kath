import { FileTreeViewItemProps } from '@/features/editor/types';
import { FileTypes } from '@/types/enums';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

export const FileTreeViewMockData: TreeViewBaseItem<FileTreeViewItemProps>[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      {
        id: '1.1',
        label: 'Genetics',
        children: [
          { id: '1.1.1', label: 'Analysis Data 2022.csv', fileType: FileTypes.CSV },
          { id: '1.1.2', label: 'Analysis Data 2023.csv', fileType: FileTypes.CSV },
          { id: '1.1.3', label: 'Analysis Data 2024.csv', fileType: FileTypes.CSV },
          {
            id: '1.1.4',
            label: 'Notes.txt',
            fileType: FileTypes.TXT,
          },
          { id: '1.1.5', label: 'Research Info.doc', fileType: FileTypes.DOC },
        ],
      },
      { id: '1.2', label: 'Other data', fileType: FileTypes.FOLDER },
    ],
  },
  {
    id: '2',
    label: 'Surveys',
    fileType: FileTypes.FOLDER,
    children: [{ id: '2.1', label: 'Survey Results 2024.csv', fileType: FileTypes.CSV }],
  },
];
