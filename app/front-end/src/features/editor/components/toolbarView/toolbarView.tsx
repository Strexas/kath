import {
  ToolbarGroup,
  ToolbarGroupItem,
  ToolbarGroupItemProps,
  ToolbarGroupsSelector,
  ToolbarGroupsSelectorItem,
  ToolbarGroupsSelectorItemProps,
} from '@/features/editor/components/toolbarView';
import {
  ApplyGroupButtons,
  DownloadGroupButtons,
  MergeGroupButtons,
} from '@/features/editor/components/toolbarView/toolbarGroupButtons';
import { useMemo, useState } from 'react';

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
  const [selectedGroup, setSelectedGroup] = useState<string>('download');

  const ToolbarGroups: ToolbarGroupsSelectorItemProps[] = [
    {
      id: 'download',
      label: 'Download',
      onClick: () => setSelectedGroup('download'),
    },
    {
      id: 'merge',
      label: 'Merge',
      onClick: () => setSelectedGroup('merge'),
    },
    {
      id: 'apply',
      label: 'Apply',
      onClick: () => setSelectedGroup('apply'),
    },
  ];

  // Combine the button groups into a dictionary for easy access
  const ToolbarGroupsButtons: Record<string, ToolbarGroupItemProps[]> = useMemo(
    () => ({
      download: DownloadGroupButtons,
      merge: MergeGroupButtons,
      apply: ApplyGroupButtons,
    }),
    [DownloadGroupButtons, MergeGroupButtons, ApplyGroupButtons]
  );

  return (
    <>
      <ToolbarGroupsSelector>
        {ToolbarGroups.map((group, index) => (
          <ToolbarGroupsSelectorItem key={index} {...group} groupRef={selectedGroup} />
        ))}
      </ToolbarGroupsSelector>
      <ToolbarGroup>
        {ToolbarGroupsButtons[selectedGroup]?.map((button, index) => <ToolbarGroupItem key={index} {...button} />)}
      </ToolbarGroup>
    </>
  );
};
