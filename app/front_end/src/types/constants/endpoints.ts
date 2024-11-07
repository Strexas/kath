/**
 * `Endpoints` object defines the base URL paths for various API endpoints used in the application.
 *
 * @description This object contains string constants representing the relative paths for different API endpoints. These paths
 * are used to construct full URLs for making HTTP requests. The `Endpoints` object centralizes endpoint definitions, making it
 * easier to manage and update API paths across the application.
 *
 * The object includes:
 * - `EXAMPLE`: The endpoint path for example data.
 * - `WORKSPACE`: The endpoint path for workspace-related requests.
 * - `WORKSPACE_FILE`: The endpoint path for file operations within the workspace.
 * - `WORKSPACE_CREATE`: The endpoint path for creating new workspace items.
 * - `WORKSPACE_RENAME`: The endpoint path for renaming workspace items.
 * - `WORKSPACE_DELETE`: The endpoint path for deleting workspace items.
 *
 * @constant {Object} Endpoints - The object containing API endpoint paths.
 * @property {string} EXAMPLE - The endpoint path for example data.
 * @property {string} WORKSPACE - The endpoint path for workspace-related data.
 * @property {string} WORKSPACE_FILE - The endpoint path for file operations within the workspace.
 * @property {string} WORKSPACE_CREATE - The endpoint path for creating new items in the workspace.
 * @property {string} WORKSPACE_RENAME - The endpoint path for renaming items in the workspace.
 * @property {string} WORKSPACE_DELETE - The endpoint path for deleting items in the workspace.
 * @property {string} WORKSPACE_AGGREGATE - The endpoint path for aggregating workspace items.
 * @property {string} WORKSPACE_IMPORT - The endpoint path for importing workspace items.
 * @property {string} WORKSPACE_EXPORT - The endpoint path for exporting workspace items.
 * @property {string} WORKSPACE_DOWNLOAD - The endpoint path for downloading workspace items.
 * @property {string} WORKSPACE_MERGE - The endpoint path for merging workspace items.
 * @property {string} WORKSPACE_APPLY - The endpoint path for applying workspace items.
 * @property {string} WORKSPACE_ALIGN - The endpoint path for aligning workspace items.
 *
 * @example
 * // Example usage of the Endpoints object
 * const exampleUrl = `${API_URL}${Endpoints.EXAMPLE}`;
 * const workspaceUrl = `${API_URL}${Endpoints.WORKSPACE}`;
 * const fileUrl = `${API_URL}${Endpoints.WORKSPACE_FILE}`;
 * const createUrl = `${API_URL}${Endpoints.WORKSPACE_CREATE}`;
 * const renameUrl = `${API_URL}${Endpoints.WORKSPACE_RENAME}`;
 * const deleteUrl = `${API_URL}${Endpoints.WORKSPACE_DELETE}`;
 */
export const Endpoints = {
  EXAMPLE: `/example`,
  WORKSPACE: `/workspace`,
  WORKSPACE_FILE: `/workspace/file`,
  WORKSPACE_CREATE: `/workspace/create`,
  WORKSPACE_RENAME: `/workspace/rename`,
  WORKSPACE_DELETE: `/workspace/delete`,
  WORKSPACE_AGGREGATE: `/workspace/aggregate`,
  WORKSPACE_IMPORT: `/workspace/import`,
  WORKSPACE_EXPORT: `/workspace/export`,
  WORKSPACE_DOWNLOAD: `/workspace/download`,
  WORKSPACE_MERGE: `/workspace/merge`,
  WORKSPACE_APPLY: `/workspace/apply`,
  WORKSPACE_ALIGN: `/workspace/align`,
};
