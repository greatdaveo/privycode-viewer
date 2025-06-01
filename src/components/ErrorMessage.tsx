import { useNavigate } from "react-router-dom";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0d1117] px-4">
      <div className="max-w-md w-full text-center bg-red-50 dark:bg-[#161b22] border border-red-200 dark:border-red-600 rounded-xl p-6 shadow-md">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">
          {message || "Something went wrong. Please try reconnecting GitHub."}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition"
        >
          🔙 Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
