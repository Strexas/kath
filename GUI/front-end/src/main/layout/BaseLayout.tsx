import { Box, Container, Drawer, IconButton, useTheme } from '@mui/material';
import { useThemeContext, useLanguageContext } from '../../contexts';
import {
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	Public as PublicIcon,
	Tune as TuneIcon,
} from '@mui/icons-material';
import React from 'react';
import { SettingsDisplay } from '../../components/displays';
import { KathLogo } from '../../components/svgs';

interface Props {
	children?: React.ReactNode;
}

const BaseLayout: React.FC<Props> = (props) => {
	const [isTuneOpen, setIsTuneOpen] = React.useState(false);

	const Theme = useTheme();

	const themeContext = useThemeContext();
	const languageContext = useLanguageContext();

	const handleLogoClick = () => {}; // TODO route to home page

	return (
		<Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'row'}>
			<Box
				width={'75px'}
				display={'flex'}
				flexDirection={'column'}
				alignItems={'center'}
				sx={{
					backgroundColor: Theme.palette.background.paper,
					borderRight: `5px solid ${Theme.palette.background.default}`,
				}}
			>
				<IconButton
					onClick={handleLogoClick}
					sx={{
						marginTop: '10px',
						':hover': {
							backgroundColor: Theme.palette.action.hover,
						},
					}}
				>
					<KathLogo color={Theme.palette.text.primary} />
				</IconButton>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column-reverse',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<IconButton
						onClick={() => setIsTuneOpen(!isTuneOpen)}
						sx={{
							marginBottom: '30px',
							backgroundColor: isTuneOpen ? Theme.palette.action.hover : 'transparent',
							':hover': {
								backgroundColor: Theme.palette.action.hover,
							},
						}}
					>
						<TuneIcon sx={{ color: Theme.palette.text.primary }} />
					</IconButton>
					<IconButton
						onClick={themeContext.update}
						sx={{
							marginBottom: '20px',
							':hover': {
								backgroundColor: Theme.palette.action.hover,
							},
						}}
					>
						{Theme.palette.mode === 'dark' ? (
							<LightModeIcon
								sx={{
									color: Theme.palette.text.secondary,
								}}
							/>
						) : (
							<DarkModeIcon
								sx={{
									color: Theme.palette.text.secondary,
								}}
							/>
						)}
					</IconButton>
					<IconButton
						onClick={languageContext.update}
						sx={{
							marginBottom: '20px',
							':hover': {
								backgroundColor: Theme.palette.action.hover,
							},
						}}
					>
						<PublicIcon sx={{ color: Theme.palette.text.secondary }} />
					</IconButton>
				</Container>
			</Box>
			<Box
				flexGrow={1}
				width='100%'
				height={'100%'}
				sx={{
					backgroundColor: Theme.palette.background.default,
				}}
			>
				{props.children}
				<Drawer
					variant='persistent'
					anchor='bottom'
					open={isTuneOpen}
					onClose={() => setIsTuneOpen(!isTuneOpen)}
					PaperProps={{
						sx: {
							width: 'calc(100% - 80px)',
							height: '100%',
							border: 'none',
							left: '80px',
							backgroundColor: Theme.palette.background.default,
						},
					}}
				>
					<SettingsDisplay onClose={() => setIsTuneOpen(!isTuneOpen)} />
				</Drawer>
			</Box>
		</Box>
	);
};

export default BaseLayout;
