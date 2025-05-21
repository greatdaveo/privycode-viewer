import { useEffect, useState } from "react";
import { fetchFileContent, fetchRepoContents } from "../api/GitHubApi";
import { GitHubContentItem } from "../types/github";
import SideBar from "../componets/SideBar";
import MonacoEditor from "@monaco-editor/react";

export function ViewerPage({ token }: { token: string }) {
  const [contents, setContents] = useState<GitHubContentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

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

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
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

            <div className="h-[calc(100vh-140px)] px-6 pb-6 overflow-hidden">
              <MonacoEditor
                height="100vh"
                defaultLanguage={detectLanguage(selectedFile || "")}
                // theme={theme === "dark" ? "vs-dark" : "light"}
                theme="vs-dark"
                value={fileContent}
                options={{
                  readOnly: true,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  minimap: { enabled: true },
                  automaticLayout: true,
                  smoothScrolling: true,
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center text-[20px]">
            Select a file to view its contents.
          </p>
        )}
      </main>
    </div>
  );
}
