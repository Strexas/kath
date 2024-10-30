import { StatusContext } from '@/stores';
import { useContext } from 'react';

export const useStatusContext = () => useContext(StatusContext);
