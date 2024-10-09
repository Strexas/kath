import { Autocomplete, TextField } from "@mui/material";
import {
  GroupParamsTypography,
  StyledGroupParamsMenuItemTypography,
  StyledGroupParamsMenuItemTypographyBold,
} from '@/features/editor/components/toolbarView/toolbarGroupParams';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { FileModel, FileTypes } from '@/features/editor/types';
import { getWorkspaceArray } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { defaultSaveTo } from "@/features/editor/stores";

export interface MergeGroupParamsProps {}

export const MergeGroupParams: React.FC<MergeGroupParamsProps> = () => {
  const { blocked } = useStatusContext();
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
  const [lovdFileState, setLovdFileState] = useState<FileModel | null>(lovdFile);
  const [clinvarFileState, setClinvarFileState] = useState<FileModel | null>(clinvarFile);
  const [gnomadFileState, setGnomadFileState] = useState<FileModel | null>(gnomadFile);

  const handleLovdFileChange = (value: FileModel) => {
    setLovdFileState(value);
    mergeStateUpdate(value, undefined, undefined);
    lovdErrorStateUpdate('');
  };

  const handleClinvarFileChange = (value: FileModel) => {
    setClinvarFileState(value);
    mergeStateUpdate(undefined, value, undefined);
    clinvarErrorStateUpdate('');
  };

  const handleGnomadFileChange = (value: FileModel) => {
    setGnomadFileState(value);
    mergeStateUpdate(undefined, undefined, value);
    gnomadErrorStateUpdate('');
  };

  //
  // Save To state
  //
  const [fileArray, setFileArray] = useState<FileModel[]>(fileTreeArray);
  const [saveToState, setSaveToState] = useState<FileModel>(saveTo);
  const [overrideState, setOverrideState] = useState<boolean>(false);

  const handleSaveToChange = (value: FileModel) => {
    setSaveToState(value);
    saveToStateUpdate(value, false);
    setOverrideState(false);
  };

  const handleOverrideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverrideState(event.target.checked);
    saveToStateUpdate(saveToState, event.target.checked);
  };

  //
  // Effects
  //
  useEffect(() => {
    setFileArray(getWorkspaceArray(fileTree));
  }, [fileTree]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', p: '1rem'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '50%'}}>
        <Autocomplete
          size="small"
          sx={(theme) => ({
            '& fieldset': {
              borderColor: theme.palette.text.primary,
              borderRadius: '1rem',
            },
          })}
          value={lovdFileState}
          onChange={(_event, value) => {
            if (value)
              handleLovdFileChange(value)
          }}
          disabled={blocked}
          options={fileArray.filter((file) => file.type !== FileTypes.FOLDER)}
          groupBy={(option) => option.parent?.id || 'root'}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => 
            <TextField
              {...params}
              label="Lovd File"
              error={Boolean(lovdError)}
            />
          }
          renderGroup={(params) => (
            <li key={params.key}>
              <Box sx={{ px: '0.5rem' }}>
                <StyledGroupParamsMenuItemTypographyBold>{`${params.group}:`}</StyledGroupParamsMenuItemTypographyBold>
              </Box>
              <StyledGroupParamsMenuItemTypography>{params.children}</StyledGroupParamsMenuItemTypography>
            </li>
          )}
        />
        <Autocomplete
          size="small"
          sx={(theme) => ({
            '& fieldset': {
              borderColor: theme.palette.text.primary,
              borderRadius: '1rem',
            },
          })}
          value={clinvarFileState}
          onChange={(_event, value) => {
            if (value)
              handleClinvarFileChange(value)
          }}
          disabled={blocked}
          options={fileArray.filter((file) => file.type !== FileTypes.FOLDER)}
          groupBy={(option) => option.parent?.id || 'root'}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => 
            <TextField
              {...params}
              label="Clinvar File"
              error={Boolean(clinvarError)}
            />
          }
          renderGroup={(params) => (
            <li key={params.key}>
              <Box sx={{ px: '0.5rem' }}>
                <StyledGroupParamsMenuItemTypographyBold>{`${params.group}:`}</StyledGroupParamsMenuItemTypographyBold>
              </Box>
              <StyledGroupParamsMenuItemTypography>{params.children}</StyledGroupParamsMenuItemTypography>
            </li>
          )}
        />
        <Autocomplete
          size="small"
          sx={(theme) => ({
            '& fieldset': {
              borderColor: theme.palette.text.primary,
              borderRadius: '1rem',
            },
          })}
          value={gnomadFileState}
          onChange={(_event, value) => {
            if (value)
              handleGnomadFileChange(value)
          }}
          disabled={blocked}
          options={fileArray.filter((file) => file.type !== FileTypes.FOLDER)}
          groupBy={(option) => option.parent?.id || 'root'}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => 
            <TextField
              {...params}
              label="Gnomad File"
              error={Boolean(gnomadError)}
            />
          }
          renderGroup={(params) => (
            <li key={params.key}>
              <Box sx={{ px: '0.5rem' }}>
                <StyledGroupParamsMenuItemTypographyBold>{`${params.group}:`}</StyledGroupParamsMenuItemTypographyBold>
              </Box>
              <StyledGroupParamsMenuItemTypography>{params.children}</StyledGroupParamsMenuItemTypography>
            </li>
          )}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '50%', flexGrow: '1'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '0.25rem'}}>
          <Autocomplete
            size="small"
            sx={(theme) => ({
              '& fieldset': {
                borderColor: theme.palette.text.primary,
                borderRadius: '1rem',
              },
            })}
            value={saveToState}
            onChange={(_event, value) => {
              if (value)
                handleSaveToChange(value)
            }}
            disabled={blocked}
            options={[defaultSaveTo, ...fileArray.filter((file) => file.type !== FileTypes.FOLDER)]}
            groupBy={(option) => option.parent?.id || 'root'}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => 
              <TextField
                {...params}
                label="Save To"
              />
            }
            renderGroup={(params) => (
              <li key={params.key}>
                <Box sx={{ px: '0.5rem' }}>
                  <StyledGroupParamsMenuItemTypographyBold>{`${params.group}:`}</StyledGroupParamsMenuItemTypographyBold>
                </Box>
                <StyledGroupParamsMenuItemTypography>{params.children}</StyledGroupParamsMenuItemTypography>
              </li>
            )}
          />
          {saveToState.id !== defaultSaveTo.id && (
            <FormControlLabel
              control={
                <Checkbox
                  id='override-checkbox'
                  checked={overrideState}
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
    </Box>
  );
};