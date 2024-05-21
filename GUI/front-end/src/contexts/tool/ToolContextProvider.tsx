import React, { createContext, useEffect, useState } from 'react';

interface ToolContextProps {
	tool: string;
	update: (newTool: string) => void;
	values: string[];
}

export const ToolContext = createContext<ToolContextProps>({
	tool: 'Cadd',
	update: () => {},
	values: [],
});

interface Props {
	children?: React.ReactNode;
}

export const ToolContextProvider: React.FC<Props> = ({ children }) => {
	const [tool, setTool] = useState<string>(localStorage.getItem('tool') || 'Cadd');

	function update(newTool: string) {
		localStorage.setItem('tool', newTool);
		setTool(newTool);
	}

	useEffect(() => {
		if (!localStorage.getItem('tool')) {
			localStorage.setItem('tool', 'Cadd');
			setTool('Cadd');
		}
	}, []);

	const ToolContextValue: ToolContextProps = {
		tool,
		update,
		values: ['Cadd', 'Splice AI', 'Pangoli', 'EVE', 'Metadome'],
	};

	return <ToolContext.Provider value={ToolContextValue}>{children}</ToolContext.Provider>;
};
