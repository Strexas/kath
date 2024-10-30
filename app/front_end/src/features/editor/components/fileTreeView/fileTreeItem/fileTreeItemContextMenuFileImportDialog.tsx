import { FileTreeItemContextMenuStyledDialog } from '@/features/editor/components/fileTreeView/fileTreeItem';
import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileTreeViewItemProps } from '@/features/editor/types';
import { doesFileExist, findUniqueFileName, getFileExtension } from '@/features/editor/utils';
import { axios } from '@/lib';
import { Endpoints } from '@/types';
import { Close as CloseIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

export interface FileTreeItemContextMenuFileImportDialogProps {
  open: boolean;
  onClose: () => void;
  item: FileTreeViewItemProps;
}

export const FileTreeItemContextMenuFileImportDialog: React.FC<FileTreeItemContextMenuFileImportDialogProps> = ({
  open,
  onClose,
  item,
}) => {
  const Theme = useTheme();
  const { fileTree } = useWorkspaceContext();

  const [filename, setFilename] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [newInfoFileName, setNewInfoFileName] = useState('');
  const [isIncorrectFileType, setIsIncorrectFileType] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilename('');
    setNewInfoFileName('');
    setIsIncorrectFileType(false);

    if (!e.target.files) {
      return;
    }

    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFilename(selectedFile.name);

    const filePath = item.id === '' ? selectedFile.name : `${item.id}/${selectedFile.name}`;

    const fileExtension = getFileExtension(selectedFile.name);
    if (fileExtension !== 'csv' && fileExtension !== 'txt') {
      setIsIncorrectFileType(true);
      return;
    }

    if (doesFileExist(fileTree, filePath)) {
      const newFileName = findUniqueFileName(fileTree, filePath);
      setNewInfoFileName(newFileName);

      const newFile = new File([selectedFile], newFileName, { type: selectedFile.type });

      setFile(newFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = item.id ? `${Endpoints.WORKSPACE_IMPORT}/${item.id}` : Endpoints.WORKSPACE_IMPORT;

      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <FileTreeItemContextMenuStyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={9}>
            <Typography sx={{ color: Theme.palette.primary.main, fontWeight: '700', fontSize: '1.2rem' }}>
              Import
            </Typography>
          </Grid>
          <Grid item xs={3} textAlign={'right'}>
            <IconButton
              onClick={onClose}
              sx={{
                color: Theme.palette.primary.main,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <Typography sx={{ color: Theme.palette.primary.main, fontSize: '1rem', mb: '1rem' }}>
          Importing to location:{' '}
          <b>
            root/{item.id}
            {item.id !== '' && '/'}
          </b>
          ...
        </Typography>
        <Box>
          <Button
            component='label'
            variant='outlined'
            startIcon={<UploadFileIcon />}
            sx={{ width: '100%', marginRight: '1rem' }}
          >
            Select a file...
            <input type='file' accept='.csv, .txt' hidden onChange={handleFileChange} />
          </Button>
          <Typography style={{ fontSize: '1rem', marginTop: '0.5rem', wordWrap: 'break-word' }}>
            {filename !== '' && (
              <>
                Selected file: "<b>{filename}</b>"
              </>
            )}
          </Typography>
        </Box>
        {!isIncorrectFileType && newInfoFileName !== '' && (
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.error.main, mt: '1rem' }}>
            File will be saved as: "<b>{newInfoFileName}</b>".
          </Typography>
        )}
        {isIncorrectFileType && (
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.error.main, mt: '1rem' }}>
            <b>Incorrect file extension!</b>
            <br /> Accepted file extensions: '<b>.csv</b>', '<b>.txt</b>'
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Typography sx={{ fontSize: '1rem', color: Theme.palette.text.secondary }}>Cancel</Typography>
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={filename === '' || isIncorrectFileType}
          variant='outlined'
          sx={{
            borderColor: Theme.palette.primary.main,
            ':hover': { borderColor: Theme.palette.primary.main, bgcolor: Theme.palette.secondary.main },
            '& .MuiTouchRipple-root': {
              color: Theme.palette.primary.main,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '1rem',
              color: isIncorrectFileType || filename === '' ? Theme.palette.text.secondary : Theme.palette.primary.main,
            }}
          >
            Import
          </Typography>
        </Button>
      </DialogActions>
    </FileTreeItemContextMenuStyledDialog>
  );
};
