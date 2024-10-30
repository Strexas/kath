import '@/app/index.css';
import { AppProvider } from '@/app/provider';
import { AppRouter } from '@/app/router';

/**
 * `App` component is the root component of the application, setting up the provider and routing.
 *
 * @description This component serves as the entry point of the application. It wraps the `AppRouter` component with the
 * `AppProvider` to ensure that context providers and layout are applied throughout the application. The `AppRouter`
 * component handles routing and lazy loading of pages.
 *
 * The `AppProvider` provides necessary context and layout, while the `AppRouter` sets up the application's routing logic.
 * This structure ensures that all components within the application have access to the context and are properly routed.
 *
 * @component
 *
 * @example
 * // Example usage of the App component
 * return (
 *   <App />
 * );
 *
 * @returns {JSX.Element} The `AppProvider` component containing the `AppRouter` component.
 */
export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
