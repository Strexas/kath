import { ShortcutsDivider } from '@/components/modals/shortcutsDialog/shortcutsDivider';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Switch, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import ShortcutsLine from './shortcutsLine';

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
    minWidth: '30%',
    backgroundColor: theme.palette.background.default,
  },
}));

interface SettingsDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function SettingsDialog({ open, handleClose }: SettingsDialogProps) {
  const Theme = useTheme();

  const [isMac, setIsMac] = useState<boolean>(false);

  const handleMacSwitch = () => {
    setIsMac((prevIsMac) => !prevIsMac);
  };

  return (
    <BootstrapDialog onClose={handleClose} open={open}>
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <Grid item xs={8}>
          <DialogTitle sx={{ color: Theme.palette.primary.main, pl: '1.5rem', pt: '1.5rem', fontWeight: '700' }}>
            Shortcuts
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
        <Grid container display='flex' alignItems='center' pb='1rem' mt='-1rem'>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: '700', fontSize: '1rem' }}>
              {isMac ? 'MacOS' : 'Windows'} shortcuts
            </Typography>
          </Grid>
          <Grid item xs={6} display='flex' alignItems='center' justifyContent='flex-end'>
            <Typography fontSize='1rem'>MacOS</Typography>
            <Switch onChange={handleMacSwitch} />
          </Grid>
        </Grid>
        <ShortcutsLine
          windowsKeys={['CTRL', 'C']}
          macOSKeys={['COMMAND', 'C']}
          macOS={isMac}
          description='Undo last action'
        />
        <ShortcutsDivider />
        <ShortcutsLine
          windowsKeys={['CTRL', 'Y']}
          macOSKeys={['COMMAND', 'Y']}
          macOS={isMac}
          description='Redo last action'
        />
        <ShortcutsDivider />
        <ShortcutsLine
          windowsKeys={['CTRL', 'A']}
          macOSKeys={['COMMAND', 'A']}
          macOS={isMac}
          description='Select everything'
        />
        <ShortcutsDivider />
        <ShortcutsLine
          windowsKeys={['CTRL', 'SHIFT', 'ESC']}
          macOSKeys={['ALT', 'COMMAND', 'ESC']}
          macOS={isMac}
          description='Task manager'
        />
      </DialogContent>
    </BootstrapDialog>
  );
}
