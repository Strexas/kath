import React, { createContext, useEffect, useMemo, useState } from 'react';
import { PaletteMode, ThemeProvider, createTheme } from '@mui/material';
import { COLOR } from '../../types/enum';

interface ThemeContextProps {
	mode: string;
	update: () => void;
	values: string[];
}

export const ThemeContext = createContext<ThemeContextProps>({
	mode: 'dark',
	update: () => {},
	values: [],
});

interface Props {
	children?: React.ReactNode;
}

export const ThemeContextProvider: React.FC<Props> = ({ children }) => {
	const [mode, setMode] = useState<string>(localStorage.getItem('color-mode') || 'dark');

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
						main: mode === 'dark' ? COLOR.background_default_dark : COLOR.background_default_light,
					},
					text: {
						primary: mode === 'dark' ? COLOR.text_primary_dark : COLOR.text_primary_light,
						secondary: COLOR.text_secondary,
					},
					background: {
						default: mode === 'dark' ? COLOR.background_default_dark : COLOR.background_default_light,
						paper: mode === 'dark' ? COLOR.background_paper_dark : COLOR.background_paper_light,
					},
					action: {
						hover: mode === 'dark' ? COLOR.action_hover_dark : COLOR.action_hover_light,
					},
				},
				components: {
					MuiButton: {
						styleOverrides: {
							root: {
								':hover': {
									backgroundColor: mode === 'dark' ? COLOR.action_hover_dark : COLOR.action_hover_light,
								},
							},
						},
					},
					MuiIconButton: {
						styleOverrides: {
							root: {
								width: '50px',
								height: '50px',
							},
						},
					},
					MuiSvgIcon: {
						styleOverrides: {
							root: {
								width: '40px',
								height: '40px',
							},
						},
					},
					MuiTypography: {
						styleOverrides: {
							root: {
								fontFamily: 'Poppins',
								fontSize: '20px',
								color: mode === 'dark' ? COLOR.text_primary_dark : COLOR.text_primary_light,
								fontWeight: '400',
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
