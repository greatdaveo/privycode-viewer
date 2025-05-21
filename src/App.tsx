import { useState } from "react";
import "./App.css";
import { ViewerPage } from "./pages/ViewerPage";
import { fetchUserInfo } from "./api/GitHubApi";

export default function App() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  // console.log(token);

  const [userInfo, setUserInfo] = useState<{
    github_username: string;
    repo_name: string;
  } | null>(null);

  const loadUserInfo = async () => {
    try {
      const info = await fetchUserInfo(token);
      setUserInfo(info);
    } catch (error: any) {
      console.log("❌ Could not load viewer info: ", error);
    }
  };
  loadUserInfo();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161b22]">
        <h1 className="text-xl font-semibold tracking-tight">
          Testing My Repo
        </h1>

        {userInfo && (
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
            <span className="text-blue-600 dark:text-blue-400">
              {userInfo.github_username}
            </span>
            {" / "}
            <span>{userInfo.repo_name}</span>
          </div>
        )}
      </header>

      <main className="flex-1">
        <ViewerPage token={token} />
      </main>
    </div>
  );
}
