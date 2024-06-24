import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import {
	LanguageContextProvider,
	ThemeContextProvider,
	ApplicationContextProvider,
	ToolContextProvider,
	WorkspaceContextProvider,
} from '../contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ApplicationContextProvider>
				<WorkspaceContextProvider>
					<ToolContextProvider>
						<LanguageContextProvider>
							<ThemeContextProvider>
								<App />
							</ThemeContextProvider>
						</LanguageContextProvider>
					</ToolContextProvider>
				</WorkspaceContextProvider>
			</ApplicationContextProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
