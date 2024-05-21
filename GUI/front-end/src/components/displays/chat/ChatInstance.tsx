import { Box, Icon, IconButton, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ContentPaste as ContentPasteIcon } from '@mui/icons-material';

interface Props {
	icon: React.ReactNode;
	author: string;
	content: string;
}

const ChatInstance: React.FC<Props> = (props) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const Theme = useTheme();

	const copyToClipboard = async () => {
		await navigator.clipboard
			.writeText(props.content)
			.then(() => {
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), 2000);
			})
			.catch(() => {});
	};

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<React.Fragment>
			<Box
				display={'flex'}
				flexDirection={'row'}
				py={'10px'}
				sx={{
					backgroundColor: Theme.palette.background.default,
					borderRadius: '15px',
					opacity: isVisible ? 1 : 0,
					transition: 'opacity 1s',
				}}
			>
				<Box width={'50px'}>
					<Icon sx={{ width: '40px', height: '40px', color: Theme.palette.text.primary }}>{props.icon}</Icon>
				</Box>
				<Box display={'flex'} flexDirection={'column'} width={'100%'} sx={{ wordBreak: 'break-word' }}>
					<Typography height={'40px'} alignContent={'center'} fontWeight={'bold'}>
						{props.author}
					</Typography>
					{props.content.split('\n\n').map((paragraph, index) => (
						<Typography key={index} py={'10px'}>
							{paragraph}
						</Typography>
					))}
					<Box display={'flex'} flexDirection={'row'} height={'30px'} alignContent={'center'} gap={'2px'}>
						<IconButton onClick={copyToClipboard} sx={{ width: '30px', height: '30px' }}>
							<ContentPasteIcon sx={{ width: '30px', height: '30px' }} />
						</IconButton>
						<Typography
							sx={{
								opacity: isCopied ? 1 : 0,
								visibility: isCopied ? 'visible' : 'hidden',
								transition: isCopied ? 'opacity 0s' : 'opacity 0.5s ease-in-out, visibility 0.5s',
							}}
						>
							Copied!
						</Typography>
					</Box>
				</Box>
			</Box>
		</React.Fragment>
	);
};

export default ChatInstance;
