import { FileTreeItemContextMenuStyledDialog } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { Close as CloseIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

export interface FileTreeItemContextMenuFileImportDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const FileTreeItemContextMenuFileImportDialog: React.FC<FileTreeItemContextMenuFileImportDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const Theme = useTheme();
  const [filename, setFilename] = useState('');

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setFilename(name);
  };

  return (
    <FileTreeItemContextMenuStyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={9}>
            <Typography sx={{ color: Theme.palette.primary.main, fontWeight: '700' }}>Import</Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button component='label' variant='outlined' startIcon={<UploadFileIcon />} sx={{ marginRight: '1rem' }}>
            Select a file...
            <input type='file' accept='.csv, .txt' hidden onChange={handleFileUpload} />
          </Button>
          <Typography sx={{ fontSize: '1rem' }}>
            {filename === '' ? (
              'No file selected'
            ) : (
              <>
                Selected file: <span style={{ fontWeight: 'bold' }}>{filename}</span>
              </>
            )}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.secondary }}>Cancel</Typography>
        </Button>
        <Button
          onClick={onConfirm}
          variant='outlined'
          sx={{
            borderColor: Theme.palette.primary.main,
            ':hover': { borderColor: Theme.palette.primary.main, bgcolor: Theme.palette.secondary.main },
            '& .MuiTouchRipple-root': {
              color: Theme.palette.primary.main,
            },
          }}
        >
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.primary.main }}>Import</Typography>
        </Button>
      </DialogActions>
    </FileTreeItemContextMenuStyledDialog>
  );
};
