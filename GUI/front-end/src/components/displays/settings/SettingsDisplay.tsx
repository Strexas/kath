import { Grid, IconButton, Typography, useTheme } from '@mui/material';
import {
	Close as CloseIcon,
	Logout as LogoutIcon,
	PsychologyAlt as PsychologyAltIcon,
	DarkModeOutlined as DarkModeOutlinedIcon,
	LightModeOutlined as LightModeOutlinedIcon,
	Language as LanguageIcon,
	FolderDeleteOutlined as FolderDeleteOutlinedIcon,
} from '@mui/icons-material';
import React from 'react';
import SettingsInstance from './SettingsInstance';
import SettingsGroup from './SettingsGroup';
import { COLOR } from '../../../types/enum';
import { useApplicationContext, useLanguageContext, useThemeContext } from '../../../contexts';

interface Props {
	onClose: () => void;
}

export const SettingsDisplay: React.FC<Props> = (props) => {
	const Theme = useTheme();

	const themeContext = useThemeContext();
	const languageContext = useLanguageContext();
	const applicationContext = useApplicationContext();

	const handleOnClickLogOut = () => {}; // TODO: implement

	const handleOnChangeNameOfApplication = (newName?: string) => {
		applicationContext.update(newName || '');
	};

	const handleOnClickDeleteAllChats = () => {}; // TODO: implement

	const AccountInstances = [
		<SettingsInstance
			icon={<LogoutIcon sx={{ color: Theme.palette.text.primary, width: '60px', height: '60px' }} />}
			title={languageContext.language === 'en' ? 'Authentication' : 'Autentifikacija'}
			description={
				languageContext.language === 'en'
					? 'Ability to log out of personal account.'
					: 'Galimybė atsijungti nuo asmeninės paskyros.'
			}
			variant={'button'}
			values={languageContext.language === 'en' ? ['Log out'] : ['Atsijungti']}
			onClick={handleOnClickLogOut}
		/>,
	];

	const GeneralInstances = [
		<SettingsInstance
			icon={<PsychologyAltIcon sx={{ color: Theme.palette.text.primary, width: '60px', height: '60px' }} />}
			title={languageContext.language === 'en' ? 'Name of application' : 'Programos pavadinimas'}
			description={
				languageContext.language === 'en'
					? 'This is the name of AI. You have the ability to rename it.'
					: 'Tai yra AI pavadinimas. Jūs galite pervadinti.'
			}
			variant={'input'}
			values={[applicationContext.name]}
			onChange={handleOnChangeNameOfApplication}
		/>,
		<SettingsInstance
			icon={
				Theme.palette.mode === 'dark' ? (
					<DarkModeOutlinedIcon sx={{ color: Theme.palette.text.primary, width: '60px', height: '60px' }} />
				) : (
					<LightModeOutlinedIcon sx={{ color: Theme.palette.text.primary, width: '60px', height: '60px' }} />
				)
			}
			title={languageContext.language === 'en' ? 'Theme' : 'Stilius'}
			description={languageContext.language === 'en' ? 'Select GUI style.' : 'Pasirinkite GUI stilių.'}
			variant={'dropdown'}
			values={[themeContext.mode, ...themeContext.values.filter((value) => !value.includes(themeContext.mode))]}
			onChange={() => themeContext.update()}
		/>,
		<SettingsInstance
			icon={<LanguageIcon sx={{ color: Theme.palette.text.primary, width: '60px', height: '60px' }} />}
			title={languageContext.language === 'en' ? 'Language' : 'Kalba'}
			description={languageContext.language === 'en' ? 'Select GUI language.' : 'Pasirinkite GUI kalbą.'}
			variant={'dropdown'}
			values={[
				languageContext.language,
				...languageContext.values.filter((value) => !value.includes(languageContext.language)),
			]}
			onChange={() => languageContext.update()}
		/>,
		<SettingsInstance
			icon={<FolderDeleteOutlinedIcon sx={{ color: Theme.palette.text.primary, width: '60px', height: '60px' }} />}
			title={languageContext.language === 'en' ? 'Delete all chats' : 'Ištrinti visus pokalbius'}
			description={
				languageContext.language === 'en' ? 'Ability to delete chat history.' : 'Galimybė ištrinti pokalbių istoriją.'
			}
			variant={'button'}
			values={languageContext.language === 'en' ? ['Delete all'] : ['Ištrinti']}
			buttonColor={COLOR.red}
			onClick={handleOnClickDeleteAllChats}
		/>,
	];

	return (
		<React.Fragment>
			<Grid container display={'flex'} flexDirection={'column'}>
				<Grid
					container
					display={'flex'}
					flexDirection={'row'}
					height={'80px'}
					alignItems={'center'}
					sx={{
						backgroundColor: Theme.palette.background.paper,
					}}
				>
					<Grid item xs={6} px={'20px'}>
						<Typography style={{ color: Theme.palette.text.secondary, fontSize: '25px' }}>
							{languageContext.language === 'en' ? 'Settings' : 'Nustatymai'}
						</Typography>
					</Grid>
					<Grid item xs={6} px={'10px'} textAlign={'right'}>
						<IconButton onClick={props.onClose}>
							<CloseIcon
								sx={{
									color: Theme.palette.text.primary,
								}}
							/>
						</IconButton>
					</Grid>
				</Grid>
				<Grid item>
					<SettingsGroup
						title={languageContext.language === 'en' ? 'Account' : 'Paskyra'}
						instances={AccountInstances}
					/>
					<SettingsGroup
						title={languageContext.language === 'en' ? 'General' : 'Bendra'}
						instances={GeneralInstances}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
};
