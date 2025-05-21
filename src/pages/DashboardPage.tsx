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
  const [links, setLinks] = useState<ViewerLink[]>([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("github_token"); // ✅ Store this at login

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load viewer links");
        const data = await res.json();
        setLinks(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">📊 Your Viewer Links</h1>

      {error && <p className="text-red-500">{error}</p>}

      {links.length === 0 ? (
        <p>No links created yet.</p>
      ) : (
        <div className="grid gap-6">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-gray-50 dark:bg-[#161b22]"
            >
              <p className="font-semibold text-lg">{link.repo_name}</p>
              <p className="text-sm text-gray-500">
                Views: {link.view_count} / {link.max_views}
              </p>
              <p className="text-sm">
                Expires: {new Date(link.expires_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-600 break-all">
                {`${window.location.origin}/view/${link.token}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
