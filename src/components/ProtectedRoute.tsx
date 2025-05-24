import { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("github_token");

  if (!token) {
    // If not authenticated, redirect to home with a message
    return <Navigate to="/?message=connect_github" replace />;
  }

  return children;
};

export default ProtectedRoute;
