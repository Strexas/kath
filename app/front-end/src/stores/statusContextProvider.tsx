import { useSessionContext } from '@/hooks';
import React, { createContext, useEffect, useState } from 'react';

export interface StatusContextProps {
  blocked: boolean;
  blockedStateUpdate: (blocked: boolean) => void;
  unsaved: boolean;
  unsavedStateUpdate: (isUnsaved: boolean) => void;
}

export const StatusContext = createContext<StatusContextProps>({
  blocked: false,
  blockedStateUpdate: () => {},
  unsaved: false,
  unsavedStateUpdate: () => {},
});

interface Props {
  children?: React.ReactNode;
}

export const StatusContextProvider: React.FC<Props> = ({ children }) => {
  const [blocked, setBlocked] = useState<boolean>(false);

  const blockedStateUpdate = (blocked: boolean) => {
    setBlocked(blocked);
  };

  const [unsaved, setUnsaved] = useState<boolean>(false);

  const unsavedStateUpdate = (isUnsaved: boolean) => {
    setUnsaved(isUnsaved);
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
    unsaved,
    unsavedStateUpdate,
  };

  return <StatusContext.Provider value={StatusContextValue}>{children}</StatusContext.Provider>;
};
