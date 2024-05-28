import { useContext } from 'react';
import { ApplicationContext } from './ApplicationContextProvider';

export const useApplicationContext = () => useContext(ApplicationContext);
