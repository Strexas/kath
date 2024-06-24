import InputInstance from './InputInstance';
import React from 'react';
import ChatGroup from './ChatGroup';
import ChatInstance from './ChatInstance';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useApplicationContext } from '../../../contexts';
import { KathLogo } from '../../svgs';
import { useSendRequest } from '../../../hooks';
import { useWorkspaceContext } from '../../../contexts/tool/UseWorkspaceContext';

interface Props {}

export const ChatDisplay: React.FC<Props> = () => {
	const [ChatInstances, setChatInstances] = React.useState<React.ReactNode[]>([]);
	const [isInputDisabled, setIsInputDisabled] = React.useState(false);

	const applicationContext = useApplicationContext();
	const workspaceContext = useWorkspaceContext();
	const sendRequest = useSendRequest();

	const handleSubmit = async (content: string) => {
		setIsInputDisabled(true);
		setChatInstances((prevInstances) => [
			...prevInstances,
			<ChatInstance icon={<AccountCircleIcon />} author='User' content={content} />,
		]);

		const data = {
			content: content,
			workspace: workspaceContext.workspace,
		}

		const responseResult = await sendRequest.mutateAsync(data);
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
