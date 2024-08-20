import { SvgIconComponent } from '@mui/icons-material';
import { Box, Button, List, useTheme } from '@mui/material';

export interface ToolbarGroupProps {
  children: React.ReactNode;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children }) => {
  const Theme = useTheme();

  return (
    <List
      sx={{
        height: '75%',
        bgcolor: Theme.palette.background.paper,
        px: '1rem',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '1rem',
        overflow: 'auto',
        alignContent: 'flex-start',
      }}
    >
      {children}
    </List>
  );
};

export interface ToolbarGroupItemProps {
  group: string;
  icon: SvgIconComponent;
  label: string;
  onClick: () => void;
}

export const ToolbarGroupItem: React.FC<ToolbarGroupItemProps> = ({ icon: Icon, label, onClick }) => {
  const Theme = useTheme();

  return (
    <Box sx={{ height: '40%', alignContent: 'center' }}>
      <Button
        startIcon={<Icon sx={{ color: Theme.palette.text.primary }} />}
        onClick={() => onClick()}
        sx={{
          color: Theme.palette.text.primary,
          bgcolor: Theme.palette.background.default,
          borderRadius: '0.625rem',
          px: '1rem',
          '&:hover': {
            bgcolor: Theme.palette.action.hover,
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};
