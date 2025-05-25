import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/me`, {
          credentials: "include",
        });

        setAuthenticated(res.ok);
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!authenticated) {
    return <Navigate to="/?message=connect_github" replace />;
  }

  return children;
};

export default ProtectedRoute;
