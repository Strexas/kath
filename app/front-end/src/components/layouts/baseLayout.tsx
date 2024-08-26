import { IconTitleButton } from '@/components/buttons/IconTitleButton';
import { SettingsDialog, ShortcutsDialog } from '@/components/dialogs';
import { Colors } from '@/types';
import {
  AutoMode as AutoModeIcon,
  Home as HomeIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  SwitchAccessShortcut as SwitchAccessShortcutIcon,
} from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

interface Props {
  children?: React.ReactNode;
}

/**
 * Base layout component for the application, providing a structured layout with a header,
 * a sidebar with icon buttons, and a main content area.
 *
 * @component
 *
 * @description The `BaseLayout` component sets up the basic structure of the application, including
 * a header with application title and version, a sidebar with icon buttons for navigation and settings,
 * and a main content area where child components are rendered. The layout is responsive and uses Material-UI
 * for styling.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} [props.children] - The child components to be rendered in the main content area.
 *
 * @returns {JSX.Element} The `BaseLayout` component, which includes a header, sidebar, and content area.
 */
export const BaseLayout: React.FC<Props> = ({ children }) => {
  const Theme = useTheme();

  const [isShortcutsMenuOpen, setIsShortcutsMenuOpen] = useState(false);
  const handleShortcutsMenuOpen = () => {
    setIsShortcutsMenuOpen(true);
  };
  const handleShortcutsMenuClose = () => {
    setIsShortcutsMenuOpen(false);
  };

  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const handleSettingsDialogOpen = () => {
    setIsSettingsDialogOpen(true);
  };
  const handleSettingsDialogClose = () => {
    setIsSettingsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor:
          Theme.palette.mode === 'light' ? Colors.mainNavigationBackgroundLight : Colors.mainNavigationBackgroundDark,
      }}
    >
      <Box sx={{ width: '100%', height: 'max(4%, 2.5rem)', display: 'flex', flexDirection: 'row' }}>
        <Box
          sx={{
            width: '50%',
            height: '100%',
            pl: 'max(0.625rem, 1%)',
            display: 'flex',
            flexDirection: 'row',
            gap: '0.625rem',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              color: Colors.backgroundPrimaryLight,
            }}
          >
            Kath {/* TODO: add application context provider to get values of it */}
          </Typography>
          <Typography
            sx={{
              px: '0.625rem',
              py: '0.125rem',
              borderRadius: '1.25rem',
              fontSize: '0.875rem',
              bgcolor: Colors.info,
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
              color: Colors.textPrimaryLight,
            }}
          >
            ALPHA {/* TODO: add application context provider to get values of it */}
          </Typography>
        </Box>
        <Typography
          sx={{
            width: '50%',
            height: '100%',
            pr: 'max(0.625rem, 1%)',
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: Colors.secondaryLight,
          }}
        >
          Version 1.0.02 {/* TODO: add application context provider to get values of it */}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 'calc(100vw - 0.5rem)',
          height: 'calc(100vh - max(4%, 2.5rem))',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box sx={{ width: '5vw', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              width: '100%',
              height: '50%',
              paddingTop: '0.625rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
              alignItems: 'center',
            }}
          >
            <IconTitleButton
              icon={<HomeIcon sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }} />}
              title={'Home'}
            />
            <IconTitleButton
              icon={<AutoModeIcon sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }} />}
              title={'Macros'}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '50%',
              paddingBottom: '0.625rem',
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: '0.625rem',
              alignItems: 'center',
            }}
          >
            <IconTitleButton
              icon={
                <SettingsOutlinedIcon
                  sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }}
                />
              }
              onClick={handleSettingsDialogOpen}
            />
            <IconTitleButton
              icon={
                <SwitchAccessShortcutIcon
                  sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }}
                />
              }
              onClick={handleShortcutsMenuOpen}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: '95.75%',
            height: 'calc(100% - 0.5rem)',
            borderRadius: '0.625rem',
            bgcolor: Theme.palette.secondary.main,
          }}
        >
          {children}
        </Box>
        <SettingsDialog open={isSettingsDialogOpen} onClose={handleSettingsDialogClose} />
        <ShortcutsDialog open={isShortcutsMenuOpen} onClose={handleShortcutsMenuClose} />
      </Box>
    </Box>
  );
};
