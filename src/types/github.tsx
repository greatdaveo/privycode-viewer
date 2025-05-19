export interface GitHubContentItem {
  name: string;
  type: "file" | "dir";
  path: string;
  url: string;
}
