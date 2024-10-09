import { Colors } from '@/types';
import { PaletteMode, ThemeProvider, createTheme } from '@mui/material';
import React, { createContext, useEffect, useMemo, useState } from 'react';

export interface ThemeContextProps {
  mode: string;
  update: () => void;
  values: string[];
}

export const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  update: () => {},
  values: ['light', 'dark'],
});

interface Props {
  children?: React.ReactNode;
}

/**
 * Provider component for managing and applying theme context to the application.
 *
 * @component
 *
 * @description The `ThemeContextProvider` component manages the application's theme mode, providing
 * functionality to switch between light and dark modes. It stores the selected mode in localStorage
 * and applies the corresponding theme using Material-UI's `ThemeProvider`. The component initializes
 * the theme based on the user's system preference if no theme is set in localStorage.
 *
 * @param {Props} props - Component props.
 * @param {React.ReactNode} [props.children] - The child components to be rendered within the `ThemeProvider`.
 *
 * @returns {JSX.Element} The `ThemeContextProvider` component, which wraps its children with the `ThemeProvider`
 * and provides theme context through `ThemeContext`.
 */
export const ThemeContextProvider: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<string>(localStorage.getItem('color-mode') || 'light');

  const update = () => {
    if (localStorage.getItem('color-mode') === 'light') {
      localStorage.setItem('color-mode', 'dark');
    } else {
      localStorage.setItem('color-mode', 'light');
    }
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (!localStorage.getItem('color-mode')) {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)');
      const systemMode = isSystemDark.matches ? 'dark' : 'light';
      localStorage.setItem('color-mode', systemMode);
      setMode(systemMode);
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as PaletteMode,
          primary: {
            main: mode === 'light' ? Colors.primaryLight : Colors.primaryDark,
            contrastText: mode === 'light' ? Colors.contrastTextLight : Colors.contrastTextDark,
          },
          secondary: {
            main: mode === 'light' ? Colors.secondaryLight : Colors.secondaryDark,
          },
          text: {
            primary: mode === 'light' ? Colors.textPrimaryLight : Colors.textPrimaryDark,
            secondary: mode === 'light' ? Colors.textSecondaryLight : Colors.textSecondaryDark,
          },
          background: {
            default: mode === 'light' ? Colors.backgroundPrimaryLight : Colors.backgroundPrimaryDark,
            paper: mode === 'light' ? Colors.backgroundSecondaryLight : Colors.backgroundSecondaryDark,
          },
          action: {
            selected: mode === 'light' ? Colors.backgroundActiveLight : Colors.backgroundActiveDark,
          },
          error: {
            main: Colors.error,
          },
          success: {
            main: Colors.success,
          },
          warning: {
            main: Colors.warning,
          },
          info: {
            main: Colors.info,
          },
        },
        components: {
          MuiTypography: {
            styleOverrides: {
              root: {
                fontFamily: 'Nunito',
                fontSize: '1rem',
                color: mode === 'light' ? Colors.textPrimaryLight : Colors.textPrimaryDark,
                fontWeight: '400',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                fontFamily: 'Nunito',
                borderRadius: '1rem',
                color: mode === 'light' ? Colors.textPrimaryLight : Colors.textPrimaryDark,
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'light' ? Colors.textSecondaryLight : Colors.textSecondaryDark,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'light' ? Colors.primaryLight : Colors.primaryDark,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'light' ? Colors.primaryLight : Colors.primaryDark,
                },
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                borderRadius: '1rem',
              },
              list: {
                backgroundColor: mode === 'light' ? Colors.backgroundPrimaryLight : Colors.backgroundPrimaryDark,
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                fontFamily: 'Nunito',
                fontSize: '0.9rem',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                fontFamily: 'Nunito',
                textTransform: 'none',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                // Primarily used by csv editor's menus
                borderRadius: '1rem',
              },
              root: {
                // Primarily used by csv editor's menus
                backgroundColor:
                  (mode === 'light' ? Colors.backgroundPrimaryLight : Colors.backgroundPrimaryDark) + '!important',
                backgroundImage: 'none',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: '1rem',
              },
            },
          },
        },
      }),
    [mode]
  );

  const ThemeContextValue: ThemeContextProps = {
    mode,
    update,
    values: ['light', 'dark'],
  };

  return (
    <ThemeContext.Provider value={ThemeContextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
