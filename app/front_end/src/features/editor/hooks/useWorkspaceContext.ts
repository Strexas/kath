import { WorkspaceContext } from '@/features/editor/stores';
import { useContext } from 'react';

/**
 * useWorkspaceContext is a custom hook for accessing the workspace context.
 *
 * @description This hook provides a convenient way to access the `WorkspaceContext` within functional components. It utilizes
 * the `useContext` hook from React to retrieve the current context value, which includes information about the current workspace
 * file and a function to update it. The hook simplifies context consumption by abstracting the `useContext` call and directly
 * returning the context value.
 *
 * @example
 * // Example usage of the useWorkspaceContext hook
 * const { fileId, fileLabel, fileType, update } = useWorkspaceContext();
 *
 * @returns {WorkspaceContextProps} The current context value for the workspace, including `fileId`, `fileLabel`, `fileType`,
 * and the `update` function.
 */
export const useWorkspaceContext = () => useContext(WorkspaceContext);
