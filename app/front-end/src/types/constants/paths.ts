/**
 * Paths object defines the route paths used in the application.
 *
 * @description This object contains string constants representing the paths for various routes within the application. These paths
 * are used to configure routing and navigation, making it easier to manage and update route definitions consistently across the
 * application.
 *
 * The object includes:
 * - `HOME`: The path for the home page.
 * - `NOTFOUND`: The path for handling 404 errors or unknown routes.
 *
 * @constant {Object} Paths - The object containing route path constants.
 * @property {string} HOME - The path for the home page (root route).
 * @property {string} NOTFOUND - The path for handling 404 Not Found errors (wildcard route).
 *
 * @example
 * // Example usage of Paths
 * import { Paths } from './path/to/paths';
 *
 * // Configure routing
 * <Route path={Paths.HOME} component={HomePage} />
 * <Route path={Paths.NOTFOUND} component={NotFoundPage} />
 */
export const Paths = {
  HOME: '/',
  MACROS: '/macros',
  NOTFOUND: '*',
};
