import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  }

  //Verifica diretamente no localStorage, pois pode não ter dado tempo de atualizar o estado do `user
  const isAuthenticated = () => {
    return !!localStorage.getItem('user');
  }

  //Mesmo caso do isAuthenticated
  const getUser = () => {
    const userData = localStorage.getItem('user');

    return userData ? JSON.parse(userData) : null;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      getUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}