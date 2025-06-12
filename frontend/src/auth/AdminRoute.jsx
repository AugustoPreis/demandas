import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute() {
  const { getUser } = useAuth();

  if (!getUser()?.adm) {
    return (
      <Navigate to='/demandas' />
    );
  }

  return (
    <Outlet />
  );
}