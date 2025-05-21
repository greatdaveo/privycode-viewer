import { div } from "framer-motion/client";
import { useEffect, useState } from "react";

type ViewerLink = {
  id: number;
  repo_name: string;
  token: string;
  expires_at: string;
  max_views: number;
  view_count: number;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState<{
    github_username: string;
    email: string;
  } | null>(null);

  const [links, setLinks] = useState<ViewerLink[]>([]);
  const [repoName, setRepoName] = useState("");
  const [expiresIn, setExpiresIn] = useState(3);
  const [maxViews, setMaxViews] = useState(100);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const token = localStorage.getItem("github_token");

  // To fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await fetch(`${BACKEND_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setUserInfo(data);
    };

    fetchUserInfo();
  }, []);

  // To fetch the viewer links on load
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to load viewer links");
        const data = await response.json();
        setLinks(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLinks();
  }, []);

  // Tp create the viewer link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/generate-viewer-link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo_name: repoName,
          expires_in_days: expiresIn,
          max_views: maxViews,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate link");

      const data = await response.json();

      console.log("Generated:", data);

      // To re-fetch links
      const updated = await fetch(`${BACKEND_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const refreshed = await updated.json();
      console.log(refreshed);

      setLinks(refreshed);
      setRepoName("");
      setMaxViews(100);
      setExpiresIn(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // To calculate the total links and views
  const totalLinks = links.length;
  const totalViews = links.reduce((sum, link) => sum + link.view_count, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">
          📊 Your Viewer Links Dashboard
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="bg-gray-100 dark:bg-[#161b22] rounded p-3 shadow-sm">
            <span className="font-semibold text-lg">{totalLinks}</span> total
            links
          </div>
          <div className="bg-gray-100 dark:bg-[#161b22] rounded p-3 shadow-sm">
            <span className="font-semibold text-lg">{totalViews}</span> total
            views
          </div>
        </div>

        {userInfo && (
          <>
            <div className="text-sm text-gray-500 mb-4">
              Welcome{" "}
              <span className="font-semibold">
                @{userInfo.github_username} 👋
              </span>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleCreateLink}
        className="bg-gray-50 dark:bg-[#161b22] border border-gray-300 dark:border-gray-700 p-6 rounded-lg mb-8 space-y-4"
      >
        <div>
          <label className="block font-semibold mb-1">GitHub Repo Name</label>
          <input
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            placeholder="e.g. my-private-repo"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">
              Expires In (days)
            </label>
            <input
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Max Views</label>
            <input
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition"
        >
          {loading ? "Creating..." : "Create Viewer Link"}
        </button>
      </form>

      {/* Viewer Links List */}
      {links.length === 0 ? (
        <p>No links created yet.</p>
      ) : (
        <div className="grid gap-6">
          {links.map((link, i) => (
            <div
              key={i}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-gray-50 dark:bg-[#161b22]"
            >
              <p className="font-semibold text-lg">{link.repo_name}</p>

              <p className="text-sm text-gray-500">
                Views: {link.view_count} / {link.max_views}
              </p>

              <p className="text-sm">
                Expires: {new Date(link.expires_at).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-2">
                <p className="text-sm text-blue-600 break-all">
                  {`${window.location.origin}/view/${link.token}`}
                </p>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/view/${link.token}`
                    );
                    setCopied(i);
                    setTimeout(() => setCopied(null), 2000);
                  }}
                  className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                >
                  Copy
                </button>
              </div>

              {copied === i && (
                <span className="text-green-500 text-xs">Copied!</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
