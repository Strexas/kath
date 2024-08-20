import { Console, EditorView, Filebar, FileTreeView, ToolbarView } from '@/features/editor/components';
import { WorkspaceContextProvider } from '@/features/editor/stores';
import { Box, useTheme } from '@mui/material';

/**
 * Editor component sets up the main layout for the editor application, integrating various UI components within a responsive
 * flexbox layout.
 *
 * @description This component uses Material-UI's `Box` component to create a flexible layout for the editor interface. It
 * integrates multiple sub-components, including `FileTreeView`, `Toolbar`, `EditorView`, `Filebar`, and `Console`, each
 * occupying a specific region of the layout. The component also provides a context for workspace management using
 * `WorkspaceContextProvider`.
 *
 * The layout is structured as follows:
 * - A sidebar on the left (`20%` width) containing the `FileTreeView` component.
 * - A main content area on the right (`80%` width) that includes:
 *   - A `ToolbarView` at the top (`15%` height).
 *   - An `EditorView` below the toolbar (`60%` height).
 *   - A `Filebar` at the bottom (`5%` height).
 *   - A `Console` component at the bottom (`20%` height) with rounded bottom corners.
 *
 * The layout is styled using the current theme's colors and responsive design principles.
 *
 * @component
 *
 * @example
 * // Example usage of the Editor component
 * return (
 *   <Editor />
 * );
 *
 * @returns {JSX.Element} The rendered editor layout with integrated components and workspace context.
 */
export const Editor = () => {
  const Theme = useTheme();

  return (
    <WorkspaceContextProvider>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Box
          sx={{
            width: '20%',
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: Theme.palette.secondary.main,
            borderRadius: '0.625rem 0 0 0.625rem',
            margin: '1rem',
          }}
        >
          <FileTreeView />
        </Box>
        <Box sx={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              width: '100%',
              height: '15%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: Theme.palette.action.selected,
              borderRadius: '0 0.625rem 0 0',
            }}
          >
            <ToolbarView />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '60%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: Theme.palette.background.default,
            }}
          >
            <EditorView />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '5%',
              display: 'flex',
              flexDirection: 'row',
              bgcolor: Theme.palette.action.selected,
            }}
          >
            <Filebar />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '20%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: Theme.palette.background.paper,
              borderRadius: '0 0 0.625rem 0',
            }}
          >
            <Console />
          </Box>
        </Box>
      </Box>
    </WorkspaceContextProvider>
  );
};
