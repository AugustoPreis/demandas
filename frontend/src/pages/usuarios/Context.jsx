import { createContext, useContext } from 'react';

export const UsuariosContext = createContext({});

export function useUsuariosContext() {
  return useContext(UsuariosContext);
}