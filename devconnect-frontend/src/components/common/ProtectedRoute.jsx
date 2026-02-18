import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authstore';

export default function ProtectedRoute({ children, requireModerator = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireModerator && user?.role !== 'moderator' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}