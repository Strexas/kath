import { BaseLayout } from '@/components/layouts/baseLayout';
import { ThemeContextProvider } from '@/stores';
import { CircularProgress } from '@mui/material';
import React from 'react';

type AppProviderProps = {
  children: React.ReactNode;
};

/**
 * `AppProvider` component provides the application with a theme context and layout, and handles lazy loading with a fallback spinner.
 *
 * @description This component wraps its children with the `ThemeContextProvider` to provide theming capabilities
 * and `BaseLayout` to apply a consistent layout structure. It also utilizes `React.Suspense` to manage lazy-loaded
 * components, displaying a `CircularProgress` spinner as a fallback while components are loading.
 *
 * The `CircularProgress` spinner is centered within its container to ensure visibility and a smooth user experience during loading.
 *
 * @component
 *
 * @param {AppProviderProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider and layout.
 *
 * @example
 * // Example usage of the AppProvider component
 * return (
 *   <AppProvider>
 *     <YourComponent />
 *   </AppProvider>
 * );
 *
 * @returns {JSX.Element} The `React.Suspense` component wrapping the `ThemeContextProvider` and `BaseLayout`.
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={<CircularProgress sx={{ display: 'flex', justifyItems: 'center', alignContent: 'center' }} />}
    >
      <ThemeContextProvider>
        <BaseLayout>{children}</BaseLayout>
      </ThemeContextProvider>
    </React.Suspense>
  );
};
