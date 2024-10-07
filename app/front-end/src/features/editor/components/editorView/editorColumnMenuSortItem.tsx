import { SortEnum } from '@/features/editor/types';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { MouseEvent as MouseEventReact } from 'react';

export interface EditorColumnMenuSortItemProps {
  onClick: (event: MouseEventReact<HTMLButtonElement, MouseEvent>) => void;
  onSort: (sort: SortEnum) => void;
}

export const EditorColumnMenuSortItem: React.FC<EditorColumnMenuSortItemProps> = ({ onClick, onSort }) => {
  const Theme = useTheme();

  const handleClick = (event: MouseEventReact<HTMLButtonElement, MouseEvent>, sort: SortEnum) => {
    onClick(event);
    switch (sort) {
      case SortEnum.ASC:
        onSort(SortEnum.ASC);
        break;
      case SortEnum.DESC:
        onSort(SortEnum.DESC);
        break;
      default:
        onSort(SortEnum.NONE);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Button
        onClick={(event) => handleClick(event, SortEnum.ASC)}
        sx={{ justifyContent: 'left', px: '0.85rem', borderRadius: '0' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
          <ArrowUpwardIcon sx={{ color: Theme.palette.text.secondary }} />
          <Typography>Sort ASC</Typography>
        </Box>
      </Button>
      <Button
        onClick={(event) => handleClick(event, SortEnum.DESC)}
        sx={{ justifyContent: 'left', px: '0.85rem', borderRadius: '0' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
          <ArrowDownwardIcon sx={{ color: Theme.palette.text.secondary }} />
          <Typography>Sort DESC</Typography>
        </Box>
      </Button>
      <Button
        onClick={(event) => handleClick(event, SortEnum.NONE)}
        sx={{ justifyContent: 'left', px: '0.85rem', borderRadius: '0' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
          <RemoveIcon sx={{ color: Theme.palette.text.secondary }} />
          <Typography>Unsort</Typography>
        </Box>
      </Button>
    </Box>
  );
};
