import { Link, useSearchParams } from "react-router-dom";
import HomePageImg from "../assets/3AEC1F23-5579-4D09-B1BF-810C835AA3CC.jpeg";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (message === "connect_github") {
      alert("Please connect your GitHub to access your dashboard!");
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/me`, {
          credentials: "include",
        });

        setAuthenticated(res.ok);
      } catch (err) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, [message]);

  return (
    <div className="min-h-screen">
      <main className="flex-1 container mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 px-4 py-16">
        <aside className="lg:w-1/2 text-center lg:text-left animate-fade-in-up delay-150">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Share Your Private <br />
            GitHub Repositories
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            PrivyCode is a secure platform that allows developers to share
            read-only access to private GitHub repositories using expiring
            viewer links. Ideal for showcasing work to recruiters without
            exposing sensitive code.
          </p>

          <div className="flex justify-center lg:justify-start">
            {authenticated ? (
              <Link to={"/dashboard"}>
                <button className="btn px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition transform hover:scale-105 animate-fade-in-up delay-300">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <a href={`${BACKEND_URL}/github/login`}>
                <button className="btn px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition transform hover:scale-105 animate-fade-in-up delay-300">
                  Connect GitHub
                </button>
              </a>
            )}
          </div>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 animate-fade-in delay-500">
            Developed by David Olowomeye ·{" "}
            <a
              href="https://github.com/greatdaveo"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              GitHub ↗
            </a>
          </p>
        </aside>

        <div className="lg:w-1/2 flex justify-center animate-fade-in-up delay-200">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-100 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>

            <img
              src={HomePageImg}
              alt="Secure repo sharing"
              className="relative rounded-2xl shadow-2xl w-full max-w-lg hover:shadow-4xl transition-shadow transform hover:scale-102"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
