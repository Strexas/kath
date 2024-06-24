
export const ENDPOINTS = {
    USERS: `/users`,
    PROFILES: `/profiles`,
    REQUEST: '/request',
    WORKSPACE : {
        CREATE_WORKSPACE: '/workspace',
        GET_WORKSPACES: '/workspace',
        GET_WORKSPACE_FILES: (workspace : string) => `/workspace/${workspace}`,
        DELETE_WORKSPACE: (workspace : string) => `/workspace/${workspace}`,
        UPLOAD_FILE: `/workspace/file/upload`,
        DELETE_FILE: `/workspace/file/delete`,
    }
};