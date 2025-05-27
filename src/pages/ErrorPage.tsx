const ErrorPage = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0d1117] text-center px-4">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-red-600">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
