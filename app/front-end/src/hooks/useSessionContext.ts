import { SessionContext } from '@/stores';
import { useContext } from 'react';

/**
 * Custom hook to access the session context.
 *
 * @description This hook provides a simple way to access the `SessionContext`, which contains information about
 * the session's connection status. It uses the `useContext` hook from React to retrieve the context value.
 *
 * @returns {SessionContextProps} The current value of the `SessionContext`, including the connection status (`connected`).
 *
 * @example
 * // Example usage of useSessionContext hook
 * const { connected } = useSessionContext();
 * 
 * if (connected) {
 *   console.log("Connected to the session");
 * }
 */
export const useSessionContext = () => useContext(SessionContext);
