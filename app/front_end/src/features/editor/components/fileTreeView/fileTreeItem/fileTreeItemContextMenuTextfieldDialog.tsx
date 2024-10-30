import { FileTreeItemContextMenuStyledDialog } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileTreeItemContextMenuActions, FileTreeViewItemProps, FileTypes } from '@/features/editor/types';
import { doesFileExist } from '@/features/editor/utils';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

export interface FileTreeItemContextMenuTextfieldDialogProps {
  open: boolean;
  action: FileTreeItemContextMenuActions;
  title: string;
  label: string;
  item: FileTreeViewItemProps;
  onClose: () => void;
  onSave: (label: string) => void;
}

/**
 * `FileTreeItemContextMenuTextfieldDialog` is a dialog component that allows users to input or edit the label of a file tree item.
 *
 * @description This component provides a modal dialog for editing or creating a file or folder label within a file tree view.
 * It supports different actions, such as renaming an existing file or folder, or creating a new file or folder. The dialog includes
 * input validation to ensure the new label is valid, such as not being empty, not exceeding 50 characters, and not containing
 * forbidden characters. For file creation, it allows selecting a file extension.
 *
 * @component
 *
 * @param {FileTreeItemContextMenuTextfieldDialogProps} props - The props for the component.
 * @param {boolean} props.open - A boolean that determines whether the dialog is visible or hidden.
 * @param {FileTreeItemContextMenuActions} props.action - The action to be performed, such as renaming or creating a new file.
 * @param {string} props.title - The title displayed at the top of the dialog.
 * @param {string} props.label - The label for the input field.
 * @param {FileTreeViewItemProps} props.item - The file tree item object being edited, containing information such as the current label and file type.
 * @param {() => void} props.onClose - Callback function to be called when the dialog is closed.
 * @param {(label: string) => void} props.onSave - Callback function to be called when the user saves the new label.
 *
 * @example
 * // Example usage of the FileTreeItemContextMenuTextfieldDialog component
 * <FileTreeItemContextMenuTextfieldDialog
 *   open={dialogOpen}
 *   action={FileTreeItemContextMenuActions.RENAME}
 *   title="Edit Label"
 *   label="Label"
 *   item={fileTreeItem}
 *   onClose={() => setDialogOpen(false)}
 *   onSave={(newLabel) => console.log('New label:', newLabel)}
 * />
 *
 * @returns {JSX.Element} The dialog component with a title, text field, and action buttons for saving or closing.
 */
