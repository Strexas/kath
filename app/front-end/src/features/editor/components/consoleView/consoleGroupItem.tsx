import { ConsoleFeedback, ConsoleFeedbackTypes } from '@/features/editor/types';
import { Typography, useTheme } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import React from 'react';

interface InProgressAnimationProps {
  isActive: boolean;
  children: React.ReactNode;
}

const InProgressAnimation: React.FC<InProgressAnimationProps> = ({ isActive, children }) => {
  const style = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0.1 },
    loop: { reverse: true },
    config: { duration: 700 },
  });

  return <animated.div style={isActive ? style : {}}>{children}</animated.div>;
};

export interface ConsoleGroupItemProps {
  index: number;
  length: number;
  feedback: ConsoleFeedback;
  ref: React.Ref<HTMLDivElement>;
}

/**
 * ConsoleGroupItem component displays a single console feedback message with styling based on the feedback type.
 *
 * @description This component renders a console feedback item using `Typography` from Material-UI. It conditionally
 * applies different styles and animations based on the feedback type (INFO, ERROR, WARNING) and its position in the list.
 * The last item in the list with a type of INFO triggers a fading animation via the `InProgressAnimation` component.
 *
 * @component
 *
 * @param {number} index - The index of the feedback item in the list.
 * @param {number} length - The total number of feedback items in the list.
 * @param {ConsoleFeedback} feedback - The feedback data, including type, timestamp, and message.
 * @param {React.Ref<HTMLDivElement>} ref - A reference to the HTML div element that wraps the feedback item.
 *
 * @returns {JSX.Element} A styled `Typography` element wrapped in an animation if applicable.
 *
 * @example
 * // Example usage of ConsoleGroupItem component
 * <ConsoleGroupItem
 *   index={0}
 *   length={5}
 *   feedback={{ type: ConsoleFeedbackTypes.INFO, timestamp: '12:34:56', message: 'Operation completed.' }}
 *   ref={myRef}
 * />
 */
export const ConsoleGroupItem = React.forwardRef<HTMLDivElement, ConsoleGroupItemProps>(
  ({ index, length, feedback }, ref) => {
    const Theme = useTheme();
    return (
      <InProgressAnimation isActive={index === length - 1 && feedback.type === ConsoleFeedbackTypes.INFO}>
        <Typography
          ref={ref}
          sx={{
            fontSize: 14,
            px: '0.625rem',
            py: '0.25rem',
            color:
              feedback.type === ConsoleFeedbackTypes.ERROR
                ? Theme.palette.error.main
                : feedback.type === ConsoleFeedbackTypes.WARNING
                  ? Theme.palette.warning.main
                  : index === length - 1 && feedback.type === ConsoleFeedbackTypes.INFO
                    ? Theme.palette.text.primary
                    : Theme.palette.text.secondary,
          }}
        >
          [{feedback.timestamp}] - [{feedback.type.toUpperCase()}] - {feedback.message}
        </Typography>
      </InProgressAnimation>
    );
  }
);

ConsoleGroupItem.displayName = 'ConsoleGroupItem';
