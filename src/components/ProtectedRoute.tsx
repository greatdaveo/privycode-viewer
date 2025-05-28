import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setChecking(true);
    const storedToken = localStorage?.getItem("github_token");
    setToken(storedToken);
    setChecking(false);
  }, [token]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0d1117] text-gray-800 dark:text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/?message=connect_github" replace />;
  }

  return children;
};

export default ProtectedRoute;
