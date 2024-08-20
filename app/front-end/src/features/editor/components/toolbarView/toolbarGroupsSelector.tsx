import { Button, List, useTheme } from '@mui/material';

export interface ToolbarGroupsSelectorProps {
  children: React.ReactNode;
}

export const ToolbarGroupsSelector: React.FC<ToolbarGroupsSelectorProps> = ({ children }) => {
  return <List sx={{ height: '25%', p: '0', overflow: 'auto' }}>{children}</List>;
};

export interface ToolbarGroupsSelectorItemProps {
  id: string;
  label: string;
  onClick: () => void;
  groupRef?: string;
}

export const ToolbarGroupsSelectorItem: React.FC<ToolbarGroupsSelectorItemProps> = ({
  id,
  label,
  onClick,
  groupRef,
}) => {
  const Theme = useTheme();

  return (
    <Button
      id={id}
      sx={{
        height: '100%',
        bgcolor: groupRef === id ? Theme.palette.background.paper : Theme.palette.action.selected,
        borderRadius: '0.625rem 0.625rem 0rem 0rem',
        px: '3rem',
        fontWeight: 'bold',
        color: Theme.palette.text.primary,
        ':hover': {
          backgroundColor: Theme.palette.background.paper,
        },
      }}
      onClick={() => onClick()}
    >
      {label}
    </Button>
  );
};
