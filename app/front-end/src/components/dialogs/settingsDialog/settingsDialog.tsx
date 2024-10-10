import { SettingSpacer } from '@/components/dialogs/settingsDialog';
import { ColorModeSetting, LanguageSetting, TimeZoneSetting } from '@/components/dialogs/settingsDialog/settingsFields';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha, Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, styled, useTheme } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  backdropFilter: 'blur(5px)',
  '& .MuiDialogContent-root': {
    padding: '1.5rem',
  },
  '& .MuiDialogActions-root': {
    padding: '1.5rem',
  },
  '& .MuiDialog-paper': {
    borderRadius: '1.5rem',
    minWidth: '25%',
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'none',
  },
}));

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const Theme = useTheme();

  return (
    <BootstrapDialog onClose={onClose} open={open}>
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <Grid item xs={8}>
          <DialogTitle
            sx={{
              color: Theme.palette.primary.main,
              pl: '1.5rem',
              pt: '1.5rem',
              fontWeight: '700',
              fontSize: '1.2rem',
            }}
          >
            Settings
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
      <DialogContent sx={{ borderTop: `1px solid ${alpha(Theme.palette.text.secondary, 0.3)}` }}>
        <ColorModeSetting />
        <SettingSpacer />
        <LanguageSetting />
        <SettingSpacer />
        <TimeZoneSetting />
      </DialogContent>
    </BootstrapDialog>
  );
};
