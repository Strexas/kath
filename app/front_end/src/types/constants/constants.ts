/**
 * API_URL is the base URL for API requests, loaded from environment variables.
 *
 * @description This constant provides the base URL used for making HTTP requests to the API. It is loaded from the environment
 * variable `VITE_API_URL`, which should be set in the environment configuration file. The `API_URL` is used to construct full
 * URLs for API requests throughout the application.
 *
 * @constant {string} API_URL - The base URL for API requests.
 *
 * @example
 * // Example usage of API_URL
 * const endpoint = `${API_URL}/endpoint`;
 */
export const API_URL = import.meta.env.VITE_API_URL;

/**
 * SOCKET_URL is the URL for connecting to the WebSocket server, loaded from environment variables.
 *
 * @description This constant provides the URL used for establishing a WebSocket connection. It is loaded from the environment
 * variable `VITE_SOCKET_URL`, which should be set in the environment configuration file. The `SOCKET_URL` is used to initialize
 * the WebSocket client for real-time communication.
 *
 * @constant {string} SOCKET_URL - The URL for connecting to the WebSocket server.
 *
 * @example
 * // Example usage of SOCKET_URL
 * const socket = io(SOCKET_URL);
 */
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
