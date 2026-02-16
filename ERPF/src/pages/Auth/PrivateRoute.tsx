import useAuthStore from '@stores/authStore'
import { Navigate } from 'react-router-dom'

export interface PrivateRouteI {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteI) => {
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
