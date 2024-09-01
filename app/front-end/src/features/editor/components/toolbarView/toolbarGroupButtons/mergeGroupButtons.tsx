import { MergeType as MergeTypeIcon } from '@mui/icons-material';

import { ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';

// Define the onClick functions for group 2
const mergeLovdAndGnomadClick = () => {
  console.log('Clicked Merge LOVD & gnomAD Button!');
};

const mergeLovdAndClinvarClick = () => {
  console.log('Clicked Merge LOVD & ClinVar Button!');
};

// Define the buttons for group 2
export const MergeGroupButtons: ToolbarGroupItemProps[] = [
  {
    group: 'merge',
    icon: MergeTypeIcon,
    label: 'Merge LOVD & gnomAD',
    onClick: mergeLovdAndGnomadClick,
  },
  {
    group: 'merge',
    icon: MergeTypeIcon,
    label: 'Merge LOVD & ClinVar',
    onClick: mergeLovdAndClinvarClick,
  },
];
