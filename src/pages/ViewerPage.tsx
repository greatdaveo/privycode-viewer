import { useEffect, useState } from "react";
import {
  fetchFileContent,
  fetchRepoContents,
  fetchUserInfo,
} from "../api/GitHubApi";
import { GitHubContentItem } from "../types/github";
import SideBar from "../components/SideBar";
import MonacoEditor from "@monaco-editor/react";
import ErrorPage from "./ErrorPage";

export function ViewerPage({ token }: { token: string }) {
  const [contents, setContents] = useState<GitHubContentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [userInfo, setUserInfo] = useState<{
    github_username: string;
    repo_name: string;
  } | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadContents = async () => {
      try {
        const data = await fetchRepoContents(token);
        setContents(data);
        // console.log(data);
      } catch (error: any) {
        console.error("❌ Failed to load repo contents:", error);
        setError(error.message || error);
      }
    };

    loadContents();
  }, [token]);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const info = await fetchUserInfo(token);
        setUserInfo(info);
      } catch (error: any) {
        console.log("❌ Could not load viewer info: ", error);
      }
    };

    loadUserInfo();
  }, [token]);

  const handleFileClick = async (path: string) => {
    setSelectedFile(path);
    setFileContent("Loading...");

    try {
      const content = await fetchFileContent(token, path);
      console.log(content);
      setFileContent(content);
    } catch (error) {
      console.log(error);
      setFileContent("Error loading file.");
    }
  };

  function detectLanguage(filename: string): string {
    const ext = filename.split(".").pop()?.toLocaleLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "go":
        return "go";
      case "py":
        return "python";
      case "json":
        return "json";
      case "html":
        return "html";
      case "css":
        return "css";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  }

  useEffect(() => {
    const disableCopy = (e: ClipboardEvent) => e.preventDefault();
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    const disableKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x,", "s"].includes(e.key.toLocaleLowerCase())
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", disableCopy);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  if (error.toLowerCase().includes("deleted")) {
    return (
      <ErrorPage
        title="Link Deleted"
        message="This viewer link has been deleted by the user."
      />
    );
  }

  if (error.toLowerCase().includes("expired")) {
    return (
      <ErrorPage
        title="Link Expired"
        message="This viewer link has expired. Please request a new one."
      />
    );
  }

  if (error.toLowerCase().includes("limit")) {
    return (
      <ErrorPage
        title="View Limit Reached"
        message="This viewer link has exceeded the maximum number of allowed views."
      />
    );
  }

  if (error.toLowerCase().includes("invalid")) {
    return (
      <ErrorPage
        title="Invalid Link"
        message="This viewer link is not valid or may have been removed."
      />
    );
  }

  if (error) {
    return <ErrorPage title="Error" message={error} />;
  }
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161b22]">
        <h1 className="text-xl font-semibold tracking-tight">
          Private GitHub Repository – Read-only view
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

      <div className="flex h-screen text-sm bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-mono">
        <SideBar
          contents={contents}
          selectedFile={selectedFile}
          onSelectFile={handleFileClick}
          token={token}
        />

        <main className="flex-1 overflow-hidden p-0">
          {selectedFile ? (
            <>
              <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
                <h3 className="font-bold text-base">📄 {selectedFile}</h3>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute top-[35px] left-[100px] inset-0 flex items-center justify-center z-10 select-none">
                  <div className="text-[100px] font-bold opacity-10 text-gray-700 dark:text-gray-300 rotate-[-20deg]">
                    PrivyCode <br /> Confidential <br /> Code
                  </div>
                </div>

                <MonacoEditor
                  height="80vh"
                  defaultLanguage={detectLanguage(selectedFile || "")}
                  // theme={theme === "dark" ? "vs-dark" : "light"}
                  theme="vs-dark"
                  value={fileContent}
                  options={{
                    readOnly: true,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    smoothScrolling: true,
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center text-[50px]">
              Select a file to view its contents.
            </p>
          )}
        </main>
      </div>
    </>
  );
}
