import ArticleIcon from '@mui/icons-material/Article';
import FolderRounded from '@mui/icons-material/FolderRounded';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { unstable_useTreeItem2 as useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import * as React from 'react';

type FileType = 'txt' | 'csv' | 'doc' | 'folder';

type ExtendedTreeItemProps = {
  fileType?: FileType;
  id: string;
  label: string;
};

// TODO: Implement fetching file data from back-end
const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      {
        id: '1.1',
        label: 'Genetics',
        children: [
          { id: '1.1.1', label: 'Analysis Data 2022.csv', fileType: 'csv' },
          { id: '1.1.2', label: 'Analysis Data 2023.csv', fileType: 'csv' },
          { id: '1.1.3', label: 'Analysis Data 2024.csv', fileType: 'csv' },
          {
            id: '1.1.4',
            label: 'Notes.txt',
            fileType: 'txt',
          },
          { id: '1.1.5', label: 'Research Info.doc', fileType: 'doc' },
        ],
      },
      { id: '1.2', label: 'Other data', fileType: 'folder' },
    ],
  },
  {
    id: '2',
    label: 'Surveys',
    fileType: 'folder',
    children: [{ id: '2.1', label: 'Survey Results 2024.csv', fileType: 'csv' }],
  },
];

function DotIcon() {
  const Theme = useTheme();
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: Theme.palette.primary.main,
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}
declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400],
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
})) as unknown as typeof TreeItem2Root;

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  ['&.Mui-expanded ']: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
      color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
  },
  ['&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused']: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
  color: 'inherit',
  fontSize: '1rem',
  fontWeight: 500,
  maxWidth: '100%',
  wordWrap: 'break-word',
}) as unknown as typeof Typography;

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

function CustomLabel({ icon: Icon, expandable, children, ...other }: CustomLabelProps) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && <Box component={Icon} className='labelIcon' color='inherit' sx={{ mr: 1, fontSize: '1.2rem' }} />}

      <StyledTreeItemLabelText>{children}</StyledTreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItem2Label>
  );
}

const isExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileType = (fileType: FileType) => {
  switch (fileType) {
    case 'csv':
      return ArticleIcon;
    case 'txt':
      return ArticleIcon;
    case 'doc':
      return ArticleIcon;
    case 'folder':
      return FolderRounded;
    default:
      return InsertDriveFileIcon;
  }
};

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);
  let icon;
  if (expandable) {
    icon = FolderRounded;
  } else if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
  }

  const handleClick = (fileName: string, fileID: string) => {
    console.log(`Clicked on ${fileName} (${fileID})`);
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)} onClick={() => handleClick(item.label, item.id)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel {...getLabelProps({ icon, expandable: expandable && status.expanded })} />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

export const Hierarchy: React.FC = () => {
  return (
    <RichTreeView
      items={ITEMS}
      sx={{ height: 'fit-content', flexGrow: 1, overflowY: 'auto' }}
      slots={{ item: CustomTreeItem }}
    />
  );
};
