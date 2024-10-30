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

export interface ApplyGroupParamsProps {}

export const ApplyGroupParams: React.FC<ApplyGroupParamsProps> = () => {
  const { blocked } = useStatusContext();
  const { fileTree, fileTreeArray } = useWorkspaceContext();
  const { saveTo, saveToStateUpdate, saveToError, saveToErrorStateUpdate, applyTo, applyToStateUpdate, applyError, applyErrorStateUpdate } =
    useToolbarContext();

  //
  // Apply state
  //
  const [applyToState, setApplyToState] = useState<FileModel | null>(applyTo);

  const handleApplyToChange = (value: FileModel) => {
    setApplyToState(value);
    applyToStateUpdate(value);
    applyErrorStateUpdate('');
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
    saveToErrorStateUpdate('');
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
          value={applyToState}
          onChange={(_event, value) => {
            if (value)
              handleApplyToChange(value)
          }}
          disabled={blocked}
          options={fileArray.filter((file) => file.type !== FileTypes.FOLDER)}
          groupBy={(option) => option.parent?.id || 'root'}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => 
            <TextField
              {...params}
              label="Apply To"
              error={Boolean(applyError)}
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
                error={Boolean(saveToError)}
                helperText={saveToError}
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