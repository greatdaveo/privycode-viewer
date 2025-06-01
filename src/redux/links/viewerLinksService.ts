const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getViewerLinks = async () => {
  const token = localStorage.getItem("github_token");
  if (!token) throw new Error("❌ Missing GitHub Token");

  const response = await fetch(`${BACKEND_URL}/dashboard`, {
    headers: {
      AUthorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch viewer links");
  }

  return await response.json();
};

const createViewerLink = async (payload: {
  repo_name: string;
  expires_in_days: number;
  max_views: number;
}) => {
  const token = localStorage.getItem("github_token");
  const response = await fetch(`${BACKEND_URL}/generate-viewer-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText);
  }

  return await response.json();
};

const updateViewerLink = async ({
  id,
  max_views,
  expires_in_days,
}: {
  id: number;
  max_views: number;
  expires_in_days: number;
}) => {
  const token = localStorage.getItem("github_token");

  const response = await fetch(`${BACKEND_URL}/update-link/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ max_views, expires_in_days }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText);
  }

  return await response.json();
};

const deleteViewerLink = async (id: number) => {
  const token = localStorage.getItem("github_token");
  const response = await fetch(`${BACKEND_URL}/delete-link/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText);
  }

  return id;
};

const viewerLinksService = {
  getViewerLinks,
  createViewerLink,
  deleteViewerLink,
  updateViewerLink,
};

export default viewerLinksService;
