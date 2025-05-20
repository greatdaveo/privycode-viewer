import { GitHubContentItem } from "../types/github";

interface SideBarProps {
  contents: GitHubContentItem[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

const SideBar = ({ contents, selectedFile, onSelectFile }: SideBarProps) => {
  return (
    <aside className="w-64 border-r bg-gray-50 dark:bg-[#121212] overflow-y-auto p-4">
      <h2 className="font-semibold mb-4 text-lg">📁 Repository Files</h2>

      <ul className="space-y-1">
        {contents.map((item) => (
          <li
            key={item.path}
            onClick={() => item.type === "file" && onSelectFile(item.path)}
            className={`cursor-pointer px-3 py-2 rounded transition-all 
              ${
                item.type === "file"
                  ? "hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "opacity-60"
              } 
              ${
                selectedFile === item.path ? "bg-blue-200 dark:bg-blue-800" : ""
              }
            `}
          >
            {item.type === "dir" ? "📁" : "📄"} {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
