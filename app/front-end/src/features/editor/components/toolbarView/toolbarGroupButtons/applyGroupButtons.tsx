import { AccessAlarms as AccessAlarmsIcon } from '@mui/icons-material';

import { ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';

// Define the onClick functions for group 3
const handleAlarm3Click = () => {
  console.log('Clicked Alarm3 Button!');
};

// Define the buttons for group 3
export const ApplyGroupButtons: ToolbarGroupItemProps[] = [
  {
    group: 'apply',
    icon: AccessAlarmsIcon,
    label: 'Alarm3',
    onClick: handleAlarm3Click,
  },
];
