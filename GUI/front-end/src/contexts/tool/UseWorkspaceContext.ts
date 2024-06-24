import { useContext } from "react";
import { WorkspaceContext } from "./WorkspaceContextProvider";

export const useWorkspaceContext = () => useContext(WorkspaceContext);