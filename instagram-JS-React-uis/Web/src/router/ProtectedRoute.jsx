import { Navigate, Outlet } from 'react-router-dom';
import { getValidToken } from '../utils/jwt';

export const ProtectedRoute = () => {
  const token = getValidToken();

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
