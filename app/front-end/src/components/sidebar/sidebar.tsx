import { IconTitleButton } from '@/components/buttons/IconTitleButton';
import { Colors } from '@/types';
import {
  AutoMode as AutoModeIcon,
  Home as HomeIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  SwitchAccessShortcut as SwitchAccessShortcutIcon,
} from '@mui/icons-material';
import { Box } from '@mui/material';

interface SidebarProps {
  handleSettingsDialogOpen: () => void;
  handleShortcutsDialogOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ handleSettingsDialogOpen, handleShortcutsDialogOpen }) => {
  return (
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
        />
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
            <SettingsOutlinedIcon sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }} />
          }
          onClick={handleSettingsDialogOpen}
        />
        <IconTitleButton
          icon={
            <SwitchAccessShortcutIcon
              sx={{ width: '1.5rem', height: '1.5rem', color: Colors.backgroundPrimaryLight }}
            />
          }
          onClick={handleShortcutsDialogOpen}
        />
      </Box>
    </Box>
  );
};
