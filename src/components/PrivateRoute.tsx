import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


interface PrivateRouteProps {
  children: React.ReactNode;
  role?: string; // 👈 make role optional
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { session, role: userRole } = UserAuth();

  // If not logged in → redirect to sign in
  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  // If role restriction exists but user role doesn’t match → block
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;