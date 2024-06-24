import React, { createContext, useState } from "react";

interface WorkspaceContextProps {
    workspace: string | null;
    update: (newWorkspace: string) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextProps>({
    workspace: null,
    update: () => {},
})

interface Props {
    children?: React.ReactNode;
}

export const WorkspaceContextProvider: React.FC<Props> = ({ children }) => {
    const [workspace, setWorkspace] = useState<string | null>(null);

    function updateWorkspace(newWorkspace: string) {
        setWorkspace(newWorkspace);
    }

    return (
        <WorkspaceContext.Provider value={{ workspace, update: updateWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    )
}