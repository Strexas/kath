import { useContext } from 'react';
import { ToolContext } from './ToolContextProvider';

export const useToolContext = () => useContext(ToolContext);
