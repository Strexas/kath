import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

interface Props {
	title: string;
	instances: React.ReactNode[];
}

const SettingsGroup: React.FC<Props> = (props) => {
	const Theme = useTheme();
	return (
		<React.Fragment>
			<Box
				display={'flex'}
				flexDirection={'column'}
				width={'calc(100% - 80px)'}
				px={'40px'}
				py={'20px'}
				sx={{ backgroundColor: Theme.palette.background.default }}
			>
				<Box height={'40px'} alignContent={'center'}>
					<Typography>{props.title}</Typography>
				</Box>
				{props.instances.map((instance) => instance)}
			</Box>
		</React.Fragment>
	);
};

export default SettingsGroup;
