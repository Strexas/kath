/**
 * Enum representing color values used throughout the application for both light and dark modes.
 *
 * @enum {string}
 *
 * @property {string} primaryLight - The primary color used in light mode (`#4C7380`).
 * @property {string} secondaryLight - The secondary color used in light mode (`#D8E4E8`).
 *
 * @property {string} textPrimaryLight - The primary text color used in light mode (`#404040`).
 * @property {string} textSecondaryLight - The secondary text color used in light mode (`#999999`).
 *
 * @property {string} backgroundPrimaryLight - The primary background color used in light mode (`#F9FBFB`).
 * @property {string} backgroundSecondaryLight - The secondary background color used in light mode (`#CDCDCD`).
 * @property {string} backgroundActiveLight - The active background color used in light mode (`#EDEDED`).
 *
 * @property {string} error - The color used for error messages (`#FF6961`).
 * @property {string} success - The color used for success messages (`#77DD77`).
 * @property {string} warning - The color used for warnings (`#FFB347`).
 * @property {string} info - The color used for informational messages (`#FDFD96`).
 *
 * @description This enum centralizes color definitions for light, dark modes and global states (error, success, warning, info).
 */
export enum Colors {
    // Light mode
    primaryLight = '#4C7380',
    secondaryLight = '#D8E4E8',
    
    textPrimaryLight = '#404040',
    textSecondaryLight = '#999999',
    
    backgroundPrimaryLight = '#F9FBFB',
    backgroundSecondaryLight = '#CDCDCD',
    backgroundActiveLight = '#EDEDED',

    // Dark mode
    primaryDark = '#203238',
    secondaryDark = '#212829',
    
    textPrimaryDark = '#F6F6F6',
    textSecondaryDark = '#B9B9B9',
    
    backgroundPrimaryDark = '#252525',
    backgroundSecondaryDark = '#353535',
    backgroundActiveDark = '#222222',

    // Global
    error = '#FF6961',
    success = '#77DD77',
    warning = '#FFB347',
    info = '#FDFD96',
}