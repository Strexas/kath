import {
  ToolbarGroup,
  ToolbarGroupItem,
  ToolbarGroupItemProps,
  ToolbarGroupsSelector,
  ToolbarGroupsSelectorItem,
  ToolbarGroupsSelectorItemProps,
} from '@/features/editor/components/toolbarView';
import {
  AccessAlarms as AccessAlarmsIcon,
  AccessibleForward as AccessibleForwardIcon,
  Android as AndroidIcon,
} from '@mui/icons-material';
import { useState } from 'react';

/**
 * ToolbarView component manages and displays a set of toolbar groups and items.
 *
 * @description This component renders a selector for toolbar groups and a group of toolbar items. It uses the `ToolbarGroupsSelector`
 * to list the available groups and allows users to select a group. Based on the selected group, it displays corresponding items
 * using the `ToolbarGroup` component. The items are buttons with icons and labels, and each button triggers a log message on click.
 *
 * The component maintains the state of the currently selected group and updates it when a different group is selected. It organizes
 * toolbar items into multiple groups, allowing for dynamic rendering based on the selection.
 *
 * @component
 *
 * @example
 * // Example usage of the ToolbarView component
 * return (
 *   <ToolbarView />
 * );
 *
 * @returns {JSX.Element} The rendered ToolbarView component, which includes the toolbar group selector and the items of the selected group.
 */
export const ToolbarView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('group1');

  const ToolbarGroupsButtons: ToolbarGroupItemProps[] = [
    {
      group: 'group1',
      icon: AccessAlarmsIcon,
      label: 'Alarm1',
      onClick: () => {
        console.log('Clicked Alarm1 Button!');
      },
    },
    {
      group: 'group1',
      icon: AccessibleForwardIcon,
      label: 'Forward1',
      onClick: () => {
        console.log('Clicked Forward1 Button!');
      },
    },
    {
      group: 'group1',
      icon: AndroidIcon,
      label: 'Android1',
      onClick: () => {
        console.log('Clicked Android1 Button!');
      },
    },
    {
      group: 'group2',
      icon: AccessAlarmsIcon,
      label: 'Alarm2',
      onClick: () => {
        console.log('Clicked Alarm2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AccessibleForwardIcon,
      label: 'Forward2',
      onClick: () => {
        console.log('Clicked Forward2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AndroidIcon,
      label: 'Android2',
      onClick: () => {
        console.log('Clicked Android2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AccessAlarmsIcon,
      label: 'Alarm2',
      onClick: () => {
        console.log('Clicked Alarm2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AccessibleForwardIcon,
      label: 'Forward2',
      onClick: () => {
        console.log('Clicked Forward2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AndroidIcon,
      label: 'Android2',
      onClick: () => {
        console.log('Clicked Android2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AccessAlarmsIcon,
      label: 'Alarm2',
      onClick: () => {
        console.log('Clicked Alarm2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AccessibleForwardIcon,
      label: 'Forward2',
      onClick: () => {
        console.log('Clicked Forward2 Button!');
      },
    },
    {
      group: 'group2',
      icon: AndroidIcon,
      label: 'Android2',
      onClick: () => {
        console.log('Clicked Android2 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessAlarmsIcon,
      label: 'Alarm3',
      onClick: () => {
        console.log('Clicked Alarm3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessibleForwardIcon,
      label: 'Forward3',
      onClick: () => {
        console.log('Clicked Forward3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AndroidIcon,
      label: 'Android3',
      onClick: () => {
        console.log('Clicked Android3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessAlarmsIcon,
      label: 'Alarm3',
      onClick: () => {
        console.log('Clicked Alarm3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessibleForwardIcon,
      label: 'Forward3',
      onClick: () => {
        console.log('Clicked Forward3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AndroidIcon,
      label: 'Android3',
      onClick: () => {
        console.log('Clicked Android3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessAlarmsIcon,
      label: 'Alarm3',
      onClick: () => {
        console.log('Clicked Alarm3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessibleForwardIcon,
      label: 'Forward3',
      onClick: () => {
        console.log('Clicked Forward3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AndroidIcon,
      label: 'Android3',
      onClick: () => {
        console.log('Clicked Android3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessAlarmsIcon,
      label: 'Alarm3',
      onClick: () => {
        console.log('Clicked Alarm3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessibleForwardIcon,
      label: 'Forward3',
      onClick: () => {
        console.log('Clicked Forward3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AndroidIcon,
      label: 'Android3',
      onClick: () => {
        console.log('Clicked Android3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessAlarmsIcon,
      label: 'Alarm3',
      onClick: () => {
        console.log('Clicked Alarm3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AccessibleForwardIcon,
      label: 'Forward3',
      onClick: () => {
        console.log('Clicked Forward3 Button!');
      },
    },
    {
      group: 'group3',
      icon: AndroidIcon,
      label: 'Android3',
      onClick: () => {
        console.log('Clicked Android3 Button!');
      },
    },
  ];

  const ToolbarGroups: ToolbarGroupsSelectorItemProps[] = [
    {
      id: 'group1',
      label: 'Group 1',
      onClick: () => setSelectedGroup('group1'),
    },
    {
      id: 'group2',
      label: 'Group 2',
      onClick: () => setSelectedGroup('group2'),
    },
    {
      id: 'group3',
      label: 'Group 3',
      onClick: () => setSelectedGroup('group3'),
    },
  ];

  return (
    <>
      <ToolbarGroupsSelector>
        {ToolbarGroups.map((group, index) => (
          <ToolbarGroupsSelectorItem key={index} {...group} groupRef={selectedGroup} />
        ))}
      </ToolbarGroupsSelector>
      <ToolbarGroup>
        {ToolbarGroupsButtons.map(
          (button, index) => button.group === selectedGroup && <ToolbarGroupItem key={index} {...button} />
        )}
      </ToolbarGroup>
    </>
  );
};
