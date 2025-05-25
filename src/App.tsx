import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import CodeViewerPageWrapper from "./pages/CodeViewerPageWrapper";
import PageNotFound from "./pages/PageNotFound";
// import ProtectedRoute from "./components/ProtectedRoute";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("github_token");
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // if token is invalid or expired
          localStorage.removeItem("github_token");
          alert("Your GitHub session expired. Please reconnect.");
          window.location.href = "/";
        }
      } catch (err) {
        // if there is network or unexpected error
        localStorage.removeItem("github_token");
        alert("Authentication error. Please reconnect your GitHub.");
        window.location.href = "/";
      }
    };

    checkToken();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-[#0d1117] dark:to-[#161b22] flex flex-col text-gray-900 dark:text-gray-100 font-sans min-h-screen">
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/view/:token" element={<CodeViewerPageWrapper />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
