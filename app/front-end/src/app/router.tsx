import { Paths } from '@/types/constants/paths';
import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/**
 * AppRouter component sets up routing for the application using React Router.
 *
 * @description This component configures the application's routes and uses lazy loading
 * for route components. It employs `createBrowserRouter` to define the routes and `RouterProvider`
 * to provide the router context to the application.
 *
 * The routes are configured as follows:
 * - `Paths.HOME`: Lazy loads the `Home` component from `./routes/home`.
 * - `Paths.NOTFOUND`: Lazy loads the `NotFound` component from `./routes/notFound` for unmatched routes.
 *
 * @component
 *
 * @example
 * // Example usage of the AppRouter component
 * return (
 *   <AppRouter />
 * );
 *
 * @returns {JSX.Element} The rendered RouterProvider component with configured routes.
 */
export const AppRouter = () => {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: Paths.HOME,
          lazy: async () => {
            const { Home } = await import('./routes/home');
            return { Component: Home };
          },
        },
        {
          path: Paths.NOTFOUND,
          lazy: async () => {
            const { NotFound } = await import('./routes/notFound');
            return { Component: NotFound };
          },
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
};
