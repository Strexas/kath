import { useContext } from 'react';
import { ThemeContext } from './ThemeContextProvider';

export const useThemeContext = () => useContext(ThemeContext);
