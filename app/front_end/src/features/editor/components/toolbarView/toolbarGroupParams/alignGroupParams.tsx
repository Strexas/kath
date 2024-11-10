import {
  StyledGroupParamsMenuItemTypography,
  StyledGroupParamsMenuItemTypographyBold,
} from '@/features/editor/components/toolbarView/toolbarGroupParams';
import { useToolbarContext, useWorkspaceContext } from '@/features/editor/hooks';
import { FileModel, FileTypes } from '@/features/editor/types';
import { getWorkspaceArray } from '@/features/editor/utils';
import { useStatusContext } from '@/hooks';
import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export interface AlignGroupParamsProps {}

export const AlignGroupParams: React.FC<AlignGroupParamsProps> = () => {
  const { blocked } = useStatusContext();
  const { fileTree, fileTreeArray } = useWorkspaceContext();
  const {
    fastaFile,
    fastqFileFolder,
    fastaError,
    fastqError,
    fastaErrorStateUpdate,
    fastqErrorStateUpdate,
    alignStateUpdate,
  } = useToolbarContext();

  //
  // Align state
  //
  const [fastaFileState, setFastaFileState] = useState<FileModel | null>(fastaFile);
  const [fastqFileFolderState, setFastqFileFolderState] = useState<FileModel | null>(fastqFileFolder);

  const handleFastaFileChange = (value: FileModel) => {
    setFastaFileState(value);
    alignStateUpdate(value, undefined);
    fastaErrorStateUpdate('');
  };

  const handleFastqFileFolderChange = (value: FileModel) => {
    setFastqFileFolderState(value);
    alignStateUpdate(undefined, value);
    fastqErrorStateUpdate('');
  };

  //
  // Save To state
  //
  const [fileArray, setFileArray] = useState<FileModel[]>(fileTreeArray);

  //
  // Effects
  //
  useEffect(() => {
    setFileArray(getWorkspaceArray(fileTree));
  }, [fileTree]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', p: '1rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '50%' }}>
        <Autocomplete
          size='small'
          sx={(theme) => ({
            '& fieldset': {
              borderColor: theme.palette.text.primary,
              borderRadius: '1rem',
            },
          })}
          value={fastaFileState}
          onChange={(_event, value) => {
            if (value) handleFastaFileChange(value);
          }}
          disabled={blocked}
          options={fileArray.filter((file) => file.type !== FileTypes.FOLDER)}
          groupBy={(option) => option.parent?.id || 'root'}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label='FASTA File' error={Boolean(fastaError)} />}
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
          size='small'
          sx={(theme) => ({
            '& fieldset': {
              borderColor: theme.palette.text.primary,
              borderRadius: '1rem',
            },
          })}
          value={fastqFileFolderState}
          onChange={(_event, value) => {
            if (value) handleFastqFileFolderChange(value);
          }}
          disabled={blocked}
          options={fileArray.filter((file) => file.type === FileTypes.FOLDER)}
          groupBy={(option) => option.parent?.id || 'root'}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label='FASTQ Folder' error={Boolean(fastqError)} />}
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
    </Box>
  );
};
