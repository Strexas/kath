import { IconTitleButton } from '@/components/buttons/IconTitleButton';
import { Colors, Paths } from '@/types';
import {
  AutoMode as AutoModeIcon,
  Home as HomeIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  SwitchAccessShortcut as SwitchAccessShortcutIcon,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  settingsDialogOpen: () => void;
  shortcutsDialogOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ settingsDialogOpen, shortcutsDialogOpen }) => {
  const location = useLocation();

  return (
    <Box sx={{ width: '4.2vw', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
        <Link to={Paths.HOME} style={{ textDecoration: 'none' }}>
          <IconTitleButton
            icon={
              <HomeIcon
                sx={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: Colors.backgroundPrimaryLight,
                }}
              />
            }
            title={'Home'}
            isActive={location.pathname === Paths.HOME}
          />
        </Link>
        <Link to={Paths.MACROS} style={{ textDecoration: 'none' }}>
          <IconTitleButton
            icon={
              <AutoModeIcon
                sx={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: Colors.backgroundPrimaryLight,
                }}
              />
            }
            title={'Macros'}
            isActive={location.pathname === Paths.MACROS}
          />
        </Link>
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
            <SettingsOutlinedIcon sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }} />
          }
          onClick={settingsDialogOpen}
        />
        <IconTitleButton
          icon={
            <SwitchAccessShortcutIcon
              sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }}
            />
          }
          onClick={shortcutsDialogOpen}
        />
      </Box>
    </Box>
  );
};
