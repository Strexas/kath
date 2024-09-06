import { useSessionContext } from '@/hooks';
import React, { createContext, useEffect, useState } from 'react';

export interface StatusContextProps {
  blocked: boolean;
  blockedStateUpdate: (blocked: boolean) => void;
}

export const StatusContext = createContext<StatusContextProps>({
  blocked: false,
  blockedStateUpdate: () => {},
});

interface Props {
  children?: React.ReactNode;
}

export const StatusContextProvider: React.FC<Props> = ({ children }) => {
  const [blocked, setBlocked] = useState<boolean>(false);

  const blockedStateUpdate = (blocked: boolean) => {
    setBlocked(blocked);
  };

  const { connected } = useSessionContext();

  useEffect(() => {
    if (!connected) {
      setBlocked(true);
      return;
    }

    setBlocked(false);
  }, [connected]);

  const StatusContextValue: StatusContextProps = {
    blocked,
    blockedStateUpdate,
  };

  return <StatusContext.Provider value={StatusContextValue}>{children}</StatusContext.Provider>;
};
