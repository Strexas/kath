import { FileTreeItemContextMenuStyledDialog } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { useStatusContext } from '@/hooks';
import { Close as CloseIcon } from '@mui/icons-material';
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
import { useCallback } from 'react';

interface EditorConfirmLeaveDialogProps {
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const EditorConfirmLeave: React.FC<EditorConfirmLeaveDialogProps> = ({ onConfirm, isOpen, onClose }) => {
  const { unsavedStateUpdate } = useStatusContext();
  const Theme = useTheme();

  const handleConfirm = useCallback(() => {
    unsavedStateUpdate(false);
    onConfirm();
    onClose();
  }, [onConfirm, onClose, unsavedStateUpdate]);

  return (
    <FileTreeItemContextMenuStyledDialog open={isOpen} onClose={onClose}>
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <Grid item xs={8}>
          <DialogTitle sx={{ color: Theme.palette.primary.main, pl: '1.5rem', pt: '1.5rem', fontWeight: '700' }}>
            Unsaved changes
          </DialogTitle>
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                color: Theme.palette.primary.main,
                mt: '0.5rem',
                mr: '1.5rem',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <DialogContent sx={{ py: 0 }}>
        <Typography sx={{ color: Theme.palette.text.primary, fontSize: '1rem', mb: '1rem' }}>
          You have unsaved changes. If you continue, your <b>changes will be lost</b>. <br />
          Do you wish to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.secondary }}>Cancel</Typography>
        </Button>
        <Button
          onClick={handleConfirm}
          variant='outlined'
          sx={{
            borderColor: Theme.palette.primary.main,
            ':hover': { borderColor: Theme.palette.primary.main, bgcolor: Theme.palette.secondary.main },
            '& .MuiTouchRipple-root': {
              color: Theme.palette.primary.main,
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </FileTreeItemContextMenuStyledDialog>
  );
};
