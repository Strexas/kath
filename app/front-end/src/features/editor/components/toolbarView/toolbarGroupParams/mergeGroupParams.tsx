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

export interface MergeGroupParamsProps {}

export const MergeGroupParams: React.FC<MergeGroupParamsProps> = () => {
  const { blocked } = useStatusContext();
  const Theme = useTheme();
  const { fileTree, fileTreeArray } = useWorkspaceContext();
  const {
    saveTo,
    saveToStateUpdate,
    lovdFile,
    clinvarFile,
    gnomadFile,
    mergeStateUpdate,
    lovdError,
    clinvarError,
    gnomadError,
    lovdErrorStateUpdate,
    clinvarErrorStateUpdate,
    gnomadErrorStateUpdate,
  } = useToolbarContext();

  //
  // Merge state
  //
  const [lovdFileValue, setLovdFileValue] = useState<string>(lovdFile);
  const [clinvarFileValue, setClinvarFileValue] = useState<string>(clinvarFile);
  const [gnomadFileValue, setGnomadFileValue] = useState<string>(gnomadFile);

  const handleLovdFileChange = (event: SelectChangeEvent<any>) => {
    setLovdFileValue(event.target.value);
    mergeStateUpdate(event.target.value, clinvarFileValue, gnomadFileValue);
    lovdErrorStateUpdate('');
  };

  const handleClinvarFileChange = (event: SelectChangeEvent<any>) => {
    setClinvarFileValue(event.target.value);
    mergeStateUpdate(lovdFileValue, event.target.value, gnomadFileValue);
    clinvarErrorStateUpdate('');
  };

  const handleGnomadFileChange = (event: SelectChangeEvent<any>) => {
    setGnomadFileValue(event.target.value);
    mergeStateUpdate(lovdFileValue, clinvarFileValue, event.target.value);
    gnomadErrorStateUpdate('');
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
          gap: '0.2rem',
        }}
      >
        <FormControl sx={{ width: '90%' }}>
          <GroupParamsInputLabel label={'Lovd File'} error={lovdError} />
          <StyledGroupParamsSelect
            id={'lovd-file-select'}
            name={'lovd-file-select'}
            label={'Lovd File'}
            value={lovdFileValue}
            onChange={handleLovdFileChange}
            error={Boolean(lovdError)}
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
        <FormControl sx={{ width: '90%' }}>
          <GroupParamsInputLabel label={'Clinvar File'} error={clinvarError} />
          <StyledGroupParamsSelect
            id={'clinvar-file-select'}
            name={'clinvar-file-select'}
            label={'Clinvar File'}
            value={clinvarFileValue}
            onChange={handleClinvarFileChange}
            error={Boolean(clinvarError)}
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
        <FormControl sx={{ width: '90%' }}>
          <GroupParamsInputLabel label={'Gnomad File'} error={gnomadError} />
          <StyledGroupParamsSelect
            id={'gnomad-file-select'}
            name={'gnomad-file-select'}
            label={'Gnomad File'}
            value={gnomadFileValue}
            onChange={handleGnomadFileChange}
            error={Boolean(gnomadError)}
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
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
        <FormControl sx={{ width: '90%' }}>
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
