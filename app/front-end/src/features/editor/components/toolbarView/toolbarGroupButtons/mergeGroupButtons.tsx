import { MergeType as MergeTypeIcon } from '@mui/icons-material';

import { ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';

const mergeLovdAndGnomadClick = () => {
  console.log('Clicked Merge LOVD & gnomAD Button!');
};

const mergeLovdAndClinvarClick = () => {
  console.log('Clicked Merge LOVD & ClinVar Button!');
};

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
