const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getUser = async () => {
  const token = localStorage.getItem("github_token");
  const response = await fetch(`${BACKEND_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
};

const authService = { getUser };

export default authService;
