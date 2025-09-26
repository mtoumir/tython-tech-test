import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


interface PrivateRouteProps {
  children: React.ReactNode;
  role?: string; 
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { session, role: userRole } = UserAuth();

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;