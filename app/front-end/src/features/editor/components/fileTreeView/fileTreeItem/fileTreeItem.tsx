import { EditorConfirmLeave } from '@/features/editor/components/editorView';
import { FileTreeItemContextMenu, FileTreeItemLabel } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileTypes } from '@/features/editor/types';
import { getIconFromFileType, isExpandable } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { FolderRounded as FolderRoundedIcon } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { alpha, styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { TreeItem2Icon, TreeItem2Provider } from '@mui/x-tree-view';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Checkbox, TreeItem2Content, TreeItem2IconContainer, TreeItem2Root } from '@mui/x-tree-view/TreeItem2';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { unstable_useTreeItem2 as useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import React, { useState } from 'react';

const StyledFileTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  //color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[400],
  color: theme.palette.text.secondary,
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
})) as unknown as typeof TreeItem2Root;

const StyledFileTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  ['&.Mui-expanded ']: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
      color: theme.palette.primary.main,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.secondary.main,
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
  ['&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused']: {
    backgroundColor:
      theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.7) : alpha(theme.palette.primary.main, 0.5),
    color: theme.palette.primary.contrastText,
  },
}));

const TransitionComponent = (props: TransitionProps) => {
  const AnimatedCollapse = animated(Collapse);
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
};

interface FileTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

/**
 * FileTreeItem component renders a custom tree item for use within a hierarchical file tree view.
 *
 * @description This component represents an individual item in a file tree, using Material-UI's `TreeItem2` components for
 * rendering and behavior. It integrates with the `useTreeItem2` hook for managing item state and interactions. The item can
 * display different icons based on whether it's expandable or represents a specific file type. It also includes support for
 * drag-and-drop functionality and a custom collapse transition.
 *
 * The item uses styled components for custom styling and provides visual feedback on selection, focus, and hover states.
 * The `FileTreeItem` component also handles click events to update the workspace context with the item's details.
 *
 * @component
 *
 * @example
 * // Example usage of the FileTreeItem component
 * return (
 *   <FileTreeItem
 *     id="item-1"
 *     itemId="item-1"
 *     label="Example Item"
 *     fileType={FileTypes.FILE}
 *   />
 * );
 *
 * @param {Object} props - The props for the FileTreeItem component.
 * @param {string} props.id - The unique identifier for the tree item.
 * @param {string} props.itemId - The item ID used for tree item management.
 * @param {string} props.label - The display label for the tree item.
 * @param {boolean} [props.disabled] - Optional flag to disable the item.
 * @param {React.ReactNode} [props.children] - Optional child elements to render inside the tree item.
 * @param {Object} [props.other] - Additional props to be passed to the root element.
 *
 * @returns {JSX.Element} The rendered tree item with custom styles, icons, and behavior.
 */
export const FileTreeItem = React.forwardRef(function CustomTreeItem(
  props: FileTreeItemProps,
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
    icon = FolderRoundedIcon;
  } else if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
  }

  const { fileStateUpdate, filesHistoryStateUpdate, file } = useWorkspaceContext();
  const { blocked } = useStatusContext();
  const [contextMenu, setContextMenu] = useState<(EventTarget & HTMLDivElement) | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const handleClick = (newId: string, newLabel: string, newType: FileTypes) => {
    if (newType === FileTypes.FOLDER) return;

    fileStateUpdate({ id: newId, label: newLabel, type: newType }, undefined, undefined);
    filesHistoryStateUpdate({ id: newId, label: newLabel, type: newType });
  };

  const handleOpenContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setContextMenu(event.currentTarget);
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setContextMenuPosition({ top: 0, left: 0 });
  };

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { unsaved } = useStatusContext();
  const handleConfirm = () => {
    handleClick(item.id, item.label, item.fileType);
    setIsConfirmDialogOpen(false);
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledFileTreeItemRoot {...getRootProps(other)}>
        <StyledFileTreeItemContent
          {...getContentProps({
            onClick: (event) => {
              if (!blocked) {
                if (getContentProps().onClick) getContentProps().onClick(event);
                if (unsaved) {
                  if (item.fileType !== FileTypes.FOLDER && item.id !== file.id) setIsConfirmDialogOpen(true);
                } else {
                  handleClick(item.id, item.label, item.fileType);
                }
              }
            },

            onContextMenu: (event) => {
              if (!blocked) handleOpenContextMenu(event);
            },
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
            status: status,
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <FileTreeItemLabel {...getLabelProps({ icon, expandable: expandable && status.expanded })} />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </StyledFileTreeItemContent>
        <FileTreeItemContextMenu
          item={item}
          anchorPosition={contextMenuPosition}
          open={Boolean(contextMenu)}
          onClose={handleCloseContextMenu}
        />
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
        <EditorConfirmLeave
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirm}
        />
      </StyledFileTreeItemRoot>
    </TreeItem2Provider>
  );
});
