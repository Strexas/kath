import { BaseLayout } from '@/components/layouts/baseLayout';
import { Paths } from '@/types';
import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/**
 * `AppRouter` component sets up the routing for the application using `createBrowserRouter` from `react-router-dom`.
 *
 * @description This component defines the routes for the application and configures lazy loading for route components.
 * It uses the `createBrowserRouter` function to set up routing, with the paths and associated components being loaded
 * asynchronously. The router configuration includes:
 * - A route for the home page, which is lazily loaded from `./routes/home`.
 * - A catch-all route for 404 pages, which is lazily loaded from `./routes/notFound`.
 *
 * The component uses `RouterProvider` to provide the router to the application, ensuring that routing is managed
 * throughout the app.
 *
 * @component
 *
 * @example
 * // Example usage of the AppRouter component
 * return (
 *   <AppRouter />
 * );
 *
 * @returns {JSX.Element} The RouterProvider component with the configured browser router.
 */
export const AppRouter = () => {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: Paths.HOME,
          lazy: async () => {
            const { Home } = await import('./routes/home');
            return {
              Component: (props) => (
                <BaseLayout>
                  <Home {...props} />
                </BaseLayout>
              ),
            };
          },
        },
        {
          path: Paths.NOTFOUND,
          lazy: async () => {
            const { NotFound } = await import('./routes/notFound');
            return {
              Component: (props) => (
                <BaseLayout>
                  <NotFound {...props} />
                </BaseLayout>
              ),
            };
          },
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
};
