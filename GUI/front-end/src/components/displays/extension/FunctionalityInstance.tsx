import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material/';
import { Box, MenuItem, Select, Typography, styled, useTheme } from '@mui/material';
import { useLanguageContext, useToolContext } from '../../../contexts';
import React from 'react';

interface Props {}

const FunctionalityInstance: React.FC<Props> = () => {
	const Theme = useTheme();

	const languageContext = useLanguageContext();
	const toolContext = useToolContext();

	return (
		<Box display={'flex'} flexDirection={'column'} gap={'10px'} mx={'20px'} my={'40px'}>
			<Typography>{languageContext.language === 'en' ? 'Tool' : 'Įrankis'}</Typography>
			<Select
				variant='standard'
				IconComponent={styled(ArrowDropDownIcon)({
					width: '24px',
					height: '24px',
				})}
				disableInjectingGlobalStyles={true}
				disableUnderline={true}
				sx={{
					color: Theme.palette.text.secondary,
					backgroundColor: Theme.palette.background.default,
					borderRadius: '10px',
					height: '40px',
					px: '10px',
				}}
				value={toolContext.tool}
				onChange={(e) => toolContext.update(e.target.value)}
			>
				{toolContext.values.map((value) => (
					<MenuItem
						key={value}
						value={value}
						sx={{
							color: Theme.palette.text.secondary,
						}}
					>
						{value}
					</MenuItem>
				))}
			</Select>
		</Box>
	);
};

export default FunctionalityInstance;
