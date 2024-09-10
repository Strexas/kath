import { StyledGroupParamsTypography } from '@/features/editor/components/toolbarView/toolbarGroupParams';
import { useStatusContext } from '@/hooks';
import { useTheme } from '@mui/material';

export interface GroupParamsTypographyProps {
  label: string;
}

export const GroupParamsTypography: React.FC<GroupParamsTypographyProps> = ({ label }) => {
  const { blocked } = useStatusContext();
  const Theme = useTheme();
  return (
    <StyledGroupParamsTypography sx={{ color: blocked ? Theme.palette.action.disabled : Theme.palette.text.primary }}>
      {label}
    </StyledGroupParamsTypography>
  );
};
