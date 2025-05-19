import { useEffect, useState } from "react";
import { fetchRepoContents } from "../api/GitHubApi";
import { GitHubContentItem } from "../types/github";

export function ViewerPage({ token }: any) {
  const [contents, setContents] = useState<GitHubContentItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContents = async () => {
      try {
        const data = await fetchRepoContents(token);
        setContents(data);
        // console.log(data);
      } catch (error: any) {
        console.error("❌ Failed to load repo contents:", error);
        setError(error?.message || error);
      }
    };

    loadContents();
  }, [token]);

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-2">Repo Structure</h2>
        <ul>
          {contents.map((item) => (
            <li key={item.path}>
              {item?.type === "dir" ? "📁" : "📄"} {item.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-4">
        <p>Select a file to view its contents.</p>
      </main>
    </div>
  );
}
