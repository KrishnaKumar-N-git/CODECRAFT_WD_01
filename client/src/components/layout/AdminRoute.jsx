import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

/**
 * Wraps routes that require the 'admin' role.
 * - Unauthenticated → /login
 * - Authenticated but not admin → /dashboard (with forbidden flag)
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ forbidden: true }} replace />;
  }

  return children;
};

export default AdminRoute;
