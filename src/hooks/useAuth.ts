// src/hooks/useAuth.ts
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/me`, {
          credentials: "include",
        });
        setAuthenticated(res.ok);
      } catch {
        setAuthenticated(false);
      } finally {
        setChecked(true);
      }
    };
    check();
  }, []);

  return { authenticated, checked };
}
