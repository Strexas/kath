import { Editor } from '@/features/editor';

/**
 * Home component provides the main layout structure of the application.
 *
 * @description This component sets up a flexible, responsive layout using Material-UI's `Box` components.
 * It consists of several sections including a hierarchy panel, a toolbar, an editor area, a file bar, and a console.
 * The layout is structured with the left-side hierarchy panel and the main content area split into four sections.
 * The background colors and other styles are dynamically applied based on the current theme using `useTheme`.
 *
 * The component layout includes:
 * - A left-side hierarchy panel with a width of 20% of the screen.
 * - A top toolbar section with a height of 15%.
 * - A central editor area with a height of 60%.
 * - A bottom file bar with a height of 5%.
 * - A console area at the bottom-right with a height of 20%.
 *
 * @component
 *
 * @example
 * // Example usage of the Home component
 * return (
 *   <Home />
 * );
 *
 * @returns {JSX.Element} The rendered layout of the Home component.
 */
export const Home = () => {
  return <Editor />;
};
