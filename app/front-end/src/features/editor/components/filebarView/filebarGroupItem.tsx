import { EditorConfirmLeave } from '@/features/editor/components/editorView';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileModel } from '@/features/editor/types';
import { useStatusContext } from '@/hooks';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha, Box, IconButton, Typography, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';

/**
 * `FilebarGroupItem` is a functional component that represents an individual item in the file bar group.
 *
 * @description This component displays the label of a file or folder within the file bar, allowing the user to select it and switch
 * to its corresponding workspace. It also includes a close button to remove the item from the workspace.
 *
 * @component
 *
 * @example
 * // Example usage of the FilebarGroupItem component
 * <FilebarGroupItem fileId="1" fileLabel="Document.txt" fileType={FileTypes.TXT} />
 *
 * @param {FilebarGroupItemProps} props - The props object for the FilebarGroupItem component.
 * @param {string} props.fileId - The unique identifier of the file or folder.
 * @param {string} props.fileLabel - The label (name) of the file or folder to be displayed.
 * @param {FileTypes} props.fileType - The type of the file (e.g., txt, csv, folder).
 *
 * @returns {JSX.Element} A `Box` component representing an item in the file bar with a clickable label and a close button.
 */
export const FilebarGroupItem: React.FC<FileModel> = (file) => {
  const Theme = useTheme();
  const Workspace = useWorkspaceContext();
  const { blocked, unsaved } = useStatusContext();

  const { id, label } = file;

  const [confirmAction, setConfirmAction] = useState<'tab' | 'close' | null>(null);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleTabConfirm = useCallback(() => {
    Workspace.fileStateUpdate(file);
    Workspace.filesHistoryStateUpdate(file);
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  }, [file, Workspace]);

  const handleCloseConfirm = useCallback(() => {
    Workspace.filesHistoryStateUpdate(undefined, file);
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  }, [file, Workspace]);

  const handleTabClick = useCallback(() => {
    if (!blocked) {
      if (unsaved && Workspace.file.id !== id) {
        setConfirmAction('tab');
        setIsConfirmDialogOpen(true);
      } else {
        Workspace.fileStateUpdate(file);
        Workspace.filesHistoryStateUpdate(file);
      }
    }
  }, [blocked, unsaved, file, Workspace]);

  const handleCloseIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!blocked) {
      if (unsaved && Workspace.file.id === id) {
        setConfirmAction('close');
        setIsConfirmDialogOpen(true);
      } else {
        Workspace.filesHistoryStateUpdate(undefined, file);
      }
    }
  };

  const handleConfirmDialogCancel = () => {
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  return (
    <>
      <Box
        id={id}
        sx={{
          height: '100%',
          pl: '1rem',
          pr: '0.5rem',
          bgcolor: Workspace.file.id === id ? Theme.palette.background.default : Theme.palette.action.selected,
          borderRadius: '0rem',
          ':hover': {
            backgroundColor:
              Workspace.file.id === id
                ? Theme.palette.background.default
                : blocked
                  ? Theme.palette.action.selected
                  : alpha(Theme.palette.background.default, 0.5),
          },
          cursor: blocked ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        onClick={handleTabClick}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'none',
            maxWidth: '10rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Typography>
        <IconButton
          size='small'
          disabled={blocked}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={handleCloseIconClick}
        >
          <CloseIcon sx={{ fontSize: 12, color: Theme.palette.text.primary }} />
        </IconButton>
      </Box>
      <EditorConfirmLeave
        isOpen={isConfirmDialogOpen}
        onClose={handleConfirmDialogCancel}
        onConfirm={confirmAction === 'tab' ? handleTabConfirm : handleCloseConfirm}
      />
    </>
  );
};
