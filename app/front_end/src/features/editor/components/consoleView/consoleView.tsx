import { ConsoleGroup, ConsoleGroupItem, ConsoleGroupContextMenu } from '@/features/editor/components/consoleView';
import { ConsoleFeedback } from '@/features/editor/types';
import { socket } from '@/lib';
import { Events } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useStatusContext } from '@/hooks';
import { useWorkspaceContext } from '@/features/editor/hooks';

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
  const { blocked } = useStatusContext();
  const { consoleFeedback, consoleFeedbackStateUpdate } = useWorkspaceContext();

  const [contextMenu, setContextMenu] = useState<(EventTarget & HTMLDivElement) | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const consoleRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on(Events.CONSOLE_FEEDBACK_EVENT, consoleFeedbackStateUpdate);

    return () => {
      socket.off(Events.CONSOLE_FEEDBACK_EVENT);
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current && lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [consoleFeedback]);

  const handleOpenContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (blocked) return;

    setContextMenu(event.currentTarget);
    setContextMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setContextMenuPosition({ top: 0, left: 0 });
  }

  return (
    <>
      <ConsoleGroup ref={consoleRef} onContextMenu={handleOpenContextMenu}>
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
      <ConsoleGroupContextMenu 
        anchorPosition={contextMenuPosition}
        open={Boolean(contextMenu)}
        onClose={handleCloseContextMenu}
      />
    </>
  );
};
