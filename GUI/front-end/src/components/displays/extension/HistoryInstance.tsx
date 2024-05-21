import { Error as ErrorIcon } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useLanguageContext } from '../../../contexts';

interface Props {}

const HistoryInstance: React.FC<Props> = () => {
	const Theme = useTheme();
	const languageContext = useLanguageContext();
	return (
		<Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={'10px'} mx={'20px'} my={'40px'}>
			<ErrorIcon sx={{ color: Theme.palette.text.secondary }} />
			<Typography sx={{ color: Theme.palette.text.secondary }}>
				{languageContext.language === 'en' ? 'No history available' : 'Istorijos nėra'}
			</Typography>
		</Box>
	);
};

export default HistoryInstance;
