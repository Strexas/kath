import { ToolbarGroupItemProps } from '@/features/editor/components/toolbarView';

import { Download as DownloadIcon } from '@mui/icons-material';

const handleDownloadLovdClick = () => {
  console.log('Clicked Download Lovd Button!');
};

const handleDownloadClinvarClick = () => {
  console.log('Clicked Download Clinvar Button!');
};

const handleDownloadGnomadClick = () => {
  console.log('Clicked Download Gnomad Button!');
};

// Define the buttons for group 1
export const DownloadGroupButtons: ToolbarGroupItemProps[] = [
  {
    group: 'download',
    icon: DownloadIcon,
    label: 'LOVD',
    onClick: handleDownloadLovdClick,
  },
  {
    group: 'download',
    icon: DownloadIcon,
    label: 'ClinVar',
    onClick: handleDownloadClinvarClick,
  },
  {
    group: 'download',
    icon: DownloadIcon,
    label: 'gnomAD',
    onClick: handleDownloadGnomadClick,
  },
];
