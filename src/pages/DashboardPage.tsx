import { useEffect, useState } from "react";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";
import { Search } from "lucide-react";

type ViewerLink = {
  ID: number;
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
  const [expiresIn, setExpiresIn] = useState(30);
  const [maxViews, setMaxViews] = useState(100);
  const [error, setError] = useState("");

  // For searching and filtering
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "expired" | "max views"
  >("all");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  // For editing and deleting of links
  const [editingLink, setEditingLink] = useState<ViewerLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<ViewerLink | null>(null);

  const token = localStorage.getItem("github_token");
  // console.log(token);

  // To fetch the viewer links on load
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response);

        if (!response.ok) {
          const text = await response.text(); // just in case
          console.log("❌ Failed to load viewer links: ", text);
          throw new Error(text);
        }

        const data = await response.json();
        setLinks(data);
      } catch (err: any) {
        // console.log(err);
        setError(err.message);
      }
    };

    fetchLinks();
  }, [token]);

  // To create the viewer link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanedRepoName = repoName.trim();

    try {
      const response = await fetch(`${BACKEND_URL}/generate-viewer-link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo_name: cleanedRepoName,
          expires_in_days: expiresIn,
          max_views: maxViews,
        }),
      });

      // console.log(response);

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 404) {
          setError(errText);
        } else {
          setError(`❌ Failed to create link: ${errText}`);
        }
        return;
      }

      await response.json();
      // const data = await response.json();
      // console.log("Generated:", data);

      // To re-fetch links
      const updated = await fetch(`${BACKEND_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const refreshed = await updated.json();
      // console.log(refreshed);

      setLinks(refreshed);
      setRepoName("");
      setMaxViews(100);
      setExpiresIn(30);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // To fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err: any) {
        console.error("❌ Error loading user info:", err);
        setError(err.message);
      }
    };

    if (token) fetchUserInfo();
  }, [token]);

  // For editing and deleting
  const refreshDashboard = async () => {
    const res = await fetch(`${BACKEND_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLinks(data);
  };

  const handleSaveEdit = async (expiresIn: number, maxViews: number) => {
    if (!editingLink) return;

    // console.log("Editing link ID:", editingLink);

    await fetch(`${BACKEND_URL}/update-link/${editingLink?.ID}`, {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        expires_in_days: expiresIn,
        max_views: maxViews,
      }),
    });

    await refreshDashboard();
    setEditingLink(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;

    // console.log("Deleting link ID:", deletingLink);

    await fetch(`${BACKEND_URL}/delete-link/${deletingLink.ID}`, {
      method: "DELETE",

      headers: {
        // Authorization: `Bearer ${token}`,
      },
    });

    await refreshDashboard();
    setDeletingLink(null);
  };

  // To calculate the total links and views
  const totalLinks = links.length;
  const totalViews = links.reduce((sum, link) => sum + link.view_count, 0);

  // To filter links based on search
  const now = new Date();

  const filteredLinks = links
    .filter((link) =>
      link.repo_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((link) => {
      if (filter === "active") return new Date(link.expires_at) > now;
      if (filter === "expired") return new Date(link.expires_at) <= now;
      if (filter === "max views") return link.view_count >= link.max_views;

      return true;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white px-6 py-12">
      <div className="flex flex-col gap-4 sm:gap-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">📊 Dashboard</h1>

          <div className="flex flex-wrap gap-2">
            {["all", "active", "expired", "max views"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 rounded border transition ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats, Greeting, Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {userInfo && (
            <div className="text-md text-gray-500">
              Welcome{" "}
              <span className="font-semibold">
                @{userInfo.github_username} 👋
              </span>
            </div>
          )}

          <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="bg-gray-100 dark:bg-[#161b22] rounded p-3 shadow-sm">
              <span className="font-semibold text-lg">{totalLinks}</span> total
              links
            </div>
            <div className="bg-gray-100 dark:bg-[#161b22] rounded p-3 shadow-sm">
              <span className="font-semibold text-lg">{totalViews}</span> total
              views
            </div>
          </div>

          {/* Search with icon */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search by repo name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
        </div>
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition cursor-pointer"
        >
          {loading ? "Creating..." : "Create Viewer Link"}
        </button>
      </form>

      {/* Viewer Links List */}
      {links.length === 0 ? (
        <p>No links created yet.</p>
      ) : (
        <div className="grid gap-6">
          {filteredLinks.map((link, i) => (
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

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditingLink(link)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  title="Edit viewer link"
                >
                  🖊️ Edit
                </button>

                <button
                  onClick={() => setDeletingLink(link)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  title="Delete viewer link"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingLink && (
        <EditModal
          onClose={() => setEditingLink(null)}
          onSave={handleSaveEdit}
          currentExpiresAt={editingLink.expires_at}
          currentMaxViews={editingLink.max_views}
        />
      )}

      {deletingLink && (
        <DeleteModal
          onCancel={() => setDeletingLink(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default DashboardPage;
