import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import NavBar from "./components/NavBar";
import CodeViewerPageWrapper from "./pages/CodeViewerPageWrapper";
import PageNotFound from "./pages/PageNotFound";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// localStorage.removeItem("github_token");
// localStorage.removeItem("github_token");

export default function App() {
  const [_, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    const localToken = localStorage.getItem("github_token");

    if (urlToken) {
      localStorage.setItem("github_token", urlToken);
      setToken(urlToken);
      window.history.replaceState({}, "", "/dashboard");
    } else if (localToken) {
      setToken(localToken);
    }

    setLoading(false);
  }, [location]);

  if (loading) return <Loader />;

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-[#0d1117] dark:to-[#161b22] flex flex-col text-gray-900 dark:text-gray-100 font-sans min-h-screen">
      <NavBar />

      <ToastContainer position="top-center" />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />


        <Route path="/view/:token" element={<CodeViewerPageWrapper />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
