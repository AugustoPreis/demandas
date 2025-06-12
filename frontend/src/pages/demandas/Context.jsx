import { createContext, useContext } from 'react';

export const DemandasContext = createContext({});

export function useDemandasContext() {
  return useContext(DemandasContext);
}