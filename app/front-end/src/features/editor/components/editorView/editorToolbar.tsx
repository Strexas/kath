import { useStatusContext } from '@/hooks';
import { socket } from '@/lib';
import { Events } from '@/types';
import { Done as DoneIcon, Error as ErrorIcon } from '@mui/icons-material';
import { alpha, Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarProps,
  ToolbarPropsOverrides,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

interface EditorToolbarProps extends GridToolbarProps, ToolbarPropsOverrides {
  handleSave: () => void;
}

/**
 * EditorToolbar component provides a custom toolbar for the DataGrid with save functionality and status indicators.
 *
 * @description This component integrates with the `DataGrid` toolbar to offer additional features such as column visibility,
 * filtering, density selection, and exporting. It also includes a custom "Save" button with visual feedback for save status.
 * The save button displays a spinner during save operations and shows success or error icons based on the result. The component
 * listens to the `workspace_file_update_status` event from a socket connection to update the save status.
 *
 * The toolbar uses Material-UI components for styling and layout, including `GridToolbarContainer` for organizing the buttons,
 * and `Box` for layout adjustments. It supports a `disabled` prop to control the button's disabled state and a `handleSave` function
 * prop that is triggered when the "Save" button is clicked.
 *
 * @component
 *
 * @example
 * // Example usage of the EditorToolbar component
 * return (
 *   <EditorToolbar
 *     disabled={false}
 *     handleSave={() => {
 *       console.log('Save function triggered');
 *     }}
 *   />
 * );
 *
 * @param {Object} props - The props for the EditorToolbar component.
 * @param {boolean} [props.disabled] - Optional flag to disable the save button.
 * @param {function} props.handleSave - Function to be called when the "Save" button is clicked.
 *
 * @returns {JSX.Element} The rendered toolbar component with buttons for DataGrid actions and a save button with status feedback.
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({ handleSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(true);

  const Theme = useTheme();
  const { blocked, unsavedStateUpdate, unsaved } = useStatusContext();

  useEffect(() => {
    const handleWorkspaceFileSaveFeedback = (data: { status: 'success' | 'error' }) => {
      setIsSaving(false);
      setSaveStatus(data.status === 'success');
    };
    socket.on(Events.WORKSPACE_FILE_SAVE_FEEDBACK_EVENT, handleWorkspaceFileSaveFeedback);

    return () => {
      socket.off(Events.WORKSPACE_FILE_SAVE_FEEDBACK_EVENT);
    };
  }, []);

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      {/* <GridToolbarFilterButton /> */}
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport /> */}
      <Box sx={{ flexGrow: 1 }} />
      {unsaved && (
        <Typography sx={{ fontSize: '0.9rem', color: alpha(Theme.palette.text.primary, 0.5), pr: '0.5rem' }}>
          Changes not saved
        </Typography>
      )}

      <Button
        onClick={() => {
          setIsSaving(true);
          handleSave();
          unsavedStateUpdate(false);
        }}
        disabled={blocked}
        startIcon={
          isSaving ? (
            <CircularProgress size={16} sx={{ color: Theme.palette.primary.main }} />
          ) : saveStatus ? (
            <DoneIcon sx={{ color: Theme.palette.primary.main }} />
          ) : (
            <ErrorIcon sx={{ color: Theme.palette.error.main }} />
          )
        }
        size='small'
        variant='outlined'
        sx={{
          color: saveStatus === false ? Theme.palette.error.main : Theme.palette.primary.main,
          borderColor: saveStatus === false ? Theme.palette.error.main : Theme.palette.primary.main,
          '&:hover': {
            borderColor: saveStatus === false ? Theme.palette.error.dark : Theme.palette.primary.dark,
          },
        }}
      >
        Save
      </Button>
    </GridToolbarContainer>
  );
};
