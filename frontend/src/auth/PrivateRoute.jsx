import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Cabecalho from '../components/Cabecalho';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <Navigate to='/login' />
    );
  }

  return (
    <>
      <Cabecalho />
      <Outlet />
    </>
  );
}