export const FileTreeItemContextMenuTextfieldDialog: React.FC<FileTreeItemContextMenuTextfieldDialogProps> = ({
  open,
  action,
  title,
  label,
  item,
  onClose,
  onSave,
}) => {
  const Theme = useTheme();
  const { fileTree } = useWorkspaceContext();

  const [value, setValue] = useState(() => {
    switch (action) {
      case FileTreeItemContextMenuActions.RENAME:
        if (item.fileType !== FileTypes.FOLDER) return item.label.match(/^(.*)(?=\.[^.]+$)/)?.[0] || '';
        return item.label;
      default:
        return '';
    }
  });

  const [fileExtension, setFileExtension] = useState(() => {
    switch (action) {
      case FileTreeItemContextMenuActions.NEW_FILE:
        return FileTypes.CSV;
      case FileTreeItemContextMenuActions.NEW_FOLDER:
        return '';
      case FileTreeItemContextMenuActions.RENAME:
        if (item.fileType !== FileTypes.FOLDER) return item.label.match(/[^.]+$/)?.[0] || FileTypes.CSV;
        return '';
      default:
        return '';
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(() => {
        switch (action) {
          case FileTreeItemContextMenuActions.RENAME:
            if (item.fileType !== FileTypes.FOLDER) return item.label.match(/^(.*)(?=\.[^.]+$)/)?.[0] || '';
            return item.label;
          default:
            return '';
        }
      });
      setFileExtension(() => {
        switch (action) {
          case FileTreeItemContextMenuActions.NEW_FILE:
            return FileTypes.CSV;
          case FileTreeItemContextMenuActions.NEW_FOLDER:
            return '';
          case FileTreeItemContextMenuActions.RENAME:
            if (item.fileType !== FileTypes.FOLDER) return item.label.match(/[^.]+$/)?.[0] || FileTypes.CSV;
            return '';
          default:
            return '';
        }
      });
      setError(null);
    }
  }, [open, item, action]);

  const validateInput = (input: string, fileExtension: string) => {
    const parentPath = item.id.match(/^(.*)(?=\/[^/]*$)/)?.[0] || '';
    const path = () => {
      if (action === FileTreeItemContextMenuActions.RENAME) {
        if (parentPath === '') return input;
        return parentPath + '/' + input;
      } else {
        if (item.id === '') return input;
        return item.id + '/' + input;
      }
    };

    // Check if file already exists
    switch (action) {
      case FileTreeItemContextMenuActions.NEW_FILE:
        if (doesFileExist(fileTree, path() + '.' + fileExtension)) return 'This name already exists';
        break;
      case FileTreeItemContextMenuActions.NEW_FOLDER:
        if (doesFileExist(fileTree, path())) return 'This name already exists';
        break;
      case FileTreeItemContextMenuActions.RENAME:
        if (fileExtension === '') {
          if (doesFileExist(fileTree, path())) return 'This name already exists';
        } else {
          if (doesFileExist(fileTree, path() + '.' + fileExtension)) return 'This name already exists';
        }
        break;
      default:
        break;
    }

    // Check if the input is empty
    if (!input) {
      return 'Input cannot be empty';
    }

    // Check if the input exceeds the length limit
    if (input.length > 50) {
      return 'Input must be less than 50 characters';
    }

    // Check for forbidden characters
    if (input.includes('\0')) {
      return 'Input contains a forbidden null character';
    }

    if (input.includes('/')) {
      return 'Input cannot contain a forward slash (/)';
    }

    if (/[*?[\]]/.test(input)) {
      return 'Input contains forbidden characters (*, ?, [, ])';
    }

    // Check for special filename cases ('.' and '..')
    if (input === '.' || input === '..') {
      return 'Input cannot be "." or ".."';
    }

    // Check for leading or trailing dots
    if (input.startsWith('.') || input.endsWith('.')) {
      return 'Input cannot start or end with a dot';
    }

    return null; // No error
  };

  const handleSave = () => {
    const trimmedValue = value.trim();
    const validationError = validateInput(trimmedValue, fileExtension);
    if (validationError) {
      setError(validationError);
    } else {
      switch (action) {
        case FileTreeItemContextMenuActions.NEW_FILE:
          onSave(trimmedValue + '.' + fileExtension);
          break;
        case FileTreeItemContextMenuActions.NEW_FOLDER:
          onSave(trimmedValue);
          break;
        case FileTreeItemContextMenuActions.RENAME:
          if (fileExtension !== '') onSave(trimmedValue + '.' + fileExtension);
          else onSave(trimmedValue);
          break;
        default:
          break;
      }
    }
  };

  const handleFileExtension = (event: SelectChangeEvent) => {
    setFileExtension(event.target.value as FileTypes);
  };

  return (
    <FileTreeItemContextMenuStyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={9}>
            <Typography sx={{ color: Theme.palette.primary.main, fontWeight: '700', fontSize: '1.2rem' }}>
              {title}
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
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <TextField
            fullWidth
            variant='standard'
            label={label}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
            error={Boolean(error)}
            sx={{
              ':hover': { borderColor: Theme.palette.primary.main },
              justifyItems: 'center',
            }}
          />
          {(action === FileTreeItemContextMenuActions.NEW_FILE ||
            (action === FileTreeItemContextMenuActions.RENAME && item.fileType !== FileTypes.FOLDER)) && (
            <>
              <FormControl fullWidth sx={{ width: '20%', minWidth: '5rem' }}>
                <Select
                  id='file-extension'
                  variant='standard'
                  value={fileExtension}
                  onChange={(event) => {
                    handleFileExtension(event);
                    setError(null);
                  }}
                  error={Boolean(error)}
                  sx={{ height: '100%', alignItems: 'end' }}
                >
                  <MenuItem value={FileTypes.CSV}>.{FileTypes.CSV}</MenuItem>
                  <MenuItem value={FileTypes.TXT}>.{FileTypes.TXT}</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Box>
        {error && <Typography sx={{ fontSize: '0.75rem', color: Theme.palette.error.main }}>{error}</Typography>}
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
