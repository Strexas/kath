import { Box, IconButton, useTheme } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

interface Props {
	open: boolean;
	onClick: () => void;
}

const HeaderLayout: React.FC<Props> = (props) => {
	const Theme = useTheme();
	return (
		<Box
			display={'flex'}
			height={'80px'}
			width={'100%'}
			alignItems={'center'}
			sx={{ backgroundColor: Theme.palette.background.default }}
		>
			<IconButton
				onClick={props.onClick}
				sx={{
					m: '10px',
					transition: 'transform 0.6s ease-in-out',
					transform: props.open ? 'rotate(0deg)' : 'rotate(180deg)',
				}}
			>
				<ChevronLeftIcon sx={{ color: Theme.palette.text.primary }} />
			</IconButton>
		</Box>
	);
};

export default HeaderLayout;
