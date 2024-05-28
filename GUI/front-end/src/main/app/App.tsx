import React, { useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { useGetUsers } from '../../hooks';
import { ExtensionDisplay, ChatDisplay } from '../../components/displays';
import BaseLayout from '../layout/BaseLayout';
import HeaderLayout from '../layout/HeaderLayout';
import '../../css/app/App.css';

function App() {
	/// THESE LINES ARE ONLY FOR EXAMPLE PURPOSES ///

	const { data } = useGetUsers();
	useEffect(() => {
		console.log(data);
	}, [data]);

	/////////////////////////////////////////////////
	
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
	const Theme = useTheme();

	useEffect(() => {
		if (Theme.palette.mode === 'dark') {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}
	}, [Theme.palette.mode]);

	return (
		<BaseLayout>
			<Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'row'}>
				{/* Left side - drawer */}
				<Box
					width={isDrawerOpen ? '480px' : '0px'}
					height={'100%'}
					style={{
						backgroundColor: Theme.palette.background.paper,
						transition: 'width 0.5s ease-in-out',
						overflow: 'hidden',
					}}
				>
					<ExtensionDisplay />
				</Box>

				{/* Right size - chat */}
				<Box
					width={isDrawerOpen ? 'calc(100% - 480px)' : '100%'}
					height={'100%'}
					sx={{
						transition: 'width 0.5s ease-in-out',
						backgroundImage:
							Theme.palette.mode === 'dark'
								? `url('/svgs/Kath_OnlyText_Dark.svg')`
								: `url('/svgs/Kath_OnlyText_Light.svg')`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						position: 'relative',
					}}
				>
					{/* Up - header */}
					{/* TODO: set to isDrawerOpen */}
					<HeaderLayout open={false} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />

					{/* Chat display */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column-reverse',
							alignItems: 'center',
							height: 'calc(100% - 80px)',
						}}
					>
						<ChatDisplay />
					</Box>
				</Box>
			</Box>
		</BaseLayout>
	);
}

export default App;
