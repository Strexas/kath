import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	Input,
	MenuItem,
	Select,
	Typography,
	styled,
	useTheme,
} from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useLanguageContext } from '../../../contexts';

interface Props {
	icon: React.ReactNode;
	title: string;
	description: string;
	variant: string;
	values: string[];
	onClick?: () => void;
	onChange?: (newValue?: string) => void;
	buttonColor?: string;
}

const SettingsInstance: React.FC<Props> = (props) => {
	const [currentValue, setCurrentValue] = React.useState(props.values[0]);
	const [error, setError] = useState<string>('');

	const Theme = useTheme();

	const languageContext = useLanguageContext();

	const handleOnChange = (value: string) => {
		const trimmedValue = value.trim();
		setCurrentValue(trimmedValue);
		if (trimmedValue.length === 0 || trimmedValue.length > 20) {
			setError(languageContext.language === 'en' ? 'Invalid input' : 'Negalima įvestis');
			return;
		}

		setError('');
		if (props.onChange) {
			props.onChange(trimmedValue);
		}
	};

	useEffect(() => {
		setCurrentValue(props.values[0]);
	}, [props.values]);

	return (
		<React.Fragment>
			<Box
				display={'flex'}
				flexDirection={'row'}
				alignItems={'center'}
				width={'calc(100% - 40px)'}
				height={'60px'}
				px={'20px'}
				py={'30px'}
				sx={{ backgroundColor: Theme.palette.background.paper }}
			>
				<Box>
					<IconButton disabled={true} sx={{ width: '70px', height: '70px' }}>
						{props.icon}
					</IconButton>
				</Box>
				<Box display={'flex'} flexDirection={'column'} flexGrow={1} sx={{ height: '70px', pl: '10px' }}>
					<Box height={'50%'} alignContent={'center'}>
						<Typography>{props.title}</Typography>
					</Box>
					<Box height={'50%'} alignContent={'center'}>
						<Typography style={{ color: Theme.palette.text.secondary }}>{props.description}</Typography>
					</Box>
				</Box>
				<Box display={'flex'} flexDirection={'row-reverse'} width={'300px'} height={'70px'} alignItems={'center'}>
					{props.variant === 'button' && (
						<Button
							sx={{
								backgroundColor: props.buttonColor ? props.buttonColor : Theme.palette.background.default,
								borderRadius: '15px',
								px: '15px',
							}}
							onClick={props.onClick}
						>
							<Typography
								style={{
									fontWeight: '600',
									textTransform: 'none',
									color: props.buttonColor ? 'white' : Theme.palette.text.primary,
								}}
							>
								{currentValue}
							</Typography>
						</Button>
					)}
					{props.variant === 'input' && (
						<FormControl>
							<Input
								sx={{
									backgroundColor: Theme.palette.background.default,
									borderRadius: '10px',
									px: '10px',
									height: '40px',
									minWidth: '250px',
								}}
								disableUnderline={true}
								value={currentValue}
								onChange={(e) => {
									handleOnChange(e.target.value);
								}}
							/>
							<FormHelperText error>{error}</FormHelperText>
						</FormControl>
					)}
					{props.variant === 'dropdown' && (
						<Select
							variant='standard'
							IconComponent={styled(ArrowDropDownIcon)({
								width: '24px',
								height: '24px',
							})}
							disableInjectingGlobalStyles={true}
							disableUnderline={true}
							sx={{
								backgroundColor: Theme.palette.background.default,
								borderRadius: '10px',
								height: '40px',
								minWidth: '150px',
								px: '10px',
							}}
							value={currentValue}
							onChange={(e) => {
								handleOnChange(e.target.value);
							}}
						>
							{props.values.map((value) => (
								<MenuItem key={value} value={value}>
									{value}
								</MenuItem>
							))}
						</Select>
					)}
				</Box>
			</Box>
		</React.Fragment>
	);
};

export default SettingsInstance;
