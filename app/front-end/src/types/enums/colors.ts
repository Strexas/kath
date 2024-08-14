/**
 * Enum representing color values for different themes and states.
 * 
 * This enum contains color definitions for both light mode and dark mode,
 * as well as global colors for various states like error, success, warning, and info.
 */
export enum Colors {
    // Light mode
    primaryLight = '#4C7380',
    secondaryLight = '#D8E4E8',
    
    textPrimaryLight = '#404040',
    textSecondaryLight = '#999999',
    
    backgroundPrimaryLight = '#F9FBFB',
    backgroundSecondaryLight = '#EDEDED',
    backgroundActiveLight = '#CDCDCD',

    // Dark mode
    primaryDark = '#203238',
    secondaryDark = '#212829',
    
    textPrimaryDark = '#F6F6F6',
    textSecondaryDark = '#B9B9B9',
    
    backgroundPrimaryDark = '#252525',
    backgroundSecondaryDark = '#222222',
    backgroundActiveDark = '#353535',

    // Global
    error = '#FF6961',
    success = '#77DD77',
    warning = '#FFB347',
    info = '#FDFD96',
}