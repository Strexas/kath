import { axios, socket } from '@/lib';
import React, { createContext, useEffect, useState } from 'react';

export interface SessionContextProps {
  connected: boolean;
}

export const SessionContext = createContext<SessionContextProps>({
  connected: false,
});

interface Props {
  children?: React.ReactNode;
}

/**
 * SessionContextProvider component manages the session state and provides context for the session connection status.
 *
 * @description This component establishes a WebSocket connection using `socket` and manages the connection status
 * (connected or disconnected). It stores the session ID (SID) in `sessionStorage` and sets it in `axios` headers
 * for consistent session management across API requests. The connection status is shared with child components through
 * the `SessionContext`.
 *
 * The component listens for WebSocket 'connect' and 'disconnect' events to update the connection status and manage
 * the session ID accordingly. On component unmount, event listeners are cleaned up to prevent memory leaks.
 *
 * @component
 *
 * @example
 * // Example usage of the SessionContextProvider
 * return (
 *   <SessionContextProvider>
 *     <YourComponent />
 *   </SessionContextProvider>
 * );
 *
 * @param {React.ReactNode} children - The child components that will have access to the session context.
 *
 * @returns {JSX.Element} The provider component that wraps the children with session context.
 */
export const SessionContextProvider: React.FC<Props> = ({ children }) => {
  const [connected, setConnect] = useState<boolean>(false);

  useEffect(() => {
    const handleConnect = () => {
      const sid = socket.id || '';
      sessionStorage.setItem('sid', sid);
      setConnect(true);

      // Set the sid in the axios headers
      axios.defaults.headers.common['sid'] = sid;
    };

    const handleDisconnect = () => {
      sessionStorage.removeItem('sid');
      setConnect(false);

      delete axios.defaults.headers.common['sid'];
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const SessionContextValue: SessionContextProps = {
    connected,
  };

  return <SessionContext.Provider value={SessionContextValue}>{children}</SessionContext.Provider>;
};
