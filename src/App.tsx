import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import CodeViewerPageWrapper from "./pages/CodeViewerPageWrapper";
import PageNotFound from "./pages/PageNotFound";
// import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    const localToken = localStorage.getItem("github_token");

    if (urlToken) {
      // To clear old token before storing the new one
      localStorage.removeItem("github_token");
      localStorage.setItem("github_token", urlToken);
      window.history.replaceState({}, "", "/dashboard");
    } else if (localToken) {
      // Token exists but not from a fresh GitHub auth → force reconnect
      alert("Your session has expired. Please reconnect your GitHub account.");
      localStorage.removeItem("github_token");
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/github/login";
    }
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
