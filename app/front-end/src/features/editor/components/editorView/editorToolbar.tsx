import { socket } from '@/lib';
import { Colors } from '@/types';
import { Done as DoneIcon, Error as ErrorIcon } from '@mui/icons-material';
import { Box, Button, CircularProgress, useTheme } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarProps,
  ToolbarPropsOverrides,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

interface EditorToolbarProps extends GridToolbarProps, ToolbarPropsOverrides {
  disabled?: boolean;
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
export const EditorToolbar: React.FC<EditorToolbarProps> = ({ disabled, handleSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(true);

  const Theme = useTheme();

  useEffect(() => {
    socket.on('workspace_file_update_status', (data) => {
      setIsSaving(false);
      setSaveStatus(data.status === 'success');
    });

    return () => {
      socket.off('workspace_file_update_status');
    };
  });

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Box sx={{ flexGrow: 1 }} />
      <Button
        onClick={() => {
          setIsSaving(true);
          handleSave();
        }}
        disabled={disabled}
        startIcon={
          isSaving ? (
            <CircularProgress size={16} sx={{ color: Colors.backgroundPrimaryLight }} />
          ) : saveStatus ? (
            <DoneIcon sx={{ color: Theme.palette.success.main }} />
          ) : (
            <ErrorIcon sx={{ color: Theme.palette.error.main }} />
          )
        }
        size='small'
        variant='contained'
      >
        Save
      </Button>
    </GridToolbarContainer>
  );
};
