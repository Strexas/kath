/**
 * `Events` object defines the event names used for communication within the application.
 *
 * @description This object contains string constants representing the names of various events that are used for handling 
 * real-time communications or updates in the application. These event names are used with event-driven systems, such as
 * WebSocket connections, to emit and listen for specific events.
 *
 * The object includes:
 * - `CONSOLE_FEEDBACK_EVENT`: The event name for console feedback messages.
 * - `WORKSPACE_FILE_SAVE_FEEDBACK_EVENT`: The event name for feedback related to saving files in the workspace.
 * - `WORKSPACE_UPDATE_FEEDBACK_EVENT`: The event name for feedback related to updates in the workspace.
 * - `WORKSPACE_EXPORT_FEEDBACK_EVENT`: The event name for feedback related to exporting the workspace.
 *
 * @constant {Object} Events - The object containing event names.
 * @property {string} CONSOLE_FEEDBACK_EVENT - The event name for receiving console feedback messages.
 * @property {string} WORKSPACE_FILE_SAVE_FEEDBACK_EVENT - The event name for receiving feedback on file save operations within the workspace.
 * @property {string} WORKSPACE_UPDATE_FEEDBACK_EVENT - The event name for receiving feedback on workspace updates.
 * @property {string} WORKSPACE_EXPORT_FEEDBACK_EVENT - The event name for receiving feedback on exporting the workspace.
 *
 * @example
 * // Example usage of the Events object
 * socket.emit(Events.CONSOLE_FEEDBACK_EVENT, feedbackData);
 * socket.on(Events.WORKSPACE_FILE_SAVE_FEEDBACK_EVENT, (response) => {
 *   console.log('File save feedback:', response);
 * });
 */
export const Events = {
  CONSOLE_FEEDBACK_EVENT: 'console_feedback',
  WORKSPACE_FILE_SAVE_FEEDBACK_EVENT: 'workspace_file_save_feedback',
  WORKSPACE_UPDATE_FEEDBACK_EVENT: 'workspace_update_feedback',
  WORKSPACE_EXPORT_FEEDBACK_EVENT: 'workspace_export_feedback',
};
