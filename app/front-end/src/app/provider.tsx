import { BaseLayout } from '@/components/layouts/baseLayout';
import { ThemeContextProvider } from '@/stores/theme/themeContextProvider';
import { CircularProgress } from '@mui/material';
import React from 'react';

type AppProviderProps = {
  children: React.ReactNode;
};

/**
 * AppProvider component wraps its children with React's Suspense to handle lazy-loaded components,
 * while also providing theme context and layout structure.
 *
 * @description This component uses React's `Suspense` to manage the loading state of lazy-loaded components,
 * displaying a Material-UI `CircularProgress` spinner as a fallback during loading. Additionally, it provides
 * a consistent layout through `BaseLayout` and theme context via `ThemeContextProvider` to all its children.
 *
 * @component
 *
 * @example
 * // Example usage of the AppProvider component
 * return (
 *   <AppProvider>
 *     <YourComponent />
 *   </AppProvider>
 * );
 *
 * @param {AppProviderProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the Suspense boundary,
 * and wrapped with theme context and layout structure.
 *
 * @returns {JSX.Element} The rendered React.Suspense component with a fallback loading spinner,
 * providing theme context and layout to its children.
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
