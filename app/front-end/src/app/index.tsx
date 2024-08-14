import '@/app/index.css';
import { AppProvider } from './provider';
import { AppRouter } from './router';

/**
 * App component serves as the main entry point for the application.
 *
 * @description This component integrates the `AppProvider` and `AppRouter` components.
 * It uses `AppProvider` to wrap the application in a Suspense boundary for handling lazy-loaded components,
 * and `AppRouter` to configure and render the application's routes.
 *
 * @component
 *
 * @example
 * // Example usage of the App component
 * return (
 *   <App />
 * );
 *
 * @returns {JSX.Element} The rendered AppProvider component containing the AppRouter.
 */
export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
