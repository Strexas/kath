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

    if(workspace === null) return Promise.resolve({ files: [] });

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

export async function uploadFile(data: FormData) {
    const originalContentType = httpClient.defaults.headers['Content-Type'];
    httpClient.defaults.headers['Content-Type'] = 'multipart/form-data';

    try {
        const response = await httpClient.post(ENDPOINTS.WORKSPACE.UPLOAD_FILE, data);
        return response.data;
    } catch (error) {
        console.error(error);
    } finally {
        httpClient.defaults.headers['Content-Type'] = originalContentType;
    }
}

export async function deleteFile(data: { workspace: string | null; file_name: string }) {
    return await httpClient
        .delete(ENDPOINTS.WORKSPACE.DELETE_FILE, { data })
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
    });
}