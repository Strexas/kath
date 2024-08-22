/**
 * Endpoints object defines the base URL paths for various API endpoints used in the application.
 *
 * @description This object contains string constants representing the relative paths for different API endpoints. These paths
 * are used to construct full URLs for making HTTP requests. The `Endpoints` object centralizes endpoint definitions, making it
 * easier to manage and update API paths across the application.
 *
 * The object includes:
 * - `EXAMPLE`: The endpoint path for example requests.
 * - `WORKSPACE`: The endpoint path for workspace-related requests.
 *
 * @constant {Object} Endpoints - The object containing API endpoint paths.
 * @property {string} EXAMPLE - The endpoint path for example data.
 * @property {string} WORKSPACE - The endpoint path for workspace data.
 *
 * @example
 * // Example usage of the Endpoints object
 * const exampleUrl = `${API_URL}${Endpoints.EXAMPLE}`;
 * const workspaceUrl = `${API_URL}${Endpoints.WORKSPACE}`;
 */
/* eslint-disable quotes */
export const Endpoints = {
  EXAMPLE: `/example`,
  WORKSPACE: `/workspace`,
};
