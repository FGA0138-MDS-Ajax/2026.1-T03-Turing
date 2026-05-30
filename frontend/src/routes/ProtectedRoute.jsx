import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.tipo !== requiredRole) {
    return <Navigate to="/403" replace />;
  }
  return children ?? <Outlet />;
}