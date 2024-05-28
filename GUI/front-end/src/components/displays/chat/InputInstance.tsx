import { Box, IconButton, Input, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import React from 'react';

interface Props {
	onSubmit: (content: string) => void;
	disabled: boolean;
}

const InputInstance: React.FC<Props> = (props) => {
	const [content, setContent] = React.useState('');

	const Theme = useTheme();

	const handleSendClick = () => {
		// TODO: Implement sending message
		if (content.trim().length === 0) return;
		props.onSubmit(content);
		setContent('');
	};

	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			width={'calc(100% - 80px)'}
			minHeight={'50px'}
			maxHeight={'200px'}
			m={'40px'}
			p={'15px'}
			alignItems={'end'}
			sx={{
				backgroundColor: Theme.palette.background.paper,
				borderRadius: '20px',
			}}
		>
			<Box minHeight={'50px'} display={'flex'} flexGrow={1}>
				<Input
					disabled={props.disabled}
					multiline={true}
					disableUnderline={true}
					fullWidth={true}
					style={{
						overflowX: 'auto',
						resize: 'none',
						minHeight: '50px',
						maxHeight: '200px',
						fontFamily: 'Poppins',
						fontSize: '20px',
					}}
					onChange={(e) => {
						setContent(e.target.value);
					}}
					value={content}
					placeholder='How can I help you?'
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSendClick();
						}
					}}
				></Input>
			</Box>
			<Box minHeight={'50px'}>
				<IconButton onClick={handleSendClick} disabled={props.disabled}>
					<SendIcon sx={{ color: props.disabled ? Theme.palette.text.secondary : Theme.palette.text.primary }} />
				</IconButton>
			</Box>
		</Box>
	);
};

export default InputInstance;
