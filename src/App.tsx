import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import CodeViewerPageWrapper from "./pages/CodeViewerPageWrapper";
import PageNotFound from "./pages/PageNotFound";
// import ProtectedRoute from "./components/ProtectedRoute";

// const token = localStorage.getItem("github_token");
localStorage.removeItem("github_token");

export default function App() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    // console.log("token: ", token);
    if (token) {
      localStorage.removeItem("github_token");
      localStorage.setItem("github_token", token);
      // window.history.replaceState({}, "", "/dashboard");
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
