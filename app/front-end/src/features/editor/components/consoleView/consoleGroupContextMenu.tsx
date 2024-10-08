import { useWorkspaceContext } from '@/features/editor/hooks';
import { Divider, Menu, MenuItem } from '@mui/material';

export interface ConsoleGroupContextMenuProps {
  anchorPosition: { top: number; left: number };
  open: boolean;
  onClose: () => void;
}

export const ConsoleGroupContextMenu: React.FC<ConsoleGroupContextMenuProps> = ({
  anchorPosition,
  open,
  onClose,
}) => {
  const { consoleFeedbackReset } = useWorkspaceContext();

  const menuItems = [
    <MenuItem key='clear' onClick={() => handleActionContextMenu('clear')}>
      Clear
    </MenuItem>,
    <Divider key='divider-clear' />,
    <MenuItem key='export' disabled onClick={() => handleActionContextMenu('export')}>
      Export...
    </MenuItem>
  ];
  

  const handleActionContextMenu = (action: string) => {
    onClose();
    switch (action) {
      case 'clear':
        handleClearAction();
        break;
      case 'export':
        handleExportAction();
        break;
      default:
        break;
    }
  };

  const handleClearAction = () => {
    consoleFeedbackReset();
  }

  const handleExportAction = () => {
    // TODO: Implement export action
  }

  return (
    <>
      <Menu
        anchorReference='anchorPosition'
        anchorPosition={anchorPosition}
        open={open}
        onClose={onClose}
        sx={{ '& .MuiPaper-root': { width: '5%', minWidth: '5rem' } }}
      >
        {menuItems}
      </Menu>
    </>
  );
};
