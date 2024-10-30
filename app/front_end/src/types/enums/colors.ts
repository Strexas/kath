/**
 * Colors enumeration defines the color palette used in the application for different themes and states.
 *
 * @description This enum provides a set of constants representing color values used for various elements in the application,
 * including light and dark modes as well as global status indicators. Each constant is mapped to a specific color value, helping
 * ensure consistency in styling and theming throughout the application.
 *
 * The enum includes:
 *
 * **Light Mode Colors:**
 * - `primaryLight`: Primary color for light mode, typically used for main UI elements.
 * - `secondaryLight`: Secondary color for light mode, used for supporting elements.
 * - `textPrimaryLight`: Primary text color for light mode.
 * - `textSecondaryLight`: Secondary text color for light mode.
 * - `backgroundPrimaryLight`: Primary background color for light mode.
 * - `backgroundSecondaryLight`: Secondary background color for light mode.
 * - `backgroundActiveLight`: Background color for active states in light mode.
 *
 * **Dark Mode Colors:**
 * - `primaryDark`: Primary color for dark mode, typically used for main UI elements.
 * - `secondaryDark`: Secondary color for dark mode, used for supporting elements.
 * - `textPrimaryDark`: Primary text color for dark mode.
 * - `textSecondaryDark`: Secondary text color for dark mode.
 * - `backgroundPrimaryDark`: Primary background color for dark mode.
 * - `backgroundSecondaryDark`: Secondary background color for dark mode.
 * - `backgroundActiveDark`: Background color for active states in dark mode.
 *
 * **Global Colors:**
 * - `error`: Color used to indicate error states or messages.
 * - `success`: Color used to indicate success states or messages.
 * - `warning`: Color used to indicate warning states or messages.
 * - `info`: Color used to indicate informational messages.
 *
 * @enum {string}
 * @property {string} primaryLight - The primary color used in light mode.
 * @property {string} secondaryLight - The secondary color used in light mode.
 * @property {string} textPrimaryLight - The primary text color used in light mode.
 * @property {string} textSecondaryLight - The secondary text color used in light mode.
 * @property {string} backgroundPrimaryLight - The primary background color used in light mode.
 * @property {string} backgroundSecondaryLight - The secondary background color used in light mode.
 * @property {string} backgroundActiveLight - The background color for active states in light mode.
 * @property {string} primaryDark - The primary color used in dark mode.
 * @property {string} secondaryDark - The secondary color used in dark mode.
 * @property {string} textPrimaryDark - The primary text color used in dark mode.
 * @property {string} textSecondaryDark - The secondary text color used in dark mode.
 * @property {string} backgroundPrimaryDark - The primary background color used in dark mode.
 * @property {string} backgroundSecondaryDark - The secondary background color used in dark mode.
 * @property {string} backgroundActiveDark - The background color for active states in dark mode.
 * @property {string} error - The color used to indicate error states or messages.
 * @property {string} success - The color used to indicate success states or messages.
 * @property {string} warning - The color used to indicate warning states or messages.
 * @property {string} info - The color used to indicate informational messages.
 *
 * @example
 * // Example usage of Colors
 * import { Colors } from './path/to/colors';
 *
 * const headerStyle = {
 *   backgroundColor: Colors.primaryLight,
 *   color: Colors.textPrimaryLight,
 * };
 *
 * const errorMessageStyle = {
 *   color: Colors.error,
 * };
 */

/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
// Some values are duplicated for now, this way we can keep values organized and future-proof

export enum Colors {
  // Light mode
  mainNavigationBackgroundLight = '#4C7380',
  primaryLight = '#336e82',
  secondaryLight = '#D8E4E8',

  textPrimaryLight = '#404040',
  textSecondaryLight = '#525252',

  backgroundPrimaryLight = '#F9FBFB',
  backgroundSecondaryLight = '#EDEDED',
  backgroundActiveLight = '#CDCDCD',

  contrastTextLight = '#F9FBFB',

  // Dark mode
  mainNavigationBackgroundDark = '#1C2427',
  primaryDark = '#6AA1AD',
  secondaryDark = '#222C30',

  textPrimaryDark = '#F6F6F6',
  textSecondaryDark = '#B9B9B9',

  backgroundPrimaryDark = '#292929',
  backgroundSecondaryDark = '#252525',
  backgroundActiveDark = '#333333',

  contrastTextDark = '#F9FBFB',

  // Global
  error = '#FF6961',
  success = '#77DD77',
  warning = '#FFB347',
  info = '#FDFD96',
}
