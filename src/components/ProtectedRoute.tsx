import { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authenticated, checked } = useAuth();

  if (!checked) return <p>Loading...</p>;

  if (!authenticated) {
    return <Navigate to="/?message=connect_github" replace />;
  }

  return children;
};

export default ProtectedRoute;
