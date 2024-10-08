import { Box } from '@mui/material';
import React from 'react';

export interface ConsoleGroupProps {
  children?: React.ReactNode;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * ConsoleGroup component serves as a container for displaying console feedback items.
 *
 * @description This component provides a styled `Box` that arranges its children in a vertical column.
 * It is designed to be a scrollable container, making it suitable for displaying multiple console feedback messages.
 * The `ConsoleGroup` uses `forwardRef` to allow parent components to reference the container element directly.
 *
 * @component
 *
 * @param {React.ReactNode} children - The console feedback items or other elements to be displayed inside the group.
 * @param {React.Ref<HTMLDivElement>} ref - A reference to the HTML div element that wraps the group of console items.
 *
 * @returns {JSX.Element} A `Box` component that wraps the children in a scrollable, vertically-aligned container.
 *
 * @example
 * // Example usage of ConsoleGroup component
 * <ConsoleGroup ref={myRef}>
 *   <ConsoleGroupItem ... />
 *   <ConsoleGroupItem ... />
 * </ConsoleGroup>
 */
export const ConsoleGroup = React.forwardRef<HTMLDivElement, ConsoleGroupProps>(({ children, onContextMenu }, ref ) => {
  return (
    <Box
      onContextMenu={(event) => {
        if (onContextMenu) {
          onContextMenu(event);
        }
      }}
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        p: '0',
      }}
    >
      {children}
    </Box>
  );
});

ConsoleGroup.displayName = 'ConsoleGroup';
