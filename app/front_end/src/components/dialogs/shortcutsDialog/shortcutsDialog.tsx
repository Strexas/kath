import { Shortcuts, ShortcutsDivider, ShortcutsLine } from '@/components/dialogs/shortcutsDialog';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

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
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'none',
  },
}));

interface ShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ShortcutsDialog = ({ open, onClose }: ShortcutsDialogProps) => {
  const Theme = useTheme();

  const [isMac, setIsMac] = useState<boolean>(false);

  const handleMacSwitch = () => {
    setIsMac((prevIsMac) => !prevIsMac);
  };

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
            Shortcuts
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
        <Grid container display='flex' alignItems='center' pb='1rem' mt='-1rem'>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: '700', fontSize: '1rem' }}>
              {isMac ? 'MacOS' : 'Windows'} shortcuts
            </Typography>
          </Grid>
          <Grid item xs={6} display='flex' alignItems='center' justifyContent='flex-end'>
            <Typography fontSize='1rem'>MacOS</Typography>
            <Switch onChange={handleMacSwitch} checked={isMac} />
          </Grid>
        </Grid>
        {Shortcuts.map((shortcut, index) => (
          <Box key={index}>
            <ShortcutsLine
              key={index}
              windowsKeys={shortcut.windowsKeys}
              macOSKeys={shortcut.macOSKeys}
              macOS={isMac}
              description={shortcut.description}
            />
            {index < Shortcuts.length - 1 && <ShortcutsDivider />}
          </Box>
        ))}
      </DialogContent>
    </BootstrapDialog>
  );
};
