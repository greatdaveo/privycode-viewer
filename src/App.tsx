import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ViewerPage } from "./pages/ViewerPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";

export default function App() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  console.log("token: ", token);

  useEffect(() => {
    if (token) {
      localStorage.setItem("github_token", token);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/view" element={<ViewerPage token={token} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}
