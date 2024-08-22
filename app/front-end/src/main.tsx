import { App } from '@/app';
import ReactDOM from 'react-dom/client';

/**
 * Entry point for the React application.
 *
 * @description This script initializes the React application by creating a root element
 * and rendering the `App` component.
 *
 * @example
 * // This script is typically included in the main entry file, like index.tsx or index.js.
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 *
 * @returns {void} This script does not return any value. It performs side effects by rendering the application.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
