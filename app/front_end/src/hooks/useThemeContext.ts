import { ThemeContext } from '@/stores';
import { useContext } from 'react';

/**
 * Custom hook for accessing the theme context in a React component.
 *
 * @hook
 *
 * @description This hook provides a convenient way to access the `ThemeContext` created by `ThemeContextProvider`.
 * It returns the current theme context value, which includes the current mode ('light' or 'dark'),
 * a function to toggle the theme mode, and the possible theme values.
 *
 * @returns {ThemeContextProps} The current theme context value, including:
 *   - `mode`: The current theme mode ('light' or 'dark').
 *   - `update`: A function to toggle between light and dark modes.
 *   - `values`: An array of possible theme modes ('light' and 'dark').
 *
 * @example
 * const { mode, update } = useThemeContext();
 * 
 * // Toggle theme mode
 * const handleToggle = () => {
 *   update();
 * };
 */
export const useThemeContext = () => useContext(ThemeContext);