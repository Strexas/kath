import { Box, Typography } from '@mui/material';

/**
 * Home component displays a welcome message at the home page.
 *
 * @description This component renders a centered welcome message with a header styling.
 * It uses Material-UI components for layout and typography.
 * @component
 *
 * @example
 * // Example usage of the Home component
 * return (
 *   <Home />
 * );
 *
 * @returns {JSX.Element} The rendered Home component.
 */
export const Home = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} p={'5rem'}>
      <Typography variant='h1'>Welcome to Kath!</Typography>
    </Box>
  );
};
