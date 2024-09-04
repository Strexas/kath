import { SessionContextProvider, StatusContextProvider, ThemeContextProvider } from '@/stores';
import { CircularProgress } from '@mui/material';
import React from 'react';

type AppProviderProps = {
  children: React.ReactNode;
};

/**
 * `AppProvider` component is the root provider for the application, setting up theme, session contexts, and layout structure.
 * It also handles lazy loading of components with a fallback loading spinner.
 *
 * @description This component wraps its children with essential providers and layout structures, ensuring consistent theming,
 * session management, and application-wide layout. It includes `SessionContextProvider` for managing session-related data
 * and `ThemeContextProvider` for applying a consistent theme across the application. The layout is managed by `BaseLayout`,
 * which provides a standard structure for all pages.
 *
 * The component utilizes `React.Suspense` to manage the loading state of lazy-loaded components, displaying a centered
 * `CircularProgress` spinner while waiting for components to load. This ensures a smooth user experience during transitions
 * and lazy loading.
 *
 * @component
 *
 * @param {AppProviderProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider, layout, and context wrappers.
 *
 * @example
 * // Example usage of the AppProvider component
 * return (
 *   <AppProvider>
 *     <YourComponent />
 *   </AppProvider>
 * );
 *
 * @returns {JSX.Element} A `React.Suspense` component that wraps the `SessionContextProvider`, `ThemeContextProvider`, and `BaseLayout`.
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={<CircularProgress sx={{ display: 'flex', justifyItems: 'center', alignContent: 'center' }} />}
    >
      <SessionContextProvider>
        <StatusContextProvider>
          <ThemeContextProvider>{children}</ThemeContextProvider>
        </StatusContextProvider>
      </SessionContextProvider>
    </React.Suspense>
  );
};
