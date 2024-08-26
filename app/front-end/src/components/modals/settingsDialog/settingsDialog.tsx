import ColorModeSetting from '@/components/modals/settingsDialog/settingsFields/colorModeSetting';
import LanguageSetting from '@/components/modals/settingsDialog/settingsFields/languageSetting';
import TimeZoneSetting from '@/components/modals/settingsDialog/settingsFields/timeZoneSetting';
import { SettingSpacer } from '@/components/modals/settingsDialog/settingSpacer';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';

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
    backgroundColor: theme.palette.background.default,
  },
}));

interface SettingsDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function SettingsDialog({ open, handleClose }: SettingsDialogProps) {
  const Theme = useTheme();

  return (
    <BootstrapDialog onClose={handleClose} open={open}>
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <Grid item xs={8}>
          <DialogTitle sx={{ color: Theme.palette.primary.main, pl: '1.5rem', pt: '1.5rem', fontWeight: '700' }}>
            Settings
          </DialogTitle>
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <IconButton
              aria-label='close'
              onClick={handleClose}
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
      <DialogContent dividers>
        <ColorModeSetting />
        <SettingSpacer />
        <LanguageSetting />
        <SettingSpacer />
        <TimeZoneSetting />
      </DialogContent>
    </BootstrapDialog>
  );
}
