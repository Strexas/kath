import { ENDPOINTS } from "../../types/constants";
import httpClient from "../httpClient";

export async function createWorkspace(workspace: string) {
    return await httpClient
        .post(ENDPOINTS.WORKSPACE.CREATE_WORKSPACE, workspace)
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
    });
}

export async function getWorkspaces() {
    return await httpClient
        .get(ENDPOINTS.WORKSPACE.GET_WORKSPACES)
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
    });
}

export async function getWorkspaceFiles({ queryKey } : { queryKey: [string, string] }) {
    const [, workspace] = queryKey;
    return await httpClient
        .get(ENDPOINTS.WORKSPACE.GET_WORKSPACE_FILES(workspace))
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
    });
}

export async function deleteWorkspace(workspace: string) {
    return await httpClient
        .delete(ENDPOINTS.WORKSPACE.DELETE_WORKSPACE(workspace))
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
    });
}