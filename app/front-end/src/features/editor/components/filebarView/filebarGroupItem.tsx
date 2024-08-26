import { useWorkspaceContext } from '@/features/editor/hooks';
import { FileTypes } from '@/types';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha, Box, IconButton, Typography, useTheme } from '@mui/material';

export interface FilebarGroupItemProps {
  fileId: string;
  fileLabel: string;
  fileType: FileTypes;
}

/**
 * `FilebarGroupItem` is a functional component that represents an individual item in the file bar group.
 *
 * @description This component displays the label of a file or folder within the file bar, allowing the user to select it and switch
 * to its corresponding workspace. It also includes a close button to remove the item from the workspace.
 *
 * @component
 *
 * @example
 * // Example usage of the FilebarGroupItem component
 * <FilebarGroupItem fileId="1" fileLabel="Document.txt" fileType={FileTypes.TXT} />
 *
 * @param {FilebarGroupItemProps} props - The props object for the FilebarGroupItem component.
 * @param {string} props.fileId - The unique identifier of the file or folder.
 * @param {string} props.fileLabel - The label (name) of the file or folder to be displayed.
 * @param {FileTypes} props.fileType - The type of the file (e.g., txt, csv, folder).
 *
 * @returns {JSX.Element} A `Box` component representing an item in the file bar with a clickable label and a close button.
 */
export const FilebarGroupItem: React.FC<FilebarGroupItemProps> = ({ fileId, fileLabel, fileType }) => {
  const Theme = useTheme();
  const Workspace = useWorkspaceContext();

  return (
    <Box
      id={fileId}
      sx={{
        height: '100%',
        pl: '1rem',
        pr: '0.5rem',
        bgcolor: Workspace.fileId === fileId ? Theme.palette.background.default : Theme.palette.action.selected,
        borderRadius: '0rem',
        ':hover': {
          backgroundColor:
            Workspace.fileId === fileId
              ? Theme.palette.background.default
              : alpha(Theme.palette.background.default, 0.5),
        },
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      onClick={() => {
        // Update the workspace to the selected file
        Workspace.update(fileId, fileLabel, fileType);
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 'bold',
          textTransform: 'none',
          maxWidth: '10rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {fileLabel}
      </Typography>
      <IconButton
        size='small'
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          // Remove the file from the workspace
          Workspace.remove(fileId);
        }}
      >
        <CloseIcon sx={{ fontSize: 12, color: Theme.palette.text.primary }} />
      </IconButton>
    </Box>
  );
};
