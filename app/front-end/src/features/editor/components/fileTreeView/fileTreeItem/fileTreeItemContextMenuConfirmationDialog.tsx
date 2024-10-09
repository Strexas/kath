import { FileTreeItemContextMenuStyledDialog } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';

export interface FileTreeItemContextMenuConfirmationDialogProps {
  open: boolean;
  action: string;
  content: { text: string; boldText: string };
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * `FileTreeItemContextMenuConfirmationDialog` component provides a confirmation dialog for actions related to file tree items.
 *
 * @description This component displays a confirmation dialog with a customizable action, content, and styling. It is used
 * to confirm user actions such as deletion or renaming of file tree items. The dialog includes a title, content with bold text,
 * and buttons for confirming or canceling the action.
 *
 * The dialog is styled using `FileTreeItemContextMenuStyledDialog` to ensure consistent appearance within the application.
 *
 * @component
 *
 * @param {FileTreeItemContextMenuConfirmationDialogProps} props - The props for the component.
 * @param {boolean} props.open - A boolean indicating whether the dialog is open or not.
 * @param {string} props.action - The action to be confirmed (e.g., "Delete", "Rename").
 * @param {Object} props.content - The content to be displayed in the dialog.
 * @param {string} props.content.text - The main text content of the dialog.
 * @param {string} props.content.boldText - The text that should be displayed in bold.
 * @param {Function} props.onClose - The function to be called when the dialog is closed.
 * @param {Function} props.onConfirm - The function to be called when the action is confirmed.
 *
 * @example
 * // Example usage of the FileTreeItemContextMenuConfirmationDialog component
 * <FileTreeItemContextMenuConfirmationDialog
 *   open={isDialogOpen}
 *   action="Delete"
 *   content={{ text: 'Are you sure you want to delete ', boldText: 'this item' }}
 *   onClose={handleCloseDialog}
 *   onConfirm={handleConfirmAction}
 * />
 *
 * @returns {JSX.Element} The confirmation dialog component.
 */
export const FileTreeItemContextMenuConfirmationDialog: React.FC<FileTreeItemContextMenuConfirmationDialogProps> = ({
  open,
  action,
  content,
  onClose,
  onConfirm,
}) => {
  const Theme = useTheme();
  return (
    <FileTreeItemContextMenuStyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={9}>
            <Typography sx={{ color: Theme.palette.primary.main, fontWeight: '700', fontSize: '1.2rem' }}>
              Confirm {action}
            </Typography>
          </Grid>
          <Grid item xs={3} textAlign={'right'}>
            <IconButton
              onClick={onClose}
              sx={{
                color: Theme.palette.primary.main,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <Typography sx={{ fontSize: '1rem', wordWrap: 'break-word' }}>
          {content.text}
          <b>{content.boldText}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.secondary }}>Cancel</Typography>
        </Button>
        <Button
          onClick={onConfirm}
          variant='outlined'
          sx={{
            borderColor: Theme.palette.error.main,
            ':hover': { borderColor: Theme.palette.error.main, bgcolor: Theme.palette.error.main },
            '& .MuiTouchRipple-root': {
              color: Theme.palette.error.main,
            },
          }}
        >
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.primary }}>
            {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
          </Typography>
        </Button>
      </DialogActions>
    </FileTreeItemContextMenuStyledDialog>
  );
};
