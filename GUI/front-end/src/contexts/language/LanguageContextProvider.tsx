import React, { createContext, useEffect, useState } from 'react';

interface LanguageContextProps {
	language: string;
	update: () => void;
	values: string[];
}

export const LanguageContext = createContext<LanguageContextProps>({
	language: 'en',
	update: () => {},
	values: [],
});

interface Props {
	children?: React.ReactNode;
}

export const LanguageContextProvider: React.FC<Props> = ({ children }) => {
	const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'en');

	function update() {
		if (localStorage.getItem('language') === 'en') {
			localStorage.setItem('language', 'lt');
		} else {
			localStorage.setItem('language', 'en');
		}
		setLanguage((prev) => (prev === 'en' ? 'lt' : 'en'));
	}

	useEffect(() => {
		if (!localStorage.getItem('language')) {
			localStorage.setItem('language', 'en');
			setLanguage('en');
		}
	}, []);

	const LanguageContextValue: LanguageContextProps = {
		language,
		update,
		values: ['en', 'lt'],
	};

	return <LanguageContext.Provider value={LanguageContextValue}>{children}</LanguageContext.Provider>;
};
