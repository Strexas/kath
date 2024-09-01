import { Deblur as DeblurIcon } from '@mui/icons-material';

import { ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';

// Define the onClick functions for group 3
const applySpliceAiClick = () => {
  console.log('Clicked Apply SpliceAI Button!');
};

const applyCaddClick = () => {
  console.log('Clicked Apply CADD Button!');
};

// Define the buttons for group 3
export const ApplyGroupButtons: ToolbarGroupItemProps[] = [
  {
    group: 'apply',
    icon: DeblurIcon,
    label: 'Apply SpliceAI',
    onClick: applySpliceAiClick,
  },
  {
    group: 'apply',
    icon: DeblurIcon,
    label: 'Apply CADD',
    onClick: applyCaddClick,
  },
];
