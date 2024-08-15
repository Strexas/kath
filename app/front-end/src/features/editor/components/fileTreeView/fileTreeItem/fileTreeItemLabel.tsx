import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TreeItem2Label } from '@mui/x-tree-view/TreeItem2';

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

const FileTreeItemLabelIcon = () => {
  const Theme = useTheme();
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: Theme.palette.primary.main,
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
};

const StyledFileTreeItemLabelTypography = styled(Typography)({
  color: 'inherit',
  fontSize: '1rem',
  fontWeight: 500,
  maxWidth: '100%',
  wordWrap: 'break-word',
}) as unknown as typeof Typography;

export const FileTreeItemLabel = ({ icon: Icon, expandable, children, ...other }: CustomLabelProps) => {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && <Box component={Icon} className='labelIcon' color='inherit' sx={{ mr: 1, fontSize: '1.2rem' }} />}

      <StyledFileTreeItemLabelTypography>{children}</StyledFileTreeItemLabelTypography>
      {expandable && <FileTreeItemLabelIcon />}
    </TreeItem2Label>
  );
};
