import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * NotFound component for handling 404 errors.
 *
 * @description Displays a message indicating the page was not found and provides a link to the home page.
 * @component
 *
 * @example
 * // Example usage of the NotFound component
 * return (
 *   <NotFound />
 * );
 *
 * @returns {JSX.Element} The rendered NotFound component.
 */
export const NotFound = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} p={'5rem'}>
      <Typography variant='h1'>404 - Not Found</Typography>
      <Typography variant='body1'>Sorry, the page you are looking for does not exist.</Typography>
      <Link to='/' replace>
        Go to Home
      </Link>
    </Box>
  );
};
