import { FileTreeItemContextMenuStyledDialog } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { FileTreeViewItemProps } from '@/features/editor/types';
import { FileTypes } from '@/types';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

export interface FileTreeItemContextMenuTextfieldDialogProps {
  open: boolean;
  title: string;
  label: string;
  item?: FileTreeViewItemProps;
  onClose: () => void;
  onSave: (label: string) => void;
}

/**
 * `FileTreeItemContextMenuTextfieldDialog` component provides a dialog for editing the label of a file tree item.
 *
 * @description This component displays a modal dialog for users to input or edit a label for a file or folder in the file tree.
 * It includes validation to ensure the input is not empty and does not exceed 50 characters. The dialog features a title
 * and a text field for input, with a save and cancel button. The dialog is styled with the application's theme for a consistent
 * look and feel.
 *
 * @component
 *
 * @param {FileTreeItemContextMenuTextfieldDialogProps} props - The props for the component.
 * @param {boolean} props.open - A boolean indicating whether the dialog is open or closed.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.label - The label for the text field.
 * @param {FileTreeViewItemProps} [props.item] - Optional file tree item object that includes the current label and file type.
 * @param {() => void} props.onClose - Callback function to be called when the dialog is closed.
 * @param {(label: string) => void} props.onSave - Callback function to be called when the user saves the input.
 *
 * @example
 * // Example usage of the FileTreeItemContextMenuTextfieldDialog component
 * <FileTreeItemContextMenuTextfieldDialog
 *   open={dialogOpen}
 *   title="Edit Label"
 *   label="New Label"
 *   item={fileTreeItem}
 *   onClose={() => setDialogOpen(false)}
 *   onSave={(newLabel) => console.log('New label:', newLabel)}
 * />
 *
 * @returns {JSX.Element} The dialog component with a title, text field, and action buttons for saving or closing.
 */
export const FileTreeItemContextMenuTextfieldDialog: React.FC<FileTreeItemContextMenuTextfieldDialogProps> = ({
  open,
  title,
  label,
  item,
  onClose,
  onSave,
}) => {
  const Theme = useTheme();
  const [value, setValue] = useState(item?.label || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(item?.label || '');
      setError(null);
    }
  }, [open, item?.label]);

  const validateInput = (input: string) => {
    if (!input.trim()) {
      return 'Input cannot be empty';
    }

    if (input.length > 50) {
      return 'Input must be less than 50 characters';
    }

    return null; // No error
  };

  const handleSave = () => {
    const validationError = validateInput(value);
    if (validationError) {
      setError(validationError);
    } else {
      onSave(value);
    }
  };

  return (
    <FileTreeItemContextMenuStyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={9}>
            <Typography sx={{ color: Theme.palette.primary.main, fontWeight: '700' }}>
              {title} {item ? (item.fileType === FileTypes.FOLDER ? 'Folder' : 'File') : ''}
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
        <TextField
          fullWidth
          variant='standard'
          label={label}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{
            ':hover': { borderColor: Theme.palette.primary.main },
            backgroundColor: Theme.palette.background.paper,
            justifyItems: 'center',
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.secondary }}>Cancel</Typography>
        </Button>
        <Button
          onClick={handleSave}
          variant='outlined'
          sx={{
            borderColor: Theme.palette.primary.main,
            ':hover': { borderColor: Theme.palette.primary.dark, bgcolor: Theme.palette.secondary.main },
            '& .MuiTouchRipple-root': {
              color: Theme.palette.primary.main,
            },
          }}
        >
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.primary }}>Save</Typography>
        </Button>
      </DialogActions>
    </FileTreeItemContextMenuStyledDialog>
  );
};
