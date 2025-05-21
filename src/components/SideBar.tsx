import { JSX, useState } from "react";
import { GitHubContentItem } from "../types/github";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface SideBarProps {
  contents: GitHubContentItem[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  token: string;
}

const SideBar = ({
  contents,
  selectedFile,
  onSelectFile,
  token,
}: SideBarProps): JSX.Element => {
  const [expandedFolders, setExpandedFolders] = useState<{
    [path: string]: boolean;
  }>({});

  const [folderContents, setFolderContents] = useState<{
    [path: string]: GitHubContentItem[];
  }>({});

  const toggleFolder = async (path: string) => {
    const isExpanded = expandedFolders[path];
    setExpandedFolders((prev) => ({ ...prev, [path]: !isExpanded }));

    // If it has expanded or fetched, just skip
    if (isExpanded || folderContents[path]) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/view-folder/${token}?path=${encodeURIComponent(path)}`
      );

      console.log(response);

      if (!response.ok) throw new Error("Failed to fetch folder contents");

      const data: GitHubContentItem[] = await response.json();
      setFolderContents((prev) => ({ ...prev, [path]: data }));
    } catch (error: any) {
      console.log("Error loading folder: ", error);
    }
  };

  const renderItems = (items: GitHubContentItem[], indent = 0) => {
    return items.map((item) => {
      const isFolder = item.type === "dir";
      const isExpanded = expandedFolders[item.path];
      const subItems = folderContents[item.path];

      return (
        <div key={item.path}>
          <div
            className={`cursor-pointer px-2 py-1 rounded transition-all ${
              selectedFile === item.path ? "bg-blue-200 dark:bg-blue-800" : ""
            } hover:bg-gray-200 dark:hover:bg-gray-700`}
            style={{ paddingLeft: `${indent * 1.25}rem` }}
            onClick={() => {
              if (isFolder) {
                toggleFolder(item.path);
              } else {
                onSelectFile(item.path);
              }
            }}
          >
            {isFolder ? (isExpanded ? "📂" : "📁") : "📄"} {item.name}
          </div>

          {/* To show the items if folder is expanded */}
          {isFolder && isExpanded && subItems?.length > 0 && (
            <div>{renderItems(subItems, indent + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className="w-64 border-r bg-gray-50 dark:bg-[#121212] overflow-y-auto p-4">
      <h2 className="font-semibold mb-4 text-lg">📁 Repository Files</h2>

      <div className="space-y-1">{renderItems(contents)}</div>
    </aside>
  );
};

export default SideBar;
