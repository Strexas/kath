import {
  GroupParamsInputLabel,
  GroupParamsTypography,
  StyledGroupParamsListSubheader,
  StyledGroupParamsMenuItem,
  StyledGroupParamsMenuItemTypography,
  StyledGroupParamsMenuItemTypographyBold,
  StyledGroupParamsSelect,
} from '@/features/editor/components/toolbarView/toolbarGroupParams';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { FileModel, FileTypes } from '@/features/editor/types';
import { getWorkspaceArray } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { Box, Checkbox, FormControl, FormControlLabel, SelectChangeEvent, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ApplyGroupParamsProps {}

export const ApplyGroupParams: React.FC<ApplyGroupParamsProps> = () => {
  const { blocked } = useStatusContext();
  const Theme = useTheme();
  const { fileTree, fileTreeArray } = useWorkspaceContext();
  const { saveTo, saveToStateUpdate, applyTo, applyToStateUpdate, applyError, applyErrorStateUpdate } =
    useToolbarContext();

  //
  // Apply state
  //
  const [applyToValue, setApplyToValue] = useState<string>(applyTo);

  const handleApplyToChange = (event: SelectChangeEvent<any>) => {
    setApplyToValue(event.target.value);
    applyToStateUpdate(event.target.value);
    applyErrorStateUpdate('');
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
          display: 'grid',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '1rem',
        }}
      >
        <FormControl sx={{ width: '90%' }} size='small'>
          <GroupParamsInputLabel label={'Apply To'} error={applyError} />
          <StyledGroupParamsSelect
            id={'lovd-file-select'}
            name={'lovd-file-select'}
            label={'Lovd File'}
            value={applyToValue}
            onChange={handleApplyToChange}
            error={Boolean(applyError)}
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
      </Box>
      <Box sx={{ height: '100%', display: 'grid', flexDirection: 'column', alignItems: 'end', rowGap: '2.16rem' }}>
        <FormControl sx={{ width: '90%' }} size='small'>
          <GroupParamsInputLabel label={'Save To'} />
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
        {saveToValue !== '/' && (
          <FormControlLabel
            control={
              <Checkbox
                id='override-checkbox'
                checked={overrideValue}
                onChange={handleOverrideChange}
                disabled={blocked}
              />
            }
            label={<GroupParamsTypography label={'Override File'} />}
            labelPlacement='start'
          />
        )}
      </Box>
    </Box>
  );
};
