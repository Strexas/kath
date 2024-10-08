import { useWorkspaceContext } from '@/features/editor/hooks';
import { Divider, Menu, MenuItem } from '@mui/material';
import { generateTimestamp } from '@/features/editor/utils';

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
  const { consoleFeedback, consoleFeedbackReset } = useWorkspaceContext();

  const menuItems = [
    <MenuItem key='clear' onClick={() => handleActionContextMenu('clear')}>
      Clear
    </MenuItem>,
    <Divider key='divider-clear' />,
    <MenuItem key='export' onClick={() => handleActionContextMenu('export')}>
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
    const csvHeader = 'timestamp,type,message\n';
    const csvContent = consoleFeedback.map(feedback => `${feedback.timestamp},${feedback.type.toUpperCase()},"${feedback.message}"`).join('\n');
    const blob = new Blob([csvHeader.concat(csvContent)], { type: 'text/csv;charset=utf-8;' });

    const timestamp = generateTimestamp();

    // Create a link element to trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `console_feedback_${timestamp}.csv`);

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
