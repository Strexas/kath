import { AccessAlarms as AccessAlarmsIcon } from '@mui/icons-material';

import { ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';

// Define the onClick functions for group 2
const handleAlarm2Click = () => {
  console.log('Clicked Alarm2 Button!');
};

// Define the buttons for group 2
export const MergeGroupButtons: ToolbarGroupItemProps[] = [
  {
    group: 'merge',
    icon: AccessAlarmsIcon,
    label: 'Merge LOVD & gnomAD',
    onClick: handleAlarm2Click,
  },
];
