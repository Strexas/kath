import { useContext } from 'react';
import { LanguageContext } from './LanguageContextProvider';

export const useLanguageContext = () => useContext(LanguageContext);
