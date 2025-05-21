import { GitHubContentItem } from "../types/github";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// console.log("BACKEND_URL", BACKEND_URL);

export async function fetchRepoContents(
  token: string
): Promise<GitHubContentItem[]> {
  const response = await fetch(`${BACKEND_URL}/view/${token}`);
  const data = await response.json();

  // console.log("fetchRepoContents:", data);

  if (!response.ok)
    throw new Error(data?.message || "Failed to fetch repo contents");

  return data;
}

export async function fetchFileContent(
  token: string,
  path: string
): Promise<string> {
  const response = await fetch(
    `${BACKEND_URL}/view-files/${token}/file?path=${encodeURIComponent(path)}`
  );

  console.log(response);

  if (!response.ok) throw new Error("Failed to fetch file content");

  return response.text();
}

export async function fetchUserInfo(token: string): Promise<{
  github_username: string;
  repo_name: string;
}> {
  const response = await fetch(`${BACKEND_URL}/view-info/${token}`);

  if (!response.ok) throw new Error("Failed to fetch viewer info");

  return response.json();
}
