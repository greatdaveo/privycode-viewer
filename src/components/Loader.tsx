const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
    </div>
  );
};

export default Loader;
