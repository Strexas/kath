import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useLanguageContext } from '../../../contexts';
import FunctionalityInstance from './FunctionalityInstance';
import HistoryInstance from './HistoryInstance';

interface Props {}

export const ExtensionDisplay: React.FC<Props> = () => {
	const [selectedTab, setSelectedTab] = useState<string>('Functionality');

	const Theme = useTheme();
	const languageContext = useLanguageContext();

	return (
		<Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'}>
			<Box display={'flex'} flexDirection={'row'} height={'80px'}>
				<Box
					height={'100%'}
					width={'50%'}
					alignContent={'center'}
					sx={{
						backgroundColor:
							selectedTab === 'Functionality' ? Theme.palette.background.paper : Theme.palette.background.default,
					}}
					onClick={() => setSelectedTab('Functionality')}
				>
					<Typography
						textAlign={'center'}
						sx={{ color: selectedTab === 'Functionality' ? Theme.palette.text.primary : Theme.palette.text.secondary }}
					>
						{languageContext.language === 'en' ? 'Functionality' : 'Funkcionalumas'}
					</Typography>
				</Box>
				<Box
					height={'100%'}
					width={'50%'}
					alignContent={'center'}
					sx={{
						backgroundColor:
							selectedTab === 'History' ? Theme.palette.background.paper : Theme.palette.background.default,
					}}
					onClick={() => setSelectedTab('History')}
				>
					<Typography
						textAlign={'center'}
						sx={{ color: selectedTab === 'History' ? Theme.palette.text.primary : Theme.palette.text.secondary }}
					>
						{languageContext.language === 'en' ? 'History' : 'Istorija'}
					</Typography>
				</Box>
			</Box>
			<Box
				display={'flex'}
				flexDirection={'column'}
				height={'calc(100% - 80px)'}
				width={'100%'}
				sx={{ backgroundColor: Theme.palette.background.paper }}
			>
				{selectedTab === 'Functionality' ? <FunctionalityInstance /> : <HistoryInstance />}
			</Box>
		</Box>
	);
};
