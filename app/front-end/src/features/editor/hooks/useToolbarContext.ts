import { ToolbarContext } from '@/features/editor/stores';
import { useContext } from 'react';

export const useToolbarContext = () => useContext(ToolbarContext);
