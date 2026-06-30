import { createContext } from 'react';
import TranslationsService from './translationService';

const services = {
  TranslationsService: new TranslationsService()
};

const AppContext = createContext();
const { Provider } = AppContext;

const AppProvider = ({ children }) => {
  return <Provider value={{ services }}>{children}</Provider>;
};

export { AppContext, AppProvider }