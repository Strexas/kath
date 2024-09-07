import {
  StyledGroupParamsInputLabel,
  StyledGroupParamsListSubheader,
  StyledGroupParamsMenuItem,
  StyledGroupParamsMenuItemTypography,
  StyledGroupParamsMenuItemTypographyBold,
  StyledGroupParamsSelect,
  StyledGroupParamsTypography,
} from '@/features/editor/components/toolbarView/toolbarGroupParams';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { FileModel, FileTypes, GenesEnum } from '@/features/editor/types';
import { getWorkspaceArray } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { Box, Checkbox, FormControl, FormControlLabel, SelectChangeEvent, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

export interface DownloadGroupParamsProps {}

export const DownloadGroupParams: React.FC<DownloadGroupParamsProps> = () => {
  const { blocked } = useStatusContext();
  const Theme = useTheme();
  const { fileTree, fileTreeArray } = useWorkspaceContext();
  const { saveTo, saveToStateUpdate, gene, geneStateUpdate } = useToolbarContext();

  //
  // Gene state
  //
  const [geneValue, setGeneValue] = useState<GenesEnum>(gene);

  const handleGeneChange = (event: SelectChangeEvent<any>) => {
    setGeneValue(event.target.value);
    geneStateUpdate(event.target.value);
  };

  //
  // Save To state
  //
  const [fileArray, setFileArray] = useState<FileModel[]>(fileTreeArray);
  const [saveToValue, setSaveToValue] = useState<string>(saveTo);
  const [overrideValue, setOverrideValue] = useState<boolean>(false);

  const handleSaveToChange = (event: SelectChangeEvent<any>) => {
    setSaveToValue(event.target.value);
    saveToStateUpdate(event.target.value, false);
    setOverrideValue(false);
  };

  const handleOverrideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverrideValue(event.target.checked);
    saveToStateUpdate(saveToValue, event.target.checked);
  };

  //
  // Effects
  //
  useEffect(() => {
    setFileArray(getWorkspaceArray(fileTree));
  }, [fileTree]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '50% 50%', p: '1rem' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '1rem',
        }}
      >
        <FormControl sx={{ width: '50%' }}>
          <StyledGroupParamsInputLabel
            sx={{ color: blocked ? Theme.palette.action.disabled : Theme.palette.text.primary }}
          >
            Gene
          </StyledGroupParamsInputLabel>
          <StyledGroupParamsSelect
            id={'gene-select'}
            name={'gene-select'}
            label={'Gene'}
            value={geneValue}
            onChange={handleGeneChange}
            disabled={blocked}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxWidth: '10rem',
                  maxHeight: '15rem',
                  bgcolor: Theme.palette.background.default,
                },
              },
            }}
          >
            <StyledGroupParamsMenuItem key={GenesEnum.EYS} value={GenesEnum.EYS}>
              <StyledGroupParamsMenuItemTypography>{GenesEnum.EYS.toUpperCase()}</StyledGroupParamsMenuItemTypography>
            </StyledGroupParamsMenuItem>
          </StyledGroupParamsSelect>
        </FormControl>
      </Box>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.5rem' }}>
        <FormControl sx={{ width: '90%' }}>
          <StyledGroupParamsInputLabel
            sx={{ color: blocked ? Theme.palette.action.disabled : Theme.palette.text.primary }}
          >
            Save To
          </StyledGroupParamsInputLabel>
          <StyledGroupParamsSelect
            id={'save-to-select'}
            name={'save-to'}
            label={'Save To'}
            value={saveToValue}
            onChange={handleSaveToChange}
            disabled={blocked}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxWidth: '15.7rem',
                  maxHeight: '20rem',
                  bgcolor: Theme.palette.background.default,
                },
              },
            }}
          >
            <StyledGroupParamsMenuItem key={'new-file'} value={'/'}>
              <StyledGroupParamsMenuItemTypography>New file...</StyledGroupParamsMenuItemTypography>
            </StyledGroupParamsMenuItem>
            <StyledGroupParamsListSubheader key={'root'}>
              <StyledGroupParamsMenuItemTypographyBold>root:</StyledGroupParamsMenuItemTypographyBold>
            </StyledGroupParamsListSubheader>
            {fileArray.map((file) => {
              if (file.type === FileTypes.FOLDER) {
                return (
                  <StyledGroupParamsListSubheader key={file.id}>
                    <StyledGroupParamsMenuItemTypographyBold>{file.id}:</StyledGroupParamsMenuItemTypographyBold>
                  </StyledGroupParamsListSubheader>
                );
              }

              return (
                <StyledGroupParamsMenuItem key={file.id} value={file.id}>
                  <StyledGroupParamsMenuItemTypography>{file.label}</StyledGroupParamsMenuItemTypography>
                </StyledGroupParamsMenuItem>
              );
            })}
          </StyledGroupParamsSelect>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              id='override-checkbox'
              checked={overrideValue}
              onChange={handleOverrideChange}
              disabled={blocked}
            />
          }
          label={
            <StyledGroupParamsTypography sx={{ color: blocked ? Theme.palette.action.disabled : 'initial' }}>
              Override
            </StyledGroupParamsTypography>
          }
          labelPlacement='start'
        />
      </Box>
    </Box>
  );
};
