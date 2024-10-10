import { InputLabel, ListSubheader, MenuItem, Select, Typography, styled } from '@mui/material';

export const StyledGroupParamsTypography = styled(Typography)({
  fontSize: '0.875rem',
  transition: 'color 0.3s ease',
});

export const StyledGroupParamsInputLabel = styled(InputLabel)({
  transition: 'color 0.3s ease',
});

export const StyledGroupParamsSelect = styled(Select)({
  height: '80%',
  transition: 'color 0.3s ease, border-color 0.3s ease',
});

export const StyledGroupParamsMenuItem = styled(MenuItem)({
  whiteSpace: 'normal',
});

export const StyledGroupParamsListSubheader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  whiteSpace: 'normal',
}));

export const StyledGroupParamsMenuItemTypography = styled(Typography)({
  fontSize: '1rem',
  overflowWrap: 'break-word',
});

export const StyledGroupParamsMenuItemTypographyBold = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 'bold',
  overflowWrap: 'break-word',
});
