import { StyledGroupParamsInputLabel } from '@/features/editor/components/toolbarView/toolbarGroupParams/';
import { useStatusContext } from '@/hooks';
import { useTheme } from '@mui/material';

export interface GroupParamsInputLabelProps {
  label: string;
  error?: string;
}

export const GroupParamsInputLabel: React.FC<GroupParamsInputLabelProps> = ({ label, error }) => {
  const { blocked } = useStatusContext();
  const Theme = useTheme();
  return (
    <StyledGroupParamsInputLabel
      sx={{
        color: blocked ? Theme.palette.action.disabled : error ? Theme.palette.error.main : Theme.palette.text.primary,
      }}
    >
      {label}
    </StyledGroupParamsInputLabel>
  );
};
