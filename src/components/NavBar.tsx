import { Code } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NavBar = () => {
  // const token = localStorage.getItem("github_token");
  // console.log(token);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/me`, {
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="container mx-auto flex justify-between items-center py-6 px-4 animate-fade-in-up">
      <Link to="/">
        <div className="flex items-center cursor-pointer">
          <Code className="h-8 w-8 text-blue-600 mr-2 animate-spin-slow" />
          <span className="text-3xl font-bold tracking-tight">PrivyCode</span>
        </div>
      </Link>

      {!isAuthenticated && (
        <a href={`${BACKEND_URL}/github/login`}>
          <button className="btn bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105">
            Connect GitHub
          </button>
        </a>
      )}

      {isAuthenticated && (
        <Link to="/dashboard">
          <button className="btn bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition transform hover:scale-105">
            Dashboard
          </button>
        </Link>
      )}
    </header>
  );
};

export default NavBar;
