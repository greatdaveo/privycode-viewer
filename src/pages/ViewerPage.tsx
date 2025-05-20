import { useEffect, useState } from "react";
import { fetchFileContent, fetchRepoContents } from "../api/GitHubApi";
import { GitHubContentItem } from "../types/github";
import SideBar from "../componets/SideBar";

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

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="flex h-screen text-sm bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-mono">
      <SideBar
        contents={contents}
        selectedFile={selectedFile}
        onSelectFile={handleFileClick}
        token={token}
      />

      <main className="flex-1 overflow-auto p-6">
        {selectedFile ? (
          <>
            <h3 className="mb-4 font-bold text-base border-b pb-2">
              📄 {selectedFile}
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-[80vh] whitespace-pre-wrap break-words">
              {fileContent}
            </pre>
          </>
        ) : (
          <p className="text-gray-500">Select a file to view its contents.</p>
        )}
      </main>
    </div>
  );
}
