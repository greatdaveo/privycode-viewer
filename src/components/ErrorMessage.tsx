interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="text-center mt-20 text-red-500">
      <p>
        ❌ {message || "Something went wrong. Please try reconnecting GitHub."}
      </p>
    </div>
  );
};

export default ErrorMessage;
