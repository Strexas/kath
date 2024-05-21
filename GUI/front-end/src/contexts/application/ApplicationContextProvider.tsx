import React, { createContext, useEffect, useState } from 'react';

interface ApplicationContextProps {
	name: string;
	update: (newName: string) => void;
}

export const ApplicationContext = createContext<ApplicationContextProps>({
	name: 'Kath',
	update: () => {},
});

interface Props {
	children?: React.ReactNode;
}

export const ApplicationContextProvider: React.FC<Props> = ({ children }) => {
	const [name, setName] = useState<string>(localStorage.getItem('application-name') || 'Kath');

	function update(newName: string) {
		localStorage.setItem('application-name', newName);
		setName(newName);
	}

	useEffect(() => {
		if (!localStorage.getItem('application-name')) {
			localStorage.setItem('application-name', 'Kath');
			setName('Kath');
		}
	}, []);

	const ApplicationContextValue: ApplicationContextProps = {
		name,
		update,
	};

	return <ApplicationContext.Provider value={ApplicationContextValue}>{children}</ApplicationContext.Provider>;
};
