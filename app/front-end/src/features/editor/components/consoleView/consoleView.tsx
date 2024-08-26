import { ConsoleGroup, ConsoleGroupItem } from '@/features/editor/components/consoleView';
import { ConsoleFeedback } from '@/features/editor/types';
import { socket } from '@/lib';
import { Events } from '@/types';
import { useEffect, useRef, useState } from 'react';

/**
 * ConsoleView component renders a live-updating console log, displaying feedback messages received via WebSocket.
 *
 * @description This component listens for `console_feedback` events from a WebSocket connection, storing
 * received feedback messages in a state array. These messages are displayed within a scrollable `ConsoleGroup` component,
 * with each message rendered as a `ConsoleGroupItem`. The component automatically scrolls to the latest message
 * whenever a new one is added.
 *
 * @component
 *
 * @returns {JSX.Element} A live console view that displays feedback messages in real-time.
 *
 * @example
 * // Example usage of ConsoleView component
 * <ConsoleView />
 */
export const ConsoleView: React.FC = () => {
  const [consoleFeedback, setConsoleFeedback] = useState<ConsoleFeedback[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleConsoleFeedback = (data: ConsoleFeedback) => {
      setConsoleFeedback((prev) => [...prev, data]);
    };

    socket.on(Events.CONSOLE_FEEDBACK_EVENT, handleConsoleFeedback);

    return () => {
      socket.off(Events.CONSOLE_FEEDBACK_EVENT);
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current && lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [consoleFeedback]);

  return (
    <>
      <ConsoleGroup ref={consoleRef}>
        {consoleFeedback.map((feedback: ConsoleFeedback, index: number) => (
          <ConsoleGroupItem
            key={index}
            index={index}
            length={consoleFeedback.length}
            feedback={feedback}
            ref={index === consoleFeedback.length - 1 ? lastRef : null}
          />
        ))}
      </ConsoleGroup>
    </>
  );
};
