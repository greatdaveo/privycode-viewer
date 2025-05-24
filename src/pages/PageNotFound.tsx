import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-50 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        404 - Page Not Found
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        The page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;
