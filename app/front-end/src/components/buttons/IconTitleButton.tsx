import { alpha, Box, IconButton, Typography, useTheme } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  title?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

/**
 * A button component that combines an icon with an optional title.
 *
 * @component
 *
 * @description This component renders an `IconButton` with an optional `Typography` title below it.
 * The `IconButton` has customizable width, height, and border radius. The hover effect currently applies
 * a semi-transparent background color, which should ideally be responsive to the theme. The title, if provided,
 * is displayed below the icon with a bold font style.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.icon - The icon to be displayed inside the button.
 * @param {string} [props.title] - An optional title displayed below the icon.
 * @param {string} [props.width] - Custom width of the `IconButton`. Defaults to '3rem'.
 * @param {string} [props.height] - Custom height of the `IconButton`. Defaults to '3rem'.
 * @param {string} [props.borderRadius] - Custom border radius of the `IconButton`. Defaults to '1rem'.
 *
 * @returns {JSX.Element} The `IconTitleButton` component rendering an icon button and an optional title.
 */
export const IconTitleButton: React.FC<Props> = ({
  icon,
  title,
  width,
  height,
  borderRadius,
  onClick,
  isActive = false,
  disabled = false,
}) => {
  const Theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IconButton
        disableTouchRipple
        sx={{
          width: width || '3rem',
          height: height || '3rem',
          borderRadius: borderRadius || '1rem',
          transition: 'background-color 0.5s ease',
          color: disabled ? alpha(Theme.palette.primary.contrastText, 0.4) : Theme.palette.primary.contrastText,
          ':hover': {
            backgroundColor: disabled
              ? 'transparent'
              : isActive
                ? alpha(Theme.palette.primary.contrastText, 0.3)
                : alpha(Theme.palette.primary.contrastText, 0.2),
          },
          backgroundColor: disabled
            ? 'transparent'
            : isActive
              ? alpha(Theme.palette.primary.contrastText, 0.3)
              : 'transparent',
        }}
        onClick={disabled ? () => {} : onClick}
      >
        {icon}
      </IconButton>
      {title && (
        <Typography
          sx={{
            color: disabled ? alpha(Theme.palette.primary.contrastText, 0.4) : Theme.palette.primary.contrastText,
            fontSize: '0.875rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={disabled ? () => {} : onClick}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};
