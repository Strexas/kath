import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';

interface Props {
	instances: React.ReactNode[];
}

const ChatGroup: React.FC<Props> = (props) => {
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (endRef.current) {
			endRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [props.instances]);

	return (
		<React.Fragment>
			<Box
				display={'flex'}
				flexDirection={'column'}
				flexGrow={1}
				width='calc(100% - 80px)'
				height={'calc(100% - 280px)'}
				mx='20px'
				px='20px'
				sx={{ overflowY: 'auto' }}
			>
				{props.instances.map((instance) => instance)}
				<div ref={endRef} />
			</Box>
		</React.Fragment>
	);
};

export default ChatGroup;
