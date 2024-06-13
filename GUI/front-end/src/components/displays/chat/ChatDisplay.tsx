import InputInstance from './InputInstance';
import React from 'react';
import ChatGroup from './ChatGroup';
import ChatInstance from './ChatInstance';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useApplicationContext } from '../../../contexts';
import { KathLogo } from '../../svgs';
import { useSendRequest } from '../../../hooks';

interface Props {}

export const ChatDisplay: React.FC<Props> = () => {
	const [ChatInstances, setChatInstances] = React.useState<React.ReactNode[]>([]);
	const [isInputDisabled, setIsInputDisabled] = React.useState(false);

	const applicationContext = useApplicationContext();
	const sendRequest = useSendRequest();

	const handleSubmit = async (content: string) => {
		setIsInputDisabled(true);
		setChatInstances((prevInstances) => [
			...prevInstances,
			<ChatInstance icon={<AccountCircleIcon />} author='User' content={content} />,
		]);

		const responseResult = await sendRequest.mutateAsync(content);
		setIsInputDisabled(false);

		setChatInstances((prevInstances) => [
			...prevInstances,
			<ChatInstance icon={<KathLogo />} author={applicationContext.name} content={responseResult} />,
		]);
	};

	return (
		<React.Fragment>
			<InputInstance onSubmit={handleSubmit} disabled={isInputDisabled} />
			<ChatGroup instances={ChatInstances} />
		</React.Fragment>
	);
};